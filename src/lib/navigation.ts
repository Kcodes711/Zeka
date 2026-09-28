import type { Href } from "expo-router";

type RouterLike = {
  replace: (href: Href) => void;
};

export type UserRole = "picker" | "poster";

export const ROLE_PATHS: Record<UserRole, Href> = {
  picker: "/worker-home",
  poster: "/poster-home",
};

export function navigateToRole(router: RouterLike, role: UserRole) {
  const target = ROLE_PATHS[role];
  router.replace(target);
}

export function goHome(router: RouterLike) {
  router.replace("/");
}
