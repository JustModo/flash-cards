import { Link } from 'react-router-dom';
import { getAllCollections } from '../lib/content';
import { useState } from 'react';

export default function Home() {
    const collections = getAllCollections();
    const [isStudyMode, setIsStudyMode] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Header - compact */}
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-bold text-black tracking-tight">Question Sets</h1>
            </header>

            {/* Study Mode Banner */}
            <div className="mb-6 p-4 bg-gray-50 border border-black/5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-sm font-bold text-black mb-1">Study Mode</h2>
                        <p className="text-sm text-black/60 leading-relaxed">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                </div>
            </div>

            {/* List - full width, no gaps */}
            <main className="divide-y divide-black/10">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        to={`/quiz/${collection.id}${isStudyMode ? '?mode=study' : ''}`}
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
