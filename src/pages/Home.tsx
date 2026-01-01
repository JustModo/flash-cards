import { Link } from 'react-router-dom';
import { getAllCollections } from '../lib/content';
import { useState, useEffect } from 'react';

export default function Home() {
    const collections = getAllCollections();
    const [isStudyMode, setIsStudyMode] = useState(() => {
        return localStorage.getItem('studyMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('studyMode', String(isStudyMode));
    }, [isStudyMode]);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200 pb-24">
            {/* Header - compact */}
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-bold tracking-tight">Question Sets</h1>
            </header>

            {/* Study Mode Banner */}
            <div className="mb-6 p-4 bg-gray-50 border border-black/5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-sm font-bold mb-1">Study Mode</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Study mode lets you learn specific questions and answers linearly. 
                            We recommend going through this mode once to learn the material before testing yourself.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isStudyMode}
                            onChange={(e) => setIsStudyMode(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            {/* List - full width, no gaps */}
            <main className="divide-y divide-border">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        to={`/quiz/${collection.id}${isStudyMode ? '?mode=study' : ''}`}
                        className="block px-4 py-4 bg-background active:bg-muted/50 transition-colors hover:bg-muted/10"
                    >
                        <h2 className="text-base font-semibold leading-tight line-clamp-2">
                            {collection.title}
                        </h2>
                        {collection.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {collection.description}
                            </p>
                        )}
                        <span className="text-xs text-muted-foreground/70 mt-2 block">
                            {collection.questions.length} questions
                        </span>
                    </Link>
                ))}
            </main>
        </div>
    );
}
