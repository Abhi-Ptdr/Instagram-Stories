import { useEffect, useState } from 'react';

function StoryList({ onSelect }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch('/stories.json')
      .then(res => res.json())
      .then(data => setStories(data));
  }, []);

  return (
    <div className="flex overflow-x-auto px-4 py-2 space-x-3">
      {stories.map(story => (
        <img
          key={story.id}
          src={story.image}
          alt={`Story ${story.id}`}
          className="w-20 h-32 object-cover rounded-lg border-2 border-white cursor-pointer flex-shrink-0"
          onClick={() => onSelect(story.id)}
        />
      ))}
    </div>
  );
}

export default StoryList;
