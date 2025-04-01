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
        <button
                className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'} mr-2 d-flex align-items-center`}
                onClick={toggleTheme}
            >
                <i className={`bi ${theme === 'light' ? 'bi-moon' : 'bi-sun'}`}></i>
            <span className="d-none d-md-inline ms-2">
                {theme === 'light' ? 'Dark' : 'Light'} theme
            </span>
        </button>
    );
};

export default ThemeSwitcher;
