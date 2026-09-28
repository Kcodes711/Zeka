import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "zeka-posted-tasks";
const CLEAN_STORAGE_KEY = "zeka-live-tasks-v2";

export const TASK_CATEGORIES = [
  "Small errands",
  "Cleaning",
  "Gardening",
  "Delivery",
  "Document collection",
  "Queue standing",
  "Moving furniture",
  "Basic plumbing",
  "Car washing",
  "Home help",
  "General labour",
  "Other",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export type TaskBid = {
  id: string;
  taskId: string;
  workerId: string;
  workerName: string;
  amount: number;
  message: string;
  createdAt: number;
  status: "Pending" | "Accepted";
};

export type PostedTask = {
  id: string;
  category: TaskCategory;
  title: string;
  description: string;
  location: string;
  budget: number;
  deadline: string;
  status: "Open" | "In progress" | "Completed";
  workerStatus?: "Active" | "Completed";
  offerCount: number;
  acceptedBidId?: string;
  bids: TaskBid[];
  createdAt: number;
};

type NewPostedTask = Omit<
  PostedTask,
  "id" | "status" | "offerCount" | "createdAt" | "bids" | "acceptedBidId"
> & {
  bids?: TaskBid[];
  acceptedBidId?: string;
};

function normalizeTask(task: Partial<PostedTask> & { id: string }): PostedTask {
  const bids = Array.isArray(task.bids) ? task.bids : [];

  return {
    id: task.id,
    category: task.category ?? "Small errands",
    title: task.title ?? "",
    description: task.description ?? "",
    location: task.location ?? "",
    budget: Number(task.budget ?? 0),
    deadline: task.deadline ?? "",
    status: task.status ?? "Open",
    workerStatus: task.workerStatus,
    offerCount:
      typeof task.offerCount === "number" ? task.offerCount : bids.length,
    acceptedBidId: task.acceptedBidId,
    bids,
    createdAt: task.createdAt ?? Date.now(),
  };
}

let postedTasks: PostedTask[] = [];
let nextTaskId = 0;
const listeners = new Set<() => void>();
let hydrationPromise: Promise<void> | undefined;
let mutationQueue = Promise.resolve();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return postedTasks;
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function hydrateTasks() {
  hydrationPromise ??= Promise.all([
    AsyncStorage.getItem(CLEAN_STORAGE_KEY),
    AsyncStorage.removeItem(STORAGE_KEY),
  ])
    .then(([storedTasks]) => {
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks) as Partial<PostedTask>[];
        if (Array.isArray(parsedTasks)) {
          postedTasks = parsedTasks.map((task) =>
            normalizeTask(task as Partial<PostedTask> & { id: string }),
          );
        }
      }
    })
    .catch(() => undefined)
    .finally(notifyListeners);
  return hydrationPromise;
}

function commitTasks(update: (currentTasks: PostedTask[]) => PostedTask[]) {
  const commit = mutationQueue
    .catch(() => undefined)
    .then(async () => {
      await hydrateTasks();
      const nextTasks = update(postedTasks).map((task) => normalizeTask(task));
      await AsyncStorage.setItem(CLEAN_STORAGE_KEY, JSON.stringify(nextTasks));
      postedTasks = nextTasks;
      notifyListeners();
    });
  mutationQueue = commit;
  return commit;
}

export function addPostedTask(task: NewPostedTask) {
  return commitTasks((currentTasks) => {
    nextTaskId += 1;
    return [
      {
        ...task,
        id: `posted-${Date.now()}-${nextTaskId}`,
        category: task.category || "Small errands",
        status: "Open",
        offerCount: 0,
        acceptedBidId: undefined,
        bids: task.bids ?? [],
        createdAt: Date.now(),
      },
      ...currentTasks,
    ];
  });
}

export function addBidToTask(
  taskId: string,
  bid: {
    workerId: string;
    workerName?: string;
    amount: number;
    message?: string;
  },
) {
  return commitTasks((currentTasks) =>
    currentTasks.map((task) => {
      if (task.id !== taskId || task.status !== "Open") {
        return task;
      }

      const nextBid: TaskBid = {
        id: `bid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        taskId: task.id,
        workerId: bid.workerId,
        workerName: bid.workerName || "Worker",
        amount: Number(bid.amount) || 0,
        message: (bid.message ?? "").trim(),
        createdAt: Date.now(),
        status: "Pending",
      };

      const nextBids = [nextBid, ...task.bids];

      return {
        ...task,
        bids: nextBids,
        offerCount: nextBids.length,
      };
    }),
  );
}

export function acceptBidForTask(taskId: string, bidId: string) {
  return commitTasks((currentTasks) =>
    currentTasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const matchedBid = task.bids.find((bid) => bid.id === bidId);
      if (!matchedBid) {
        return task;
      }

      const nextBids: TaskBid[] = task.bids.map((bid) => ({
        ...bid,
        status: bid.id === bidId ? "Accepted" : "Pending",
      }));

      return {
        ...task,
        bids: nextBids,
        acceptedBidId: bidId,
        offerCount: nextBids.length,
        status: "In progress",
        workerStatus: "Active",
      };
    }),
  );
}

export function claimPostedTask(taskId: string) {
  return commitTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId && task.status === "Open"
        ? { ...task, status: "In progress", workerStatus: "Active" }
        : task,
    ),
  );
}

export function releasePostedTask(taskId: string) {
  return commitTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId && task.workerStatus === "Active"
        ? {
            ...task,
            status: "Open",
            workerStatus: undefined,
            acceptedBidId: undefined,
            bids: task.bids.map(
              (bid): TaskBid =>
                bid.status === "Accepted" ? { ...bid, status: "Pending" } : bid,
            ),
          }
        : task,
    ),
  );
}

export function completePostedTask(taskId: string) {
  return commitTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId && task.workerStatus === "Active"
        ? { ...task, status: "Completed", workerStatus: "Completed" }
        : task,
    ),
  );
}

export function getPostedTask(taskId: string) {
  return postedTasks.find((task) => task.id === taskId);
}

export function updatePostedTask(
  taskId: string,
  updates: Partial<Omit<PostedTask, "id" | "createdAt" | "offerCount">>,
) {
  return commitTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task,
    ),
  );
}

export function deletePostedTask(taskId: string) {
  return commitTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== taskId),
  );
}

export function usePostedTasks() {
  useEffect(() => {
    void hydrateTasks();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function getHydrationSnapshot() {
  return hydrationPromise !== undefined;
}

export function useTasksHydrated() {
  useEffect(() => {
    void hydrateTasks();
  }, []);
  return useSyncExternalStore(
    subscribe,
    getHydrationSnapshot,
    getHydrationSnapshot,
  );
}
