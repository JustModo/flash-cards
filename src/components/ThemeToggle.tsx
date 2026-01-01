import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Init from storage or system preference
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 p-4 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full shadow-lg border border-black/10 dark:border-white/10 hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
            title="Toggle Theme"
        >
            {isDark ? <Moon size={24} /> : <Sun size={24} />}
        </button>
    );
}
