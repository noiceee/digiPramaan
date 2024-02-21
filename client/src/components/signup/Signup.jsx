import './signup.scss';
import { useState } from 'react';

export default function Signup({ isOnSignup, setIsOnSignup }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        isIndividual: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (step < 3) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2>Step 1: Personal Information</h2>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                        <button onClick={handleSubmit}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Step 2: Account Information</h2>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
                        <button onClick={handleSubmit}>Next</button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Step 3: Confirmation</h2>
                        <p>Please review your information before submitting:</p>
                        <p>Name: {formData.firstName} {formData.lastName}</p>
                        <p>Email: {formData.email}</p>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                );
            default:
                return null;
        }
    };

    function togglePopUpBox() {
        setIsOnSignup((prev) => !prev);
    }

    return (
        <div className="signup" onClick={togglePopUpBox}>
            <div className="glassbox" onClick={(e) => e.stopPropagation()}>
                <div className="cross" onClick={togglePopUpBox}>+</div>
                <h1>Get Started</h1>
                {renderStep()}
            </div>
        </div>
    )
}