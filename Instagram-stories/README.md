# Instagram Stories Feature

A simplified, mobile-first implementation of the Instagram Stories feature built using React, Tailwind CSS, and deployed on Vercel. This project demonstrates smooth UI transitions, image-based story navigation, and auto-play functionality—all without using external libraries for core logic.

## Live Demo

[Click here to view the live project](https://your-vercel-deployment-url.vercel.app/)  
**Note**: Best viewed on mobile or in responsive mode.

## Features

- Horizontally scrollable list of image-based stories
- Tap to navigate stories (left = previous, right = next)
- Stories auto-advance every 5 seconds
- Animated red progress bar for each story
- Close button to exit story viewer
- No external libraries used for core functionality

## Tech Stack

- React (Vite)
- Tailwind CSS
- JavaScript (functional components, hooks)
- Vercel (Deployment)

## File Structure

```
/public
  └── stories.json      # External JSON file for stories data
/src
  ├── components
  │   ├── StoryList.jsx     # Thumbnail list of stories
  │   └── StoryViewer.jsx   # Full-screen story viewer
  └── App.jsx           # Main component
```

## Setup Instructions

1. Clone the repository  
   ```bash
   git clone https://github.com/Abhi-Ptdr/Instagram-Stories.git
   cd Instagram-Stories
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Start the development server  
   ```bash
   npm run dev
   ```

4. View it in the browser  
   Open `http://localhost:5173`  
   Make sure to view it in mobile responsive mode.

## stories.json (Data Format)

```json
[
  {
    "id": 1,
    "image": "/images/story1.jpg"
  },
  {
    "id": 2,
    "image": "/images/story2.jpg"
  }
]
```

Place your image files in the `/public/images` folder and update the paths accordingly.

## Acknowledgements

This project was built as part of a frontend development assignment to demonstrate interactive UI behavior without relying on external libraries.

## Author

Abhishek Patidar  
Email: [abhipatidar253@gmail.com](mailto:abhipatidar253@gmail.com)
LinkedIn: https://www.linkedin.com/in/abhiptdr/
