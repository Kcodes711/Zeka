import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "zeka-posted-tasks";
const CLEAN_STORAGE_KEY = "zeka-live-tasks-v2";

export type PostedTask = {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  deadline: string;
  status: "Open" | "In progress" | "Completed";
  workerStatus?: "Active" | "Completed";
  offerCount: number;
  createdAt: number;
};

type NewPostedTask = Omit<
  PostedTask,
  "id" | "status" | "offerCount" | "createdAt"
>;

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
        const parsedTasks = JSON.parse(storedTasks) as PostedTask[];
        if (Array.isArray(parsedTasks)) {
          postedTasks = parsedTasks;
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
      const nextTasks = update(postedTasks);
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
        status: "Open",
        offerCount: 0,
        createdAt: Date.now(),
      },
      ...currentTasks,
    ];
  });
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
        ? { ...task, status: "Open", workerStatus: undefined }
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
