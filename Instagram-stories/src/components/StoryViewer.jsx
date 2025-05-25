import { useEffect, useState, useRef } from 'react';

function StoryViewer({ stories, activeIndex, onClose }) {
    const [index, setIndex] = useState(activeIndex);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);
    const progressRef = useRef(null);

    const goNext = () => {
        if (index < stories.length - 1) {
            setIndex(index + 1);
        } else {
            onClose();
        }
    };

    const goPrev = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    useEffect(() => {
        setProgress(0);

        let start = Date.now();
        const duration = 5000;

        function animate() {
            const elapsed = Date.now() - start;
            const pct = Math.min((elapsed / duration) * 100, 100);
            setProgress(pct);

            if (pct < 100) {
                progressRef.current = requestAnimationFrame(animate);
            }
        }

        animate();
        timerRef.current = setTimeout(goNext, duration);

        return () => {
            clearTimeout(timerRef.current);
            cancelAnimationFrame(progressRef.current);
        };
    }, [index]);

    const handleClick = (e) => {
        const x = e.nativeEvent.offsetX;
        const width = e.target.offsetWidth;
        x < width / 2 ? goPrev() : goNext();
    };

    return (
        <div
            onClick={handleClick}
            className="fixed top-0 left-0 w-screen h-screen bg-black z-50 flex items-center justify-center"
        >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                <div
                    className="h-full bg-red-700 transition-all duration-100 linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-4 right-4 bottom-4 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition"
                aria-label="Close"
            >
                <span className="text-2xl leading-none">&times;</span>
            </button>

            {/* Story image */}
            <img
                src={stories[index].image}
                alt={`Story ${index}`}
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            />
        </div>
    );
}

export default StoryViewer;
