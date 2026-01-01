import { Link } from 'react-router-dom';
import { getAllCollections } from '../lib/content';

export default function Home() {
    const collections = getAllCollections();

    return (
        <div className="min-h-screen bg-white">
            {/* Header - compact */}
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-bold text-black tracking-tight">Question Sets</h1>
            </header>

            {/* List - full width, no gaps */}
            <main className="divide-y divide-black/10">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        to={`/quiz/${collection.id}`}
                        className="block px-4 py-4 bg-white active:bg-black/5 transition-colors"
                    >
                        <h2 className="text-base font-semibold text-black leading-tight line-clamp-2">
                            {collection.title}
                        </h2>
                        {collection.description && (
                            <p className="text-sm text-black/50 mt-1 line-clamp-2">
                                {collection.description}
                            </p>
                        )}
                        <span className="text-xs text-black/40 mt-2 block">
                            {collection.questions.length} questions
                        </span>
                    </Link>
                ))}
            </main>
        </div>
    );
}
