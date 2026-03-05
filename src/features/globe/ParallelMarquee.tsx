"use client"

type ParallelMarqueeProps = {
  topText?: string;
  bottomText?: string;
  className?: string;
};

export default function ParallelMarquee({
  topText = 'BALIKESIR UNIVERSITY',
  bottomText = 'INTERNATIONAL STUDENTS',
  className = '',
}: ParallelMarqueeProps) {
  return (
    <div className="fixed inset-0 z-9999 pointer-events-none overflow-hidden">
      <div className={`relative h-screen w-screen overflow-hidden ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            transformOrigin: 'right center',
            transform:
              'perspective(100vw) rotateY(50deg) skewX(0.10256deg) skewY(-0.10256deg)',
          }}
        >
          {/* Üst yazı — parlak teal, glow efektli */}
          <div className="absolute right-0 top-35 flex h-80 w-screen items-center justify-end overflow-hidden py-5">
            <div
              className="w-max whitespace-nowrap text-[100px] leading-none font-bold animate-[moveX_8s_linear_forwards]"
              style={{
                color: '#0094c0',
                textShadow:
                  '0 0 40px rgba(0,148,192,0.4), 0 0 80px rgba(0,148,192,0.15)',
              }}
            >
              {topText}
            </div>
          </div>

          {/* Alt yazı — açık beyaz, hafif teal yansıması */}
          <div className="absolute bottom-35 right-0 flex h-80 w-screen items-center justify-end overflow-hidden py-5">
            <div
              className="w-max whitespace-nowrap text-[250px] leading-none font-semibold animate-[moveX_8s_linear_forwards]"
              style={{
                color: 'rgba(255,255,255,0.9)',
                textShadow:
                  '0 0 60px rgba(0,148,192,0.25), 0 4px 30px rgba(0,0,0,0.5)',
              }}
            >
              {bottomText}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes moveX {
            from { transform: translateX(100%); }
            to   { transform: translateX(calc(-100vw - 100%)); }
          }
        `}</style>
      </div>
    </div>
  );
}