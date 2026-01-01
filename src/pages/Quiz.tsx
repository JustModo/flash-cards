import { useParams, Link } from 'react-router-dom';
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
    const questionVersion = useQuizStore(state => state.questionVersion);
    const finished = useQuizStore(state => state.finished);
    const totalQuestions = useQuizStore(state => state.totalQuestions);

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [result, setResult] = useState<{ isCorrect: boolean; correctIndex: number } | null>(null);

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
            initializeSession(collection.questions);
        }
        return () => resetSession();
    }, [collection, initializeSession, resetSession]);

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
        if (isAnswered && result && !result.isCorrect) {
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
    if (isAnswered && result?.isCorrect) {
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
                    {finished.length} / {totalQuestions}
                </span>
            </header>

            {/* Question */}
            <div className="px-4 pt-2 pb-4 flex flex-col h-32">
                <h2 className="text-base font-bold text-black leading-snug">
                    {currentQuestion.text}
                </h2>
            </div>

            {/* Options - stacked at bottom */}
            <div className="border-t border-black/10">
                {mappedOptions.map(({ text, originalIndex }, idx) => {
                    let optionBg = "bg-white";
                    let optionText = "text-black";
                    let opacity = "";

                    if (isAnswered) {
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

                    const pointerEvents = isAnswered ? 'pointer-events-none' : '';

                    return (
                        <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOptionClick(originalIndex);
                            }}
                            className={`
                                w-full px-4 py-4 text-left text-sm font-medium
                                border-b border-black/10 last:border-b-0
                                transition-colors
                                ${optionBg} ${optionText} ${opacity}
                                ${!isAnswered ? 'active:bg-black/5' : ''}
                                ${pointerEvents}
                            `}
                        >
                            <span className="line-clamp-3">{text}</span>
                        </button>
                    );
                })}
            </div>

        </div>
    );
}
