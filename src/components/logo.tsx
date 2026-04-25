import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** Render only the lit "GAME ON!" wordmark (no frame). */
  bare?: boolean;
};

/**
 * LED dot-matrix wordmark for "GAME ON!". Built as a single inline SVG so it
 * scales crisply to any size. The visible dot pattern is masked by chunky
 * Impact-style text — the same technique as the static logo-B SVG, ported to
 * a React component with stable IDs.
 */
export function Logo({ className, bare = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 720 260"
      role="img"
      aria-label="Game On!"
      className={cn("block", className)}
    >
      <defs>
        <pattern id="logo-dots-lit" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#0a0a0a" />
          <circle cx="5" cy="5" r="3.4" fill="#ffb100" />
          <circle cx="5" cy="5" r="2.0" fill="#ffe08a" />
        </pattern>
        <pattern id="logo-dots-dim" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#0a0a0a" />
          <circle cx="5" cy="5" r="3.4" fill="#3a2a08" />
        </pattern>
        <filter id="logo-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="logo-text-mask">
          <rect width="720" height="260" fill="#000" />
          <text
            x="360"
            y="180"
            fontSize="180"
            fontWeight="900"
            textAnchor="middle"
            fill="#fff"
            fontFamily="Impact, 'Arial Black', system-ui, sans-serif"
            letterSpacing="-2"
          >
            GAME ON!
          </text>
        </mask>
      </defs>

      {!bare && (
        <>
          <rect width="720" height="260" fill="#080808" />
          <rect x="6" y="6" width="708" height="248" rx="6" fill="url(#logo-dots-dim)" opacity="0.55" />
        </>
      )}

      <g filter="url(#logo-glow)">
        <rect width="720" height="260" fill="url(#logo-dots-lit)" mask="url(#logo-text-mask)" />
      </g>

      {!bare && (
        <>
          <rect x="6" y="6" width="708" height="248" rx="6" fill="none" stroke="#2a2a2a" strokeWidth="2" />
          <rect x="2" y="2" width="716" height="256" rx="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

/** Small square mark for tight spaces — single LED ball with a glow. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Game On!" className={cn("block", className)}>
      <defs>
        <radialGradient id="mark-led" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d0" />
          <stop offset="35%" stopColor="#ffd766" />
          <stop offset="70%" stopColor="#ffb100" />
          <stop offset="100%" stopColor="#3a2400" />
        </radialGradient>
        <filter id="mark-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0a0a0a" />
      <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="#23262e" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="20" fill="#ffb100" filter="url(#mark-glow)" opacity="0.55" />
      <circle cx="32" cy="32" r="14" fill="url(#mark-led)" />
      <circle cx="28" cy="27" r="3.5" fill="#fff6d0" opacity="0.85" />
    </svg>
  );
}
