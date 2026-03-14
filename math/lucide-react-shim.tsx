import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

function icon(paths: React.ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const BookOpen = icon(
  <>
    <path d="M2 6.5C2 5.1 3.1 4 4.5 4H10c1.1 0 2 .9 2 2v14c0-1.1-.9-2-2-2H4.5A2.5 2.5 0 0 0 2 20.5z" />
    <path d="M22 6.5C22 5.1 20.9 4 19.5 4H14c-1.1 0-2 .9-2 2v14c0-1.1.9-2 2-2h5.5a2.5 2.5 0 0 1 2 2.5z" />
  </>
);
export const ArrowLeft = icon(<path d="M19 12H5M12 19l-7-7 7-7" />);
export const CheckCircle = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </>
);
export const Circle = icon(<circle cx="12" cy="12" r="9" />);
export const Calculator = icon(
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8" />
  </>
);
export const TrendingUp = icon(<path d="M3 17l6-6 4 4 7-8M14 7h6v6" />);
export const Shapes = icon(
  <>
    <circle cx="7.5" cy="7.5" r="3.5" />
    <path d="M14 4h6v6h-6zM14 14l3-5 3 5zM4 16h7v4H4z" />
  </>
);
export const Grid3x3 = icon(
  <>
    <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
  </>
);
export const ChevronRight = icon(<path d="m9 18 6-6-6-6" />);
export const FileText = icon(
  <>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5M9 13h6M9 17h6M9 9h2" />
  </>
);
export const Lightbulb = icon(
  <>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.5 1.3 1.4 1.5 2.3h5c.2-.9.8-1.8 1.5-2.3A7 7 0 0 0 12 2z" />
  </>
);
export const Target = icon(
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </>
);
export const X = icon(<path d="M18 6 6 18M6 6l12 12" />);
export const ClipboardList = icon(
  <>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4.5h6M9 9h6M9 13h6M9 17h4M7.5 9h.01M7.5 13h.01M7.5 17h.01" />
  </>
);
export const Brain = icon(
  <>
    <path d="M9.5 4a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 5 12a3 3 0 0 0 4.5 2.6V4zM14.5 4a3 3 0 0 1 5 2.2A3.2 3.2 0 0 1 19 12a3 3 0 0 1-4.5 2.6V4z" />
    <path d="M12 4v16M9 8.5c1 .7 2 .7 3 0M12 12c1 .8 2 .8 3 0" />
  </>
);
export const Sparkles = icon(
  <>
    <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
    <path d="M5 3v2M4 4h2M19 17v2M18 18h2M5 15v1M4.5 15.5h1M19 5v1M18.5 5.5h1" />
  </>
);
export const BookMarked = icon(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6 2h11a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V4a2 2 0 0 1 2-2z" />
  </>
);
