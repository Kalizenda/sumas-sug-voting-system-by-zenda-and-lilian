import { useEffect, React, useRef} from 'react';
import ScrollReveal from "scrollreveal";
import { useNavigate } from 'react-router-dom';

import "../CSS/upcomingElections.css"
const UpcomingElections = ({voteStatus})=>{
    const navigate = useNavigate();
   
    // const handleButtonClick = () => {
    //     if (voteStatus) {
    //         alert("You Have Already Voted");
    //     } else {
    //         navigate('/Vote')
    //     }
    //   };
    
    const revealRefBottom = useRef(null);
    const revealRefLeft = useRef(null);  
    const revealRefTop = useRef(null);
    const revealRefRight = useRef(null);
  
    useEffect(() => {
    
      // Initialize ScrollReveal
      ScrollReveal().reveal(revealRefBottom.current, {
        // You can configure options here
        duration: 1000,
        delay: 200,
        distance: '50px',
        origin: 'bottom',
        easing: 'ease',
        reset: 'true',
      });
    }, []);
    useEffect(() => {
    
      // Initialize ScrollReveal
      ScrollReveal().reveal(revealRefRight.current, {
        // You can configure options here
        duration: 1000,
        delay: 200,
        distance: '50px',
        origin: 'right',
        easing: 'ease',
        reset: 'true',
      });
    }, []);  useEffect(() => {
    
      // Initialize ScrollReveal
      ScrollReveal().reveal(revealRefLeft.current, {
        // You can configure options here
        duration: 1000,
        delay: 200,
        distance: '50px',
        origin: 'left',
        easing: 'ease',
        reset: 'true',
      });
    }, []);  useEffect(() => {
    
      // Initialize ScrollReveal
      ScrollReveal().reveal(revealRefTop.current, {
        // You can configure options here
        duration: 1000,
        delay: 200,
        distance: '50px',
        origin: 'top',
        easing: 'ease',
        reset: 'true',
      });
    }, []); 
    return(
        <div className="upcomingElections">
            <h2 ref={revealRefTop}>Upcoming Elections</h2>
 
            <div className="upcomingElectionsCardContainer">
                <div className="upcomingElectionCard" ref={revealRefLeft}>
                    <h3>2026 Nigerian Student Union Government Election</h3><br/>
                    <p>The Student Union Government elections will be held from 15 March 2026 to 20 March 2026 to elect the executive council members. The elections will be held in three phases and the results will be announced on 22 March 2026.</p><br/>
                    <button><a href='/Vote'>Participate/Vote</a></button>
                </div>
                <div className="upcomingElectionCard" ref={revealRefBottom}>
                    <h3>2026 Faculty Senate Election</h3><br/>
                    <p>The Faculty Senate election is scheduled to be held on April 10, 2026. Students will elect faculty representatives for the academic year 2026/2027.</p><br/>
                    <button><a href='/Vote'>Participate/Vote</a></button>
                </div>
                <div className="upcomingElectionCard" ref={revealRefRight}>
                    <h3>2026 Departmental Representatives Election</h3><br/>
                    <p>The Departmental Representatives election will be held from 5 to 8 May 2026 to elect student representatives from each department. This will ensure proper student representation across all faculties.</p><br/>
                    <button><a href='/Vote'>Participate/Vote</a></button>
                </div>

            </div>
        </div>
    )
}
export default UpcomingElections;