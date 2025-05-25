import { useEffect, useState, useRef } from 'react';

function StoryViewer({ stories, activeIndex, onClose }) {
  const [index, setIndex] = useState(activeIndex);
  const timerRef = useRef(null);

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
    timerRef.current = setTimeout(goNext, 5000);
    return () => clearTimeout(timerRef.current);
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
      <img
        src={stories[index].image}
        alt={`Story ${index}`}
        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
      />
    </div>
  );
}

export default StoryViewer;
