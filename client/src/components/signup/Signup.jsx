import IsIndividualToggle from '../isIndividualToggle/IsIndividualToggle';
import ProgressBar from '../progressBar/ProgressBar';
import './signup.scss';
import { useEffect, useState } from 'react';

export default function Signup({ isOnSignup, setIsOnSignup }) {
    const [step, setStep] = useState(1);
    const [isIndividual, setIsIndividual] = useState(true);
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            isIndividual
        }))
    }, [isIndividual]);
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
    const handleNext = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (step < 5) {
            setStep(prevStep => prevStep + 1);
        }
    };
    const handleBack = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (step < 5) {
            setStep(prevStep => prevStep - 1);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (step < 5) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const steps = [
        'Get Started',
        'Personal Information',
        'Account Information',
        'Confirmation'
    ]
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className='step-1'>
                        {/* <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required /> */}
                        <IsIndividualToggle first={'Individual'} second={'Organization'} setIsIndividual={setIsIndividual} isIndividual={isIndividual} />
                        <button className='cta' onClick={handleNext}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div className='step-2'>
                        <div className="input-wrapper">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} />
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext}>Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='step-2'>
                        <div className="input-wrapper">
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext}>Next</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <p>Please review your information before submitting:</p>
                        <p>Name: {formData.name}</p>
                        <p>Email: {formData.email}</p>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleSubmit}>Submit</button>
                        </div>
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
                <ProgressBar lineWidth={'160px'} stepWidth={'140px'} className="progress-bar" steps={steps} currentStep={step} />
                {renderStep()}
            </div>
        </div>
    )
}