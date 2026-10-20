"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { primaryNavigation as navigation } from "@/data/navigation";
import { gsap, motionDurations, motionEasings } from "@/lib/gsap";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menuOpen || !menu) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    );
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const context = gsap.context(() => {
      gsap.fromTo(
        menu,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: motionDurations.slow,
          ease: motionEasings.cinematic,
        },
      );
      gsap.fromTo(
        ".mobile-menu-link",
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: motionDurations.slow,
          ease: motionEasings.enter,
          stagger: 0.055,
          delay: 0.12,
        },
      );
    }, menu);

    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      context.revert();
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocus?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header" data-header>
        <Link className="site-wordmark" href="/" aria-label="Elite Properties home">
          Elite Properties
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              className="header-link"
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="header-enquire" href="/contact">
          <span>Enquire</span>
          <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.5} />
        </Link>

        <button
          ref={menuButtonRef}
          className="mobile-menu-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(true)}
        >
          <Menu aria-hidden="true" size={18} strokeWidth={1.5} />
          <span>Menu</span>
        </button>
      </header>

      {menuOpen ? (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          data-lenis-prevent
        >
          <div className="mobile-menu-topline">
            <span className="site-wordmark">Elite Properties</span>
            <button className="mobile-menu-close" type="button" onClick={closeMenu} aria-label="Close menu">
              <X aria-hidden="true" size={21} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="mobile-navigation" aria-label="Mobile primary navigation">
            {navigation.map((item) => (
              <div key={item.label} className="mobile-menu-link-mask">
                <Link
                  className="mobile-menu-link"
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <Link className="mobile-menu-enquire" href="/contact" onClick={closeMenu}>
            Enquire
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </Link>
        </div>
      ) : null}
    </>
  );
}
