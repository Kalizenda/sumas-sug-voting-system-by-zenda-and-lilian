import './CSS/team.css'
import { useEffect, React, useRef } from 'react';
import ScrollReveal from "scrollreveal";
import { SocialIcon } from 'react-social-icons'
import image1 from './CSS/image1.JPG'
import image2 from './CSS/image2.jpg'

const Team = () => {
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
    return (
        <div className="Team">
            <h2 ref={revealRefTop}> Our Team</h2>
            <div className='Team-Content'>
                <div className='Team-Content-Card' ref={revealRefLeft}>
                    <img src={image1} className='image' alt="Lilian"></img>
                    <h3>Lilian | <span>MERN Stack Developer</span></h3>
                    <p>Tech Profile</p>
                    <p>Lilian is an aspiring Full-Stack Developer and Software Engineer with practical knowledge of HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.</p>
                    <p>She is passionate about creating functional web applications, learning modern software development techniques, and using technology to solve real-world problems.</p>
                    <p>Skills: HTML | CSS | JavaScript | Node.js | Express.js | MongoDB | Git | GitHub | REST APIs.</p>
                    <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }} href="https://www.tiktok.com/@lillianeze2?_r=1&_t=ZS-98nGNWuyItE" target='_blank' url="www.tiktok.com" />
                </div>

                <div className='Team-Content-Card' ref={revealRefRight}>
                    <img src={image2} className='image' alt="Zenda"></img>
                    <h3>Zenda | <span>MERN Stack Developer</span></h3>
                    <p>Tech Profile</p>
                    <p>Benneth Chekwubechukwu Aja (Zenda) is an aspiring Full-Stack Web Developer and Software Engineer with skills in HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.</p>
                    <p>He is interested in Web Development, Software Engineering, Artificial Intelligence, Cybersecurity, and Biometric Technology. He enjoys building practical web applications and continuously improving his programming skills through personal projects and hands-on learning.</p>
                    <p>Skills: HTML | CSS | JavaScript | Node.js | Express.js | MongoDB | Git | GitHub | REST APIs.</p>
                    <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }} href="https://www.tiktok.com/@zendatech?_r=1&_t=ZS-98nGIc5DM8N" target='_blank' url="www.tiktok.com" />
                    <SocialIcon className='SocialIcon' style={{ height: "30px", width: "30px" }} href="https://github.com/Kalizenda" target='_blank' url="www.github.com" />
                </div>

            </div>
        </div>
    )
}
export default Team;