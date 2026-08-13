import React, { useState } from 'react';
import './CSS/contact.css'
import { ToastContainer, toast } from 'react-toastify';
import emailjs from 'emailjs-com';


const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const sendingSuccess = (msg) => toast.success(msg, {
        className: "toast-message",
    });
    const sendingFailed = (msg) => toast.error(msg, {
        className: "toast-message",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validate all fields
        if (!name || !email || !message) {
            sendingFailed("Please fill in all fields");
            setLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            sendingFailed("Please enter a valid email address");
            setLoading(false);
            return;
        }

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message
        };

        try {
            // Initialize EmailJS if not already initialized
            if (!window.emailjs) {
                sendingFailed('Email service not available. Please contact us directly at sug@sumas.edu.ng');
                setLoading(false);
                return;
            }

            const response = await window.emailjs.send(
                'service_nxpm74r', 
                'template_so5nfd8', 
                templateParams, 
                'AX5QPEWUDd7UZrPe9'
            );
            console.log('SUCCESS!', response.status, response.text);
            sendingSuccess('Your message has been sent successfully!');
            setName('');
            setEmail('');
            setMessage('');
            setSuccessMessage('');
            setErrorMessage('');
        } catch (error) {
            console.error('FAILED...', error);
            console.error('Error details:', error.text, error.status);
            
            // Provide more specific error message
            if (error.text === 'The public key is invalid') {
                sendingFailed('Email service configuration error. Please contact support.');
            } else if (error.text === 'The service is not found') {
                sendingFailed('Email service not available. Please contact us directly at sug@sumas.edu.ng');
            } else {
                sendingFailed('There was an error sending your message. Please try again or contact us at sug@sumas.edu.ng');
            }
            setErrorMessage('There was an error sending your query. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-form">
            <h2>Contact SUG Electoral Commission</h2>
            <ToastContainer />
            <form>
                <div className='contact-field'>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder='Enter Your Name'
                    />
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Enter Your Email'
                    />
                </div>
                <div>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder='Enter Your Message'
                    />
                </div>
                <button onClick={handleSubmit} disabled={loading}>{loading ? <div className="spinner"></div> : 'Send'}</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            <div className="contact-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <p style={{ margin: '5px 0' }}><strong>Alternatively, contact us directly:</strong></p>
                <p style={{ margin: '5px 0' }}>📧 Email: sug@sumas.edu.ng</p>
                <p style={{ margin: '5px 0' }}>📞 Phone: +234 (0) 812 717 9162</p>
                <p style={{ margin: '5px 0' }}>📍 Office: SUG Electoral Commission, SUMAS Campus</p>
            </div>
        </div>
    );
};

export default Contact;
