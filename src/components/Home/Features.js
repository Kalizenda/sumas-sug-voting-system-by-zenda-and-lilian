import './CSS/features.css'
import {useEffect, React, useRef } from 'react';
import ScrollReveal from "scrollreveal";

const Features = () =>{
    const revealRefBottom = useRef(null);
    const revealRefLeft = useRef(null);
    const revealRefTop = useRef(null);
    const revealRefRight = useRef(null);

    useEffect(() => {

        
        ScrollReveal().reveal(revealRefBottom.current, {
            
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'bottom',
            easing: 'ease',
            reset: 'true',
        });
    }, []);
    useEffect(() => {

        
        ScrollReveal().reveal(revealRefRight.current, {
            
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'right',
            easing: 'ease',
            reset: 'true',
        });
    }, []); useEffect(() => {

        
        ScrollReveal().reveal(revealRefLeft.current, {
            
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'left',
            easing: 'ease',
            reset: 'true',
        });
    }, []); useEffect(() => {

        
        ScrollReveal().reveal(revealRefTop.current, {
            
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'top',
            easing: 'ease',
            reset: 'true',
        });
    }, []);
    return(
        <div className="Features">
            <h2 ref={revealRefTop}>Features</h2>
            <div className='Features-Content' >
                <div className='Features-Content-Card' ref={revealRefLeft}>
                    <h5><strong>Biometric Security</strong></h5> 
                    <p>We prioritize the security and integrity of every vote cast on our platform through advanced facial recognition technology. Our biometric verification ensures that each vote is cast by the registered student and remains confidential.</p>
                </div>
                <div className='Features-Content-Card' ref={revealRefTop}>
                    <h5><strong>Accessibility</strong></h5> 
                    <p>We strive to make voting accessible to all students of the University of Medical and Applied Sciences, regardless of their location or physical abilities. Our online platform allows students to participate in SUG elections from anywhere on campus.</p>
                </div>
                <div className='Features-Content-Card' ref={revealRefRight}>
                    <h5><strong>Transparency</strong></h5> 
                    <p>We believe in transparency throughout the voting process. Students can verify their votes and view SUG election results in real-time, fostering trust and confidence in the electoral process.</p>
                </div>
                <div className='Features-Content-Card' ref={revealRefLeft}>
                    <h5><strong>User-Friendly Interface</strong></h5> 
                    <p>Our intuitive interface makes it easy for students to navigate the voting process, ensuring a seamless and enjoyable experience for all participants in the SUG elections.</p>
                </div>
                <div className='Features-Content-Card' ref={revealRefBottom}>
                    <h5><strong>Real-Time Results</strong></h5> 
                    <p>Our platform provides live updates of voting results as they happen, allowing students and the SUG Electoral Commission to monitor election progress instantly with accurate, up-to-the-minute information.</p>
                </div>
                <div className='Features-Content-Card' ref={revealRefRight}>
                    <h5><strong>Position-Based Voting</strong></h5> 
                    <p>Our system supports voting for multiple SUG positions including President, Vice President, Secretary General, and other executive positions, allowing students to choose their preferred candidates for each role.</p>
                </div>

            </div>
        </div>
    )
}
export default Features;