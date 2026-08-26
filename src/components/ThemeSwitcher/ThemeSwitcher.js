import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = ({ position = 'top-right' }) => {
  const { currentTheme, changeTheme } = useTheme();

  const isLightTheme = currentTheme.name === 'White Light';

  const handleClick = (e) => {
    e.stopPropagation();
    changeTheme(e);
  };

  return (
    <button 
      className={`theme-switcher theme-switcher-${position} ${isLightTheme ? 'theme-switcher-light' : ''}`}
      onClick={handleClick}
      title={`Current theme: ${currentTheme.name}. Click to change.`}
      style={{ color: isLightTheme ? '#333333' : '#ffffff' }}
    >
      <span className="theme-icon">🎨</span>
      <span className="theme-name">{currentTheme.name}</span>
    </button>
  );
};

export default ThemeSwitcher;
