"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

export const ProfileLabelContext = createContext("Hồ sơ");

export function ProfileShortcut() {
  const label = useContext(ProfileLabelContext);
  const active = usePathname().startsWith("/profile");
  return (
    <Link
      href="/profile"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/15 bg-secondary text-primary transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
    >
      <Image
        src="/icons/vani-photo-192.png"
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full object-cover"
      />
    </Link>
  );
}
