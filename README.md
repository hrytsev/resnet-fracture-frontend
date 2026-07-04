# ResNet Fracture Detector

A minimalist single-page web application for detecting bone fractures in X-ray images using a ResNet18 machine learning model.

## Purpose

Upload X-ray images (PNG/JPEG) to receive instant fracture predictions from a ResNet18 binary classification model. Displays prediction confidence alongside model architecture and performance metrics.

**Educational/demonstration purposes only. Not a medical device.**

## Features

- **Drag-and-drop or click-to-upload** X-ray images
- **Real-time predictions** with confidence scores
- **Model metadata display** (architecture, accuracy, precision, recall, F1)
- **Minimalist design** — black background, single accent color
- **Responsive layout** — works on mobile and desktop
- **Accessibility** — respects `prefers-reduced-motion`, visible focus states

## Installation

```bash
# Clone the repository
git clone https://github.com/hrytsev/resnet-fracture-frontend.git
cd resnet-fracture-frontend

# Install dependencies
npm install

# Configure API endpoint (optional)
# Default: http://127.0.0.1:8001
export VITE_API_BASE_URL=http://your-api-endpoint

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

**Tech Stack**
- React (Vite) — functional components + hooks
- Zustand — single source of truth for application state
- Tailwind CSS — utility-first styling
- Framer Motion — accessible animations
- Plain `fetch` — API communication

**State Management**
All domain state lives in one Zustand store (`src/store/useAppStore.js`):
- File upload & validation
- Prediction lifecycle
- Model info fetching

**Component Structure**
```
src/
├── App.jsx                    # Main layout, orchestration
├── components/
│   ├── UploadDropzone.jsx     # Dashed-border upload card
│   ├── Preloader.jsx          # Loading state
│   ├── PredictionResult.jsx   # Results display
│   ├── ModelInfoPanel.jsx     # Architecture + metrics
│   ├── ErrorMessage.jsx       # Inline error messages
│   └── SocialLinks.jsx        # Social media links
├── lib/
│   └── api.js                 # API layer (fetch functions)
└── store/
    └── useAppStore.js         # Zustand store
```

## Why It's Simple

- **Single store** — Zustand eliminates prop drilling and duplicate state
- **Minimal dependencies** — only React, Zustand, Tailwind, Framer Motion
- **No abstraction layers** — plain `fetch` instead of axios/react-query
- **Clear separation** — presentational components, thin API layer, centralized state
- **No TypeScript overhead** — vanilla JavaScript (optional if preferred)
- **Focused scope** — one primary use case, no dashboard clutter

## API Contract

**POST** `/api/ml/fracture`
- Request: `multipart/form-data` with `file` field
- Response: `{ prediction, prediction_confidence, confidence, filename, request_id }`

**GET** `/api/ml/model-info`
- Response: `{ name, info: { architecture, metrics: { accuracy, precision, recall, f1_score, confusion_matrix } } }`

## License

MIT
