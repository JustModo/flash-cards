import { z } from 'zod';

export const QuestionSchema = z.object({
    id: z.string().describe("Unique identifier for the question"),
    text: z.string().describe("The actual question text"),
    options: z.array(z.string()).describe("List of possible answers"),
    correctAnswerIndex: z.number().int().min(0).describe("Zero-based index of the correct answer in the options array"),
});

export const CollectionSchema = z.object({
    id: z.string().describe("Unique identifier for this collection (used in URL)"),
    title: z.string().describe("Display title for the collection"),
    description: z.string().optional().describe("Short description of what this quiz contains"),
    questions: z.array(QuestionSchema).describe("Array of questions in this collection"),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
