import "./SignUtils/CSS/Sign.css"
import "./SignUtils/CSS/style.css.map"
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css"
import signinimage from "./SignUtils/images/signin-image.jpg"
import { useState} from 'react';
import { Link } from 'react-router-dom';
import Nav_bar from "../Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../helper";
import BiometricCapture from "../BiometricCapture/BiometricCapture";
import Cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBiometric, setShowBiometric] = useState(false);
    const [userForVerification, setUserForVerification] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const loginSuccess = () => toast.success("Login Success",{
        className: "toast-message",
    });
    const loginFailed = () => toast.error(`Invalid Details or User Doesn't exist`,{
        className: "toast-message",
    });
    const biometricFailed = () => toast.error(`Biometric Verification Failed`,{
        className: "toast-message",
    });

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/login`, { username, password });
            const voterst = response.data.voterObject;
            if(response.data.success){
                // Store user data for biometric verification
                setUserForVerification(voterst);
                setShowBiometric(true);
            }
            else{
                loginFailed();
                setLoading(false);
            }
          } 
          catch (error) {
            console.error('Login failed:', error);
            loginFailed();
            setLoading(false);
          }
    };

    const handleBiometricComplete = (data) => {
        if (data.success) {
            // Biometric verification successful
            console.log('Biometric verification successful with match score:', data.matchScore);
            loginSuccess();
            
            // Store user data in cookies
            Cookies.set('myCookie', userForVerification._id, { expires: 7 });
            Cookies.set('userRole', userForVerification.role, { expires: 7 });
            
            setTimeout(() => {
                if (userForVerification.role === 'admin') {
                    navigate('/New');
                } else {
                    navigate('/User', { state: { voterst: userForVerification } });
                }
            }, 2000);
        } else {
            biometricFailed();
            setShowBiometric(false);
            setLoading(false);
        }
    };

    if (showBiometric && userForVerification) {
        return (
            <div className="login-container">
                <Nav_bar />
                <BiometricCapture 
                    onCaptureComplete={handleBiometricComplete}
                    mode="verification"
                    storedFacialData={userForVerification.facialData}
                />
            </div>
        );
    }

    return (
        <div >
            <Nav_bar />
            <section className="sign-in">
                <div className="container">
                <p>Use your student email or matriculation number to login</p>


                    <div className="signin-content">
                    
                        <div className="signin-image">
                            <figure><img src={signinimage} alt="sign in image" /></figure>
                            <Link to="/Signup" className="signup-image-link">Create an account</Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Student Login</h2>
                            <ToastContainer />
                                <div className="form-group">
                                    <label for="email"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input type="text" name="email" id="email" placeholder="Email or Matric Number" onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label for="pass"><i className="zmdi zmdi-lock"></i></label>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="pass" 
                                        id="pass" 
                                        placeholder="Password" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    <span 
                                        className="password-toggle" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '14px' }}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </span>
                                </div>
                                <div className="form-group form-button">
                                    <button onClick={handleLogin} disabled={loading}>{loading ? <div className="spinner"></div> : 'Login & Verify'}</button>
                                    
                                </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>

    )
}
export default Login;