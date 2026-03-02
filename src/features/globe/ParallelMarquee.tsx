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
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            overflow: 'hidden',
        }}>
            <div className={`relative h-screen w-screen overflow-hidden ${className}`}>
                <div
                    className="absolute inset-0"
                    style={{
                        transformOrigin: 'right center',
                        transform:
                            'perspective(100vw) rotateY(60deg) skewX(0.10256deg) skewY(-0.10256deg)',
                    }}
                >
                    <div className="absolute right-0 top-35 flex h-80 w-screen items-center justify-end overflow-hidden py-5">
                        <div className="w-max whitespace-nowrap text-[100px] leading-none text-[#00e5cc] animate-[moveX_8s_linear_forwards]">
                            {topText}
                        </div>
                    </div>

                    <div className="absolute bottom-35 right-0 flex h-80 w-screen items-center justify-end overflow-hidden py-5">
                        <div className="w-max whitespace-nowrap text-[250px] leading-none text-white animate-[moveX_8s_linear_forwards]">
                            {bottomText}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes moveX {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(calc(-100vw - 100%));
                    }
                    }
                `}</style>
            </div>

        </div>
    );
}
