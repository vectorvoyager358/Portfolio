export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="atmosphere-mesh absolute -top-24 -right-16 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-mix-a),transparent_68%)] blur-2xl" />
      <div className="atmosphere-orb absolute top-[22%] left-[-10%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-mix-b),transparent_70%)] blur-3xl" />
      <div className="atmosphere-orb absolute right-[8%] bottom-[12%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-mix-c),transparent_72%)] blur-3xl [animation-delay:1.6s]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="signal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3EE0C5" stopOpacity="0" />
            <stop offset="45%" stopColor="#3EE0C5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7EB8FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-40 420 C 180 260, 260 540, 480 360 S 820 220, 1100 400"
          fill="none"
          stroke="url(#signal)"
          strokeWidth="1.2"
        />
        <path
          d="M-20 500 C 200 340, 300 600, 540 440 S 860 280, 1140 460"
          fill="none"
          stroke="url(#signal)"
          strokeWidth="0.8"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
