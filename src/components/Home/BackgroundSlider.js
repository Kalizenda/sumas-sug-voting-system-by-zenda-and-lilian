import React, { useState, useEffect } from 'react';
import './CSS/BackgroundSlider.css';
import { useTheme } from '../../context/ThemeContext';

const themes = [
    {
        name: 'Blue Gradient',
        background: 'linear-gradient(135deg, #1a237e 0%, #16213e 100%)',
        primary: '#00d4ff',
        secondary: '#7b2ff7',
        text: '#ffffff'
    },
    {
        name: 'Purple Deep',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        text: '#ffffff'
    },
    {
        name: 'Teal Green',
        background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        primary: '#00ff87',
        secondary: '#60efff',
        text: '#ffffff'
    },
    {
        name: 'Dark Blue',
        background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
        primary: '#00d2ff',
        secondary: '#3a7bd5',
        text: '#ffffff'
    },
    {
        name: 'Maroon Red',
        background: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
        primary: '#ff4d4d',
        secondary: '#ff9f43',
        text: '#ffffff'
    },
    {
        name: 'Ocean Teal',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        primary: '#00f260',
        secondary: '#0575e6',
        text: '#ffffff'
    }
];

const BackgroundSlider = () => {
    const { currentTheme, changeTheme } = useTheme();
    const [autoCycle, setAutoCycle] = useState(false);
    const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

    useEffect(() => {
        if (!autoCycle) return;

        const interval = setInterval(() => {
            setCurrentThemeIndex((prev) => {
                const nextIndex = (prev + 1) % themes.length;
                changeTheme(themes[nextIndex]);
                return nextIndex;
            });
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [autoCycle, changeTheme]);

    const toggleAutoCycle = () => {
        setAutoCycle(!autoCycle);
    };

    return (
        <div className="background-slider" style={{ background: currentTheme.background }}>
            <div className="sliding-image">
                <div className="background-pattern"></div>
            </div>
            <button 
                className={`auto-cycle-toggle ${autoCycle ? 'active' : ''}`}
                onClick={toggleAutoCycle}
                title={autoCycle ? 'Stop auto color cycling' : 'Start auto color cycling'}
            >
                <span className="cycle-icon">🎨</span>
                <span className="cycle-text">{autoCycle ? 'Auto' : 'Manual'}</span>
            </button>
            <div className="content">
            </div>
        </div>
    );
};
export default BackgroundSlider;
