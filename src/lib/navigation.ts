export const APP_ROOTS = ["/", "/statistics", "/mother", "/baby", "/knowledge", "/profile"];

export function isRouteActive(pathname: string, root: string) {
  return root === "/" ? pathname === "/" : pathname === root || pathname.startsWith(`${root}/`);
}

/** A direct visit always has a predictable parent, even without browser history. */
export function parentRoute(pathname: string) {
  if (isRouteActive(pathname, "/tracking") || pathname === "/activity" || pathname === "/vaccination-schedule") return "/baby";
  if (isRouteActive(pathname, "/mother")) return "/mother";
  if (isRouteActive(pathname, "/profile")) return "/profile";
  if (isRouteActive(pathname, "/stories") && pathname !== "/stories") return "/stories";
  if (isRouteActive(pathname, "/knowledge") || pathname === "/stories" || pathname === "/assistant") return "/knowledge";
  return "/";
}

export type BackTarget = { href: string; delta: number };

/** Mirrors only entries created during this authenticated shell's lifetime. */
export class NavigationLedger {
  private entries: string[];
  index = 0;

  constructor(href: string) {
    this.entries = [href];
  }

  push(href: string) {
    this.entries = [...this.entries.slice(0, this.index + 1), href];
    this.index += 1;
  }

  replace(href: string) {
    this.entries[this.index] = href;
  }

  traverse(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) return false;
    this.index = index;
    return true;
  }

  previous(): BackTarget | undefined {
    const pathname = this.entries[this.index].split(/[?#]/)[0];
    for (let index = this.index - 1; index >= 0; index -= 1) {
      if (this.entries[index].split(/[?#]/)[0] !== pathname) {
        return { href: this.entries[index], delta: index - this.index };
      }
    }
  }
}
