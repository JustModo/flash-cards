import { create } from 'zustand';
import type { Question } from './schema';

interface QuizState {
    // Queue of active questions
    queue: Question[];
    // Questions answered correctly
    finished: Question[];
    // Current question being displayed (first in queue)
    currentQuestion: Question | null;
    // Version counter to force UI updates even if question object is same
    questionVersion: number;
    // Total number of questions in the current collection
    totalQuestions: number;

    // Actions
    initializeSession: (questions: Question[]) => void;
    submitAnswer: (answerIndex: number) => { isCorrect: boolean; correctIndex: number };
    nextQuestion: () => void;
    resetSession: () => void;
}

// Fisher-Yates shuffle
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const useQuizStore = create<QuizState>((set, get) => ({
    queue: [],
    finished: [],
    currentQuestion: null,
    questionVersion: 0,
    totalQuestions: 0,

    initializeSession: (questions) => {
        const shuffled = shuffleArray(questions);
        set({
            queue: shuffled,
            finished: [],
            currentQuestion: shuffled.length > 0 ? shuffled[0] : null,
            totalQuestions: questions.length,
        });
    },

    submitAnswer: (answerIndex) => {
        const { currentQuestion, queue, finished } = get();
        if (!currentQuestion) return { isCorrect: false, correctIndex: -1 };

        const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;
        const correctIndex = currentQuestion.correctAnswerIndex;

        const remainingQueue = queue.slice(1); // Remove current
        let newQueue = [...remainingQueue];
        let newFinished = [...finished];

        if (isCorrect) {
            // Move to finished
            newFinished.push(currentQuestion);
        } else {
            // Re-insert into queue.
            // Requirement: "between 1-5 slots".
            // We avoid index 0 (immediate repetition) unless the queue is empty.

            const minIndex = newQueue.length > 0 ? 1 : 0;
            const maxIndex = Math.min(newQueue.length, 5);
            const insertIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

            newQueue.splice(insertIndex, 0, currentQuestion);
        }



        set({
            queue: newQueue,
            finished: newFinished,
            // We don't update currentQuestion here immediately to allow UI to show feedback
            // currentQuestion stays same until nextQuestion() is called
        });

        return { isCorrect, correctIndex };
    },

    nextQuestion: () => {
        let { queue, finished } = get();

        // If queue is empty but we have finished questions, recycle them
        if (queue.length === 0 && finished.length > 0) {
            queue = shuffleArray(finished);
            finished = [];
        }

        const currentVersion = get().questionVersion;
        set({
            queue,
            finished,
            currentQuestion: queue.length > 0 ? queue[0] : null,
            questionVersion: currentVersion + 1,
        });
    },

    resetSession: () => {
        set({ queue: [], finished: [], currentQuestion: null, questionVersion: 0, totalQuestions: 0 });
    }
}));
