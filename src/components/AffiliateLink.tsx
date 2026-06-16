import type { ReactNode } from "react";

/**
 * An outbound affiliate / referral link. Opens in a new tab and carries the
 * correct rel for paid links (`sponsored`) so we stay on the right side of
 * Google and the FTC. Pair the page with <AffiliateDisclosure /> for the
 * visible disclosure. Resolve `href` with partnerHref() / amazonSearch().
 */
export default function AffiliateLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
