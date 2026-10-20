import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Header } from "@/components/layout/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="not-found">
        <p className="not-found-code">404</p>
        <div className="not-found-content">
          <div className="section-rule page-hero-fade">
            <span>Page not found</span>
            <i />
          </div>
          <h1 className="not-found-title">
            <span className="line-mask" style={{ "--line-index": 0 } as CSSProperties}>
              <span>This address</span>
            </span>
            <span className="line-mask line-mask-offset" style={{ "--line-index": 1 } as CSSProperties}>
              <span>is vacant.</span>
            </span>
          </h1>
          <p className="not-found-copy page-hero-fade">
            The page you were looking for has moved or never existed. Let us help you find the right place.
          </p>
          <div className="not-found-links page-hero-fade">
            <Link className="intent-link" href="/properties">
              <span className="intent-link-swap">
                <span>Browse properties</span>
                <span aria-hidden="true">Browse properties</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
            <Link className="intent-link" href="/">
              <span className="intent-link-swap">
                <span>Back to home</span>
                <span aria-hidden="true">Back to home</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
