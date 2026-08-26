import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './CSS/Nav.css'

function Nav_bar() {
  return (
    <Navbar expand="lg" className="Nav">
      {/* <Container className='Nav'>*/}
        <Navbar.Brand className="Heading" href="/">
          <div 
            style={{
              width: '40px',
              height: '40px',
              marginRight: '12px',
              display: 'inline-block',
              verticalAlign: 'middle',
              backgroundImage: 'url("/school-logo.jpeg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              flexShrink: 0
            }}
          />
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>SUG Electronic Voting System - SUMAS</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='Toggle'/> 
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto Nav">
            <Nav.Link className="Nav-items" href="/">Home</Nav.Link>
            <Nav.Link className="Nav-items" href="/Signup">New Registration</Nav.Link>
            <Nav.Link className="Nav-items" href="/Login">Login</Nav.Link>
            <Nav.Link className="Nav-items" href="/AdminLogin">Admin</Nav.Link>
            <Nav.Link className="Nav-items" href="/results">Live Results</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default Nav_bar;