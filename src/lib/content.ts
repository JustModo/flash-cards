import { CollectionSchema } from './schema';
import type { Collection } from './schema';

export const getAllCollections = (): Collection[] => {
    const globResult = import.meta.glob('../content/*.json', { eager: true });
    const collections: Collection[] = [];

    for (const path in globResult) {
        const module = globResult[path] as any;
        // Handle both array of collections or single collection file types if needed
        // The sample.json is an array of collections.
        // If a file exports default as array, we spread it.
        // If it's a single object, we push it.

        // Check if default export exists
        const content = module.default || module;

        if (Array.isArray(content)) {
            content.forEach(item => {
                const result = CollectionSchema.safeParse(item);
                if (result.success) {
                    collections.push(result.data);
                } else {
                    console.error(`Failed to parse collection in ${path}:`, result.error);
                }
            });
        } else {
            const result = CollectionSchema.safeParse(content);
            if (result.success) {
                collections.push(result.data);
            } else {
                console.error(`Failed to parse collection in ${path}:`, result.error);
            }
        }
    }
    return collections;
};

export const getCollectionById = (id: string): Collection | undefined => {
    const collections = getAllCollections();
    return collections.find(c => c.id === id);
}
