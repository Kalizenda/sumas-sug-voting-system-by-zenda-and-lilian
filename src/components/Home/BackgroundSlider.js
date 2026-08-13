import React, { useState, useEffect } from 'react';
import './CSS/BackgroundSlider.css';

const BackgroundSlider = () => {
    const [currentImage, setCurrentImage] = useState(1);
    const [backgroundColor, setBackgroundColor] = useState('#1a237e'); // Deep blue

    const colors = [
        '#1a237e', // Deep blue
        '#0d47a1', // Dark blue
        '#1565c0', // Medium blue
        '#1976d2', // Blue
        '#2e7d32', // Green
        '#00695c', // Teal
        '#006064', // Cyan dark
        '#4a148c', // Purple
        '#b71c1c'  // Red
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(currentImage => (currentImage % colors.length) + 1);
            setBackgroundColor(colors[(currentImage % colors.length)]);
        }, 5000); // Change background every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="background-slider" style={{ backgroundColor: backgroundColor }}>
            <div className="sliding-image">
                <div className="background-pattern"></div>
            </div>
            <div className="content">
            </div>
        </div>
    );
};
export default BackgroundSlider;
