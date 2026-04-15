// Popcorn logo — use as <PopcornLogo size={24} /> anywhere in the app
export default function PopcornLogo({ size = 24, color = "#F06820" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Popcorn"
    >
      {/* Bucket body */}
      <path
        d="M5 10 L6.5 20 H17.5 L19 10 Z"
        fill={color}
        opacity="0.15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Bucket stripes */}
      <line x1="9.5" y1="10" x2="8.5" y2="20" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="14.5" y1="10" x2="15.5" y2="20" stroke={color} strokeWidth="1" opacity="0.5" />

      {/* Rim */}
      <rect
        x="4.5"
        y="9"
        width="15"
        height="2"
        rx="1"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
      />

      {/* Popcorn pieces */}
      {/* left */}
      <circle cx="7.5" cy="7" r="2" fill={color} />
      {/* center */}
      <circle cx="12" cy="5.5" r="2.2" fill={color} />
      {/* right */}
      <circle cx="16.5" cy="7" r="2" fill={color} />
      {/* left-inner */}
      <circle cx="10" cy="6.5" r="1.6" fill={color} opacity="0.85" />
      {/* right-inner */}
      <circle cx="14" cy="6.5" r="1.6" fill={color} opacity="0.85" />
    </svg>
  );
}
