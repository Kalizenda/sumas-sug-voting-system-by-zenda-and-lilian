import "./SignUtils/CSS/Sign.css";
import signupimage from "./SignUtils/images/signup-image.jpg"
import { Link } from 'react-router-dom';
import "./SignUtils/CSS/style.css.map"
import Nav_bar from "../Navbar/Navbar";
import { useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../helper";
import { useNavigate } from 'react-router-dom';
import BiometricCapture from "../BiometricCapture/BiometricCapture";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const universityDepartments = [
    "Department of Computer Science",
    "Department of Information Technology",
    "Department of Medical Sciences",
    "Department of Applied Sciences",
    "Department of Mathematics and Statistics",
    "Department of Biological Sciences",
    "Department of Physical Sciences"
];

const universityLevels = ["100", "200", "300", "400", "500"];

const universityFaculties = [
    "Faculty of Computing",
    "Faculty of Medical Sciences",
    "Faculty of Applied Sciences",
    "Faculty of Natural Sciences"
];

export default function Signup() {
    const navigate = useNavigate();

    const signSuccess = () => toast.success("Student Registration Successful \n Redirecting You To Login Page", {
        className: "toast-message",
    });
    const signFailed = (msg) => toast.error(`${msg}`, {
        className: "toast-message",
    });
    const [loading, setLoading] = useState(false);
    const [showBiometric, setShowBiometric] = useState(false);
    const [biometricData, setBiometricData] = useState(null);
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        matricNumber: '',
        department: '',
        level: '',
        faculty: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleBiometricComplete = async (data) => {
        if (data.success) {
            setBiometricData(data);
            setLoading(true);
            
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            
            formDataToSend.append('facialData', JSON.stringify(data.facialData));
            formDataToSend.append('facialImages', JSON.stringify(data.images));

            try {
                console.log('Sending registration data to:', `${BASE_URL}/createVoter`);
                const response = await axios.post(`${BASE_URL}/createVoter`, formDataToSend);
                console.log('Registration response:', response.data);
                
                if (response.data.success) {
                    setShowBiometric(false);
                    signSuccess();
                    setTimeout(() => {
                        navigate('/Login');
                    }, 2000);
                } else {
                    console.error('Registration failed:', response.data);
                    signFailed(response.data.message || "Registration failed after biometric capture");
                    setShowBiometric(false);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Registration error:', error);
                console.error('Error response:', error.response);
                console.error('Error message:', error.response?.data?.message);
                console.error('Error status:', error.response?.status);
                signFailed(error.response?.data?.message || error.message || "Registration failed");
                setShowBiometric(false);
                setLoading(false);
            }
        } else {
            setShowBiometric(false);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            signFailed('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate matric number format (e.g., 2023/123456)
        const matricPattern = /^\d{4}\/\d{6}$/;
        if (!matricPattern.test(formData.matricNumber)) {
            signFailed('Invalid Matric Number format. Use format: 2023/123456');
            setLoading(false);
            return;
        }

        // Show biometric capture first, before registration
        setShowBiometric(true);
        setLoading(false);
    };

    if (showBiometric) {
        return (
            <div className="signup-container">
                <Nav_bar />
                <BiometricCapture 
                    onCaptureComplete={handleBiometricComplete}
                    mode="registration"
                />
            </div>
        );
    }

    return (
        <div className="signup-container">
            <Nav_bar />
            <div className="signup-wrapper">
                <div className="signup-image">
                    <img src={signupimage} alt="University Student Registration" />
                </div>
                <div className="signup-form">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h2>Student Registration</h2>
                            <p>University of Medical and Applied Sciences, Igbo-Eno</p>
                        </div>
                        <ThemeSwitcher position="inline" />
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Matriculation Number</label>
                            <input
                                type="text"
                                name="matricNumber"
                                value={formData.matricNumber}
                                onChange={handleChange}
                                placeholder="e.g., 2023/123456"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {universityDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Level</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Level</option>
                                {universityLevels.map(level => (
                                    <option key={level} value={level}>{level} Level</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Faculty</label>
                            <select
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Faculty</option>
                                {universityFaculties.map(faculty => (
                                    <option key={faculty} value={faculty}>{faculty}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="submit-button">
                            {loading ? <div className="spinner"></div> : 'Register & Capture Biometrics'}
                        </button>
                    </form>

                    <p className="login-link">
                        Already registered? <Link to="/Login">Login here</Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}