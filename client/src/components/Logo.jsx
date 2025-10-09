export default function Logo({ className = '', withText = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LiryX logo"
        role="img"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="#0b0b0b" />
        <g>
          <path
            d="M40 28v56c0 10.493 8.507 19 19 19h29"
            stroke="url(#g)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M64 48c8 0 12 6 20 6s12-6 20-6"
            stroke="url(#g)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.7"
            fill="none"
          />
          <path
            d="M64 64c8 0 12 6 20 6s12-6 20-6"
            stroke="url(#g)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.45"
            fill="none"
          />
          <g transform="translate(16 16)" opacity="0.9">
            <path d="M84 84l-10-10M74 84l10-10" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      {withText && (
        <span className="text-xl font-semibold tracking-wide">
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">LiryX</span>
        </span>
      )}
    </div>
  )
}
