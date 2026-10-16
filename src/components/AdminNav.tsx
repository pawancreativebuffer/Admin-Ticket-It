"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// menu items from the legacy admin navigation, drawn in the New-Frontend navigation-bar style;
// items with a page link to it, the rest only highlight on click (design only)
const NAV_ITEMS: { label: string; href?: string; paths?: string[] }[] = [
  { label: "User Administration", href: "/", paths: ["/", "/edit-user"] },
  { label: "Import Client Data" },
  { label: "Use Report", href: "/use-report", paths: ["/use-report"] },
  { label: "Client Administration", href: "/client-administration", paths: ["/client-administration", "/client-administration/edit", "/client-administration/create"] },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [clicked, setClicked] = useState<string | null>(null);

  // the item whose page is open wins; otherwise the last clicked placeholder item
  const routeActive = NAV_ITEMS.find((item) => item.paths?.includes(pathname))?.label;
  const active = routeActive ?? clicked;

  return (
    <nav className="navigation-bar">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className={item.label === active ? "active" : undefined}>
                {item.label}
              </Link>
            ) : (
              <a
                href="#"
                className={item.label === active ? "active" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setClicked(item.label);
                }}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
