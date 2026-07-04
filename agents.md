# AGENTS.md — ResNet Fracture Detector (Frontend)

This file is the source of truth for any coding agent (Claude Code, Cursor, etc.)
working on this repository. Read it fully before writing code. Follow it exactly
unless the user explicitly overrides a rule in chat.

## 1. Project summary

A single-page web app that lets a user drag/drop or select an X-ray image
(`.png` / `.jpeg` only), sends it to a fracture-detection ML API, and displays
the prediction. The app also fetches and displays static model metadata
(architecture, metrics, confusion matrix) from a second endpoint.

Design brief: **black, minimal, stylish, but simple.** One confident visual
idea, not a template. No dashboard clutter, no unnecessary chrome.

## 2. Tech stack (fixed — do not substitute)

- **React** (Vite, functional components + hooks only)
- **Zustand** for ALL application state (no `useState` for domain data — see §5)
- **Tailwind CSS** for styling (no CSS-in-JS, no separate CSS files beyond
  `index.css` with Tailwind directives)
- Plain `fetch` for API calls (no axios/react-query needed — this is a small app)
- No TypeScript required, but allowed if the user prefers it — ask only if ambiguous

## 3. Visual design spec

- **Background:** pure/near-black (`#0A0A0A` or similar — pick one deliberate
  shade, not `#000`). This is the only large surface; everything else is
  restrained and quiet against it.
- **Upload zone** (the page's main and only interactive element on first load):
    - Large centered rectangle/card
    - `border: 2px dashed` (dotted/dashed style), `border-radius: ~16–24px`
      (rounded, not sharp, not pill-shaped)
    - Border color: a muted neutral at rest (e.g. `#333`), brightens or shifts to
      a single accent color on drag-hover — this accent is the one "signature"
      color choice for the whole app, pick it deliberately (do not default to
      Anthropic-clay `#D97757` or acid-green — choose something that fits an
      X-ray/medical/diagnostic mood, e.g. a cool clinical blue-white or a
      desaturated cyan)
    - Accepts click-to-browse AND drag-and-drop
    - `accept=".png,.jpeg,.jpg,image/png,image/jpeg"` — reject anything else
      client-side with an inline message (no browser `alert()`)
    - Shows a small preview thumbnail of the selected image once chosen, still
      inside/near the same dotted card (don't just discard the dropzone)
- **Preloader:** while a request to `/api/ml/fracture` is in flight, replace
  the result area with a loading state (spinner or subtle skeleton) — never
  show a blank screen or stale result while loading. Keep it simple: no
  progress bars implying false precision.
- **Results view:** once a prediction returns, show:
    - Predicted label (`prediction`) as the dominant piece of information
    - `prediction_confidence` as a percentage
    - Optionally the raw `confidence` distribution as a small two-bar chart
      (fracture vs normal) — nice-to-have, not required
    - A "check another image" / reset action that clears the store and returns
      to the empty dropzone
- **Model info:** fetch once on mount (or via a small "Model info" affordance,
  e.g. a footer link/drawer) and display architecture, version, and the four
  headline metrics (accuracy/precision/recall/F1). Don't clutter the main
  hero with this — it's secondary content.
- Fully responsive down to mobile width. Visible keyboard focus states on the
  dropzone and any buttons. Respect `prefers-reduced-motion`.

## 4. API contract

Base URL: configurable via `VITE_API_BASE_URL` env var, default
`http://127.0.0.1:8001`.

### POST `/api/ml/fracture`
- Request: `multipart/form-data` with a single field `file` (the image binary)
- Example call:
  ```js
  const formData = new FormData();
  formData.append("file", file); // file: File from <input> or drop event

  const res = await fetch(`${BASE_URL}/api/ml/fracture`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  ```
- Example response:
  ```json
  {
    "logits": [[-9.052406311035156, 9.21205997467041]],
    "confidence": [[1.1690779899709014e-8, 1.0]],
    "prediction": "not fractured",
    "prediction_confidence": 1.0,
    "shape": [1, 2],
    "filename": "9-rotated2-rotated3-rotated3-rotated1.jpg",
    "request_id": "508403d9-2e2a-4220-8fd8-6c5463232a42"
  }
  ```
  Fields to actually use in the UI: `prediction`, `prediction_confidence`,
  `confidence`, `filename`. Store `request_id` for debugging (e.g. console log
  or a tiny "ref: …" caption) but don't feature it visually.

### GET `/api/ml/model-info`
- Request: no params
- Example response:
  ```json
  {
    "name": "resnet18_fractured",
    "info": {
      "name": "resnet_fractured",
      "description": "ResNet18 model for binary classification of bone X-ray images into fracture and normal classes.",
      "version": "1.0.0",
      "created_at": "2026-07-03",
      "framework": "PyTorch",
      "architecture": "ResNet18",
      "task": "Binary image classification",
      "classes": ["fracture", "normal"],
      "metrics": {
        "accuracy": 0.9806996381182147,
        "precision": 0.968503937007874,
        "recall": 1.0,
        "f1_score": 0.984,
        "confusion_matrix": [[321, 16], [0, 492]]
      }
    },
    "device": "cpu",
    "model_path": "models/resnet18_fractured/resnet18_fractured.pth"
  }
  ```

## 5. Zustand store — single source of truth

All data that drives rendering must live in one Zustand store (e.g.
`src/store/useAppStore.js`). Do not duplicate this state in component-local
`useState`. Suggested shape:

```js
{
  // upload / file
  file: null,              // File object
  previewUrl: null,        // object URL for thumbnail
  fileError: null,         // string | null — invalid type/size message

  // prediction request lifecycle
  isPredicting: false,
  prediction: null,        // full response object from /api/ml/fracture
  predictionError: null,

  // model info
  modelInfo: null,         // full response object from /api/ml/model-info
  isModelInfoLoading: false,
  modelInfoError: null,

  // actions
  setFile: (file) => {...},        // validates type, sets preview, clears old prediction
  clearFile: () => {...},          // reset to empty dropzone state
  submitForPrediction: async () => {...}, // calls the API, manages isPredicting/prediction/predictionError
  fetchModelInfo: async () => {...},
}
```

Components read from the store via selectors and call store actions directly
from event handlers (`onDrop`, `onChange`, `onClick`) — components should stay
thin/presentational.

## 6. Suggested file structure

```
src/
├── main.jsx
├── App.jsx
├── index.css                 # Tailwind directives + a few CSS vars if needed
├── store/
│   └── useAppStore.js
├── lib/
│   └── api.js                # fetchFracturePrediction(file), fetchModelInfo()
└── components/
    ├── UploadDropzone.jsx     # the dotted-border black card, drag/drop + click
    ├── PredictionResult.jsx   # label, confidence, mini bar chart
    ├── Preloader.jsx          # loading state shown during isPredicting
    ├── ModelInfoPanel.jsx     # architecture + metrics, secondary placement
    └── ErrorMessage.jsx       # inline validation / API error display
```

## 7. Validation & error handling rules

- Client-side file validation (type — and optionally a sane max size) happens
  in the store's `setFile` action, before any network call.
- Network/API errors (non-2xx, network failure) must surface as an inline
  message near the dropzone/result area — never a browser `alert()`, never a
  silent failure.
- The interface's error copy states what happened and what to do next, in
  plain language (e.g. "That file isn't a PNG or JPEG — try another image."),
  never an apologetic or vague tone.

## 8. Design principles to keep it from looking generic

- Pick one deliberate accent color for the whole app (see §3) and use it
  sparingly — on hover states, the prediction label, and nowhere else.
- The dotted-border upload card is the app's signature element. Everything
  else (typography, spacing, the results panel) should be quiet and let that
  card and the final prediction be the two moments that stand out.
- Two type roles are enough: one slightly characterful display face for the
  prediction result / headline, one clean body/utility face for everything
  else (labels, metrics, captions).
- No stock dashboard aesthetic (no card grids of KPIs, no unnecessary icons
  per metric). Show the four headline metrics as plain labeled numbers.

## 9. Definition of done

- [ ] Black page, dashed rounded upload card, click + drag/drop both work
- [ ] Only `.png`/`.jpeg` accepted, rejected files show inline error, no alerts
- [ ] All state lives in the Zustand store, none duplicated in component state
- [ ] Preloader shown for the full duration of the `/api/ml/fracture` call
- [ ] Prediction result clearly shows label + confidence after load
- [ ] Model info fetched and displayed (metrics + architecture) somewhere secondary
- [ ] Reset/clear flow returns to the empty dropzone
- [ ] Responsive on mobile, visible focus states, reduced-motion respected