import { useState, useEffect } from 'react';
import StoryList from './components/StoryList';
import StoryViewer from './components/StoryViewer';

function App() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetch('/stories.json')
      .then(res => res.json())
      .then(data => setStories(data));
  }, []);

  return (
    <div className="bg-[#0D1117] text-white min-h-screen max-w-md mx-auto">
      <h2 className="text-lg font-semibold px-4 pt-4">Stories</h2>
      <StoryList
        onSelect={(id) => {
          const index = stories.findIndex(story => story.id === id);
          setActiveIndex(index);
        }}
      />
      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </div>
  );
}

export default App;
