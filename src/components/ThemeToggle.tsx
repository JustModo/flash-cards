import { useEffect } from 'react';

export default function ThemeToggle() {
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        // Initial check
        updateTheme(mediaQuery);

        // Listener
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    return null;
}
