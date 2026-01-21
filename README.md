# Flash Cards - Endless MCQ Practice App

Flash Cards is a self-hostable, interactive multiple-choice question (MCQ) practice application. Designed for learners and educators, it allows users to practice and test their knowledge across various topics. The app is built using modern web technologies, ensuring a fast and responsive user experience.

## Features

- **Endless MCQ Practice**: Users can practice questions from various modules without limits.
- **Customizable Content**: Easily add or modify question sets to suit your needs.
- **Modern Tech Stack**: Built with React, TypeScript, and Vite for optimal performance.
- **Self-Hostable**: Deploy the app on your own server or hosting platform.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd flash-cards
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## Adding MCQ Questions

You can add new MCQ questions by creating or editing JSON files in the `src/content/` directory. Each JSON file represents a module and follows this structure:

### JSON Syntax

```json
{
  "id": "module-id",
  "title": "Module Title",
  "description": "Brief description of the module",
  "questions": [
    {
      "id": "question-id",
      "text": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswerIndex": 0
    }
  ]
}
```

### Example

```json
{
  "id": "e1",
  "title": "EVS MOD 1",
  "description": "A collection of questions covering ecosystems and sustainability.",
  "questions": [
    {
      "id": "q1",
      "text": "What is the primary producer in a forest ecosystem?",
      "options": ["Deer", "Oak tree", "Hawk", "Mushroom"],
      "correctAnswerIndex": 1
    }
  ]
}
```

Save the file in the `src/content/` directory, and the app will automatically include it.

---

## Deployment

To deploy the app, follow these steps:

1. Build the app:

   ```bash
   npm run build
   ```

2. Serve the production build:

   ```bash
   npm run preview
   ```

3. Deploy the `dist/` folder to your hosting platform (e.g., Vercel, Netlify).

---

## Tech Stack

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Strongly typed programming language.
- **Vite**: Fast build tool for modern web projects.
- **Tailwind CSS**: Utility-first CSS framework.
- **Zustand**: State management library.

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the app.

---

## Reader's Note

This application was originally used by the author for 1-credit MCQ exams. To generate a JSON file for your own MCQ questions, simply provide the PDF file containing the questions and use the prompt provided in `template.txt`. The JSON will be created in the required format, excluding any extra or repeated questions.
