import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState(0);

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
    },
    {
      name: 'White Light',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      primary: '#667eea',
      secondary: '#764ba2',
      text: '#333333'
    }
  ];

  const changeTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const currentTheme = themes[themeIndex];

  return (
    <ThemeContext.Provider value={{ themeIndex, currentTheme, themes, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
