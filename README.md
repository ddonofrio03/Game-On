# StreamSphere 🏀

StreamSphere is a high-performance sports streaming discovery hub built with React, Vite, and Google's Gemini AI. It helps users find exactly where to watch MLB, NFL, NBA, NHL, and major soccer matches (EPL, Champions League) in real-time.

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1.  **Extract the project:** If you downloaded this as a ZIP, extract it to a folder.
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    - Create a `.env` file in the root directory.
    - Add your Gemini API key:
      ```env
      GEMINI_API_KEY=your_actual_api_key_here
      ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  **Open the app:** The app will be available at `http://localhost:3000`.

## 🛠 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **AI:** Google Generative AI (@google/genai)
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Utilities:** date-fns, clsx, tailwind-merge

## 📖 Features

- **Live Broadcast Scout:** Powered by Gemini AI to find real-time streaming availability.
- **AI Research Assistant:** Ask specific questions about local blackouts or regional sports networks.
- **Immersive UI:** A high-performance, dark-themed interface designed for sports fans.
- **Responsive Design:** Works seamlessly on desktop and mobile.

## ⚖️ License

Created with Google AI Studio Build.
