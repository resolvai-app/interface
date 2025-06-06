"use client";

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <svg
        className="w-full h-full animate-wave-move"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00fff0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0077ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff00cc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3300ff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M0,224 C360,320 1080,128 1440,224 L1440,320 L0,320 Z" fill="url(#waveGradient1)">
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="M0,224 C360,320 1080,128 1440,224 L1440,320 L0,320 Z;
                    M0,200 C400,280 1040,160 1440,200 L1440,320 L0,320 Z;
                    M0,224 C360,320 1080,128 1440,224 L1440,320 L0,320 Z"
          />
        </path>
        <path d="M0,256 C480,320 960,160 1440,256 L1440,320 L0,320 Z" fill="url(#waveGradient2)">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="M0,256 C480,320 960,160 1440,256 L1440,320 L0,320 Z;
                    M0,240 C520,300 920,180 1440,240 L1440,320 L0,320 Z;
                    M0,256 C480,320 960,160 1440,256 L1440,320 L0,320 Z"
          />
        </path>
      </svg>
      <style jsx>{`
        .animate-wave-move {
          animation: waveMove 30s linear infinite;
        }
        @keyframes waveMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-10%);
          }
        }
      `}</style>
    </div>
  );
}
