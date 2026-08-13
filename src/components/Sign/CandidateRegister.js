import "./SignUtils/CSS/Sign.css";
import "./SignUtils/CSS/CandidateRegister.css";
import "./SignUtils/CSS/style.css.map"
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import axios from "axios"
import { BASE_URL } from "../../helper";
import { useNavigate } from 'react-router-dom';
import BiometricCapture from "../BiometricCapture/BiometricCapture";

const sugPositions = [
    "President",
    "Vice President",
    "Secretary General",
    "Assistant Secretary General",
    "Treasurer",
    "Financial Secretary",
    "Director of Socials",
    "Director of Sports",
    "Director of Welfare",
    "Public Relations Officer",
    "Women Affairs Commissioner",
    "Student Senate Representative"
];

const universityDepartments = [
    "Department of Computer Science",
    "Department of Information Technology",
    "Department of Medical Sciences",
    "Department of Applied Sciences",
    "Department of Mathematics and Statistics",
    "Department of Biological Sciences",
    "Department of Physical Sciences"
];

const CandidateRegister = () => {
    const [loading, setLoading] = useState(false);
    const [showBiometric, setShowBiometric] = useState(false);
    const [biometricData, setBiometricData] = useState(null);

    const navigate = useNavigate();
    const CreationSuccess = () => toast.success("Candidate Registration Successful \n Redirecting to Dashboard", {
        className: "toast-message",
    });
    const CreationFailed = () => toast.error("Invalid Details \n Please Try Again!",{
        className: "toast-message",
    });

    const [formData, setFormData] = useState({
        fullName: '',
        matricNumber: '',
        department: '',
        position: '',
        manifesto: '',
        campaignSlogan: '',
        photo: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files[0]
        });
    };

    const handleBiometricComplete = (data) => {
        if (data.success) {
            setBiometricData(data);
            setShowBiometric(false);
            CreationSuccess();
            setTimeout(() => {
                navigate('/Candidate');
            }, 2000);
        } else {
            setShowBiometric(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate matric number format
        const matricPattern = /^\d{4}\/\d{6}$/;
        if (!matricPattern.test(formData.matricNumber)) {
            CreationFailed();
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        
        if (biometricData) {
            formDataToSend.append('facialData', JSON.stringify(biometricData.facialData));
            formDataToSend.append('facialImages', JSON.stringify(biometricData.images));
        }

        try {
            const response = await axios.post(`${BASE_URL}/createCandidate`, formDataToSend);
            if (response.data.success) {
                // Show biometric capture after successful registration
                setShowBiometric(true);
            } else {
                CreationFailed();
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            CreationFailed();
            setLoading(false);
        }
    };

    if (showBiometric) {
        return (
            <div className="candidate-register-container">
                <BiometricCapture 
                    onCaptureComplete={handleBiometricComplete}
                    mode="registration"
                />
            </div>
        );
    }

    return (
        <div className="candidate-register-container">
            <div className="candidate-register-wrapper">
                <div className="candidate-register-header">
                    <h2>SUG Candidate Registration</h2>
                    <p>University of Medical and Applied Sciences, Igbo-Eno</p>
                </div>
                
                <form onSubmit={handleSubmit} className="candidate-register-form">
                    <div className="form-row">
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
                    </div>

                    <div className="form-row">
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
                            <label>Position Aspiring For</label>
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Position</option>
                                {sugPositions.map(position => (
                                    <option key={position} value={position}>{position}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Manifesto</label>
                        <textarea
                            name="manifesto"
                            value={formData.manifesto}
                            onChange={handleChange}
                            placeholder="Describe your vision and plans for this position..."
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Campaign Slogan</label>
                        <input
                            type="text"
                            name="campaignSlogan"
                            value={formData.campaignSlogan}
                            onChange={handleChange}
                            placeholder="Your campaign slogan"
                        />
                    </div>

                    <div className="form-group">
                        <label>Candidate Photo</label>
                        <input
                            type="file"
                            name="photo"
                            id="photo"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                        />
                        <small>Upload a clear, professional photo (JPG/PNG, max 2MB)</small>
                    </div>

                    <div className="form-group form-button">
                        <button type="submit" disabled={loading} className="form-submit">
                            {loading ? <div className="spinner"></div> : 'Register Candidate & Capture Biometrics'}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CandidateRegister;