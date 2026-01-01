import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getCollectionById } from '../lib/content';
import { useEffect, useState, useMemo } from 'react';
import { useQuizStore } from '../lib/store';

export default function Quiz() {
    const { id } = useParams<{ id: string }>();
    const initializeSession = useQuizStore(state => state.initializeSession);
    const resetSession = useQuizStore(state => state.resetSession);
    const currentQuestion = useQuizStore(state => state.currentQuestion);
    const submitAnswer = useQuizStore(state => state.submitAnswer);
    const nextQuestion = useQuizStore(state => state.nextQuestion);
    const prevQuestion = useQuizStore(state => state.prevQuestion);
    const questionVersion = useQuizStore(state => state.questionVersion);
    const finished = useQuizStore(state => state.finished);
    const totalQuestions = useQuizStore(state => state.totalQuestions);
    const mode = useQuizStore(state => state.mode);
    const studyIndex = useQuizStore(state => state.studyIndex);

    const [searchParams] = useSearchParams();
    const modeParam = searchParams.get('mode');

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [result, setResult] = useState<{ isCorrect: boolean; correctIndex: number } | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);

    const collection = useMemo(() => id ? getCollectionById(id) : undefined, [id]);

    // Shuffle options
    const mappedOptions = useMemo(() => {
        if (!currentQuestion) return [];
        const opts = currentQuestion.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return opts;
    }, [currentQuestion, questionVersion]);

    useEffect(() => {
        if (collection) {
            initializeSession(collection.questions, modeParam === 'study' ? 'study' : 'normal');
            if (modeParam === 'study') {
                setShowInstructions(true);
            }
        }
        return () => resetSession();
    }, [collection, initializeSession, resetSession, modeParam]);

    useEffect(() => {
        if (currentQuestion) {
            setSelectedOption(null);
            setIsAnswered(false);
            setResult(null);
        }
    }, [currentQuestion, questionVersion]);

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        const res = submitAnswer(index);
        setResult(res);
        setIsAnswered(true);

        if (res.isCorrect) {
            setTimeout(() => nextQuestion(), 300);
        }
    };

    const handleScreenClick = () => {
        if (mode === 'study') return; // Handled by overlay/buttons
        if (isAnswered && result && !result.isCorrect) {
            nextQuestion();
        }
    };

    const handleStudyNav = (e: React.MouseEvent<HTMLDivElement>) => {
        if (showInstructions) {
            setShowInstructions(false);
            return;
        }
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        
        if (x < width / 2) {
            prevQuestion();
        } else {
            nextQuestion();
        }
    };

    if (!collection) {
        return <div className="h-screen flex items-center justify-center text-black/50">Not found</div>;
    }

    if (!currentQuestion) {
        return <div className="h-screen flex items-center justify-center text-black/30">Loading...</div>;
    }

    // Background flash
    let bgClass = "bg-white";
    if (mode === 'normal' && isAnswered && result?.isCorrect) {
        bgClass = "bg-green-50";
    }

    return (
        <div
            className={`h-screen ${bgClass} flex flex-col transition-colors duration-200`}
            onClick={handleScreenClick}
        >
            {/* Header - minimal */}
            <header className="px-4 py-3 flex items-center shrink-0">
                <Link to="/" className="p-2 -ml-2 text-black active:bg-black/5 rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </Link>
                <span className="ml-2 text-xs font-medium text-black/40 uppercase tracking-wider truncate">
                    {collection.title}
                </span>
                <span className="ml-auto text-sm font-medium text-black/60">
                    {mode === 'study' ? `${studyIndex + 1} / ${totalQuestions}` : `${finished.length} / ${totalQuestions}`}
                </span>
            </header>

            {/* Question */}
            <div className="px-4 pt-2 pb-4 flex flex-col h-32">
                <h2 className="text-base font-bold text-black leading-snug">
                    {currentQuestion.text}
                </h2>
            </div>

            {/* Options - stacked below question */}
            <div className="border-t border-black/10 relative flex-1 flex flex-col" onClick={mode === 'study' ? handleStudyNav : undefined}>
                <div className="w-full">
                {mappedOptions.map(({ text, originalIndex }, idx) => {
                    let optionBg = "bg-white";
                    let optionText = "text-black";
                    let opacity = "";

                    if (mode === 'study') {
                        if (originalIndex === currentQuestion.correctAnswerIndex) {
                            optionBg = "bg-green-100";
                            optionText = "text-green-800";
                        } else {
                            opacity = "opacity-50";
                        }
                    } else if (isAnswered) {
                         if (originalIndex === result?.correctIndex) {
                            optionBg = "bg-green-100";
                            optionText = "text-green-800";
                        } else if (originalIndex === selectedOption && !result?.isCorrect) {
                            optionBg = "bg-red-100";
                            optionText = "text-red-800";
                        } else {
                            opacity = "opacity-30";
                        }
                    }

                    const pointerEvents = (isAnswered || mode === 'study') ? 'pointer-events-none' : '';

                    return (
                        <button
                            key={idx}
                            disabled={isAnswered || mode === 'study'}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOptionClick(originalIndex);
                            }}
                            className={`
                                w-full px-4 py-4 text-left text-sm font-medium
                                border-b border-black/10 last:border-b-0
                                transition-colors
                                ${optionBg} ${optionText} ${opacity}
                                ${(!isAnswered && mode !== 'study') ? 'active:bg-black/5' : ''}
                                ${pointerEvents}
                            `}
                        >
                            <span className="line-clamp-3">{text}</span>
                        </button>
                    );
                })}
                </div>

                {mode === 'study' && (
                    <>
                        {/* Navigation Overlay Areas (Invisible but clickable) - positioned absolutely over the remaining space */}
                        <div className="absolute inset-0 z-10 flex cursor-pointer">
                            <div className="w-1/2 h-full hover:bg-black/5 transition-colors active:bg-black/10 flex items-center justify-start pl-4" title="Previous">
                                {/* Optional: Add hover indicators if needed, keeping it invisible for now as per original request but cleaner */}
                            </div>
                            <div className="w-1/2 h-full hover:bg-black/5 transition-colors active:bg-black/10 flex items-center justify-end pr-4" title="Next">
                            </div>
                        </div>
                        
                        {/* Instructions Overlay */}
                        {showInstructions && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-4">
                                <div className="flex w-full flex-1 items-center">
                                    <div className="w-1/2 flex flex-col items-center justify-center border-r border-black/10 p-4 text-center h-40">
                                        <div className="text-4xl mb-4 text-black/20">←</div>
                                        <div className="text-sm font-bold text-black/60">Previous Question</div>
                                        <div className="text-xs text-black/40 mt-1">Tap left side</div>
                                    </div>
                                    <div className="w-1/2 flex flex-col items-center justify-center p-4 text-center h-40">
                                        <div className="text-4xl mb-4 text-black/20">→</div>
                                        <div className="text-sm font-bold text-black/60">Next Question</div>
                                        <div className="text-xs text-black/40 mt-1">Tap right side</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowInstructions(false); }}
                                    className="mb-8 px-8 py-3 bg-black text-white text-sm font-bold rounded-full shadow-lg active:scale-95 transition-transform"
                                >
                                    Understand
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}
