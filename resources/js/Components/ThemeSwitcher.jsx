import React, { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
    );
};

export default ThemeSwitcher;
