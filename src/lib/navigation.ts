import type { Href, Router } from "expo-router";

export type UserRole = "picker" | "poster";

export const ROLE_PATHS: Record<UserRole, Href> = {
  picker: "/worker-home",
  poster: "/poster-home",
};

export function navigateToRole(router: Router, role: UserRole) {
  const target = ROLE_PATHS[role];
  router.replace(target);
}

export function goHome(router: Router) {
  router.replace("/");
}
