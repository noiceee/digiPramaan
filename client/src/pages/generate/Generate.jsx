import IsIndividualToggle from '../../components/isIndividualToggle/IsIndividualToggle';
import ProgressBar from '../../components/progressBar/ProgressBar';
import './generate.scss';
import { useEffect, useState } from 'react';

export default function Generate() {
    const [step, setStep] = useState(1);
    const [isIndividual, setIsIndividual] = useState(true);
    const [isWinner, setIsWinner] = useState(true);
    const [formData, setFormData] = useState({
        recieverName: '',
        recieverEmail: '',
        eventName: '',
        isIndividual: '',
        type: '',
        dateOfIssuance: '',
        backgroundImage: ''
    });
    const [backgroundImage, setBackgroundImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setBackgroundImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            isWinner
        }))
    }, [isWinner]);
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            backgroundImage
        }))
    }, [backgroundImage]);
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
        setStep(prevStep => prevStep + 1);
    };
    const handleBack = (e) => {
        console.log('Form submitted:', formData);
        setStep(prevStep => prevStep - 1);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setStep(prevStep => prevStep + 1);
    };
    const steps = [
        'Get Started',
        'Certificate Data',
        'User Data',
        'Publish'
    ]
    const renderStepIndividual = () => {
        switch (step) {
            case 1:
                return (
                    <div className='step step-1'>
                        <div className="togglecontainer">
                            <IsIndividualToggle first={'Single'} second={'Bulk'} isIndividual={isIndividual} setIsIndividual={setIsIndividual} />
                        </div>
                        <button className='cta' onClick={handleNext}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div className='step step-2'>
                        <div className="togglecontainer">
                            <IsIndividualToggle first={'Winner'} second={'Runner-up'} isIndividual={isWinner} setIsIndividual={setIsWinner} />
                        </div>
                        <div className="input-wrapper">
                            <h4>Upload background image (Optional)</h4>
                            {/* <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                            <div className='image-input'>
                                <input type="file" name="backgroundImage" id="backgroundImage" accept='image/' onChange={handleImageChange} />
                                {backgroundImage && (
                                    <div>
                                        <img src={backgroundImage} alt="Uploaded" style={{ maxWidth: '100px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button className='cta' onClick={handleBack}>Back</button>
                            <button className='cta' onClick={handleNext}>Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='step step-2'>
                        <div className="input-wrapper">
                            <input type="text" name="recieverName" value={formData.recieverName} onChange={handleChange} placeholder="Reciever Name" required />
                            <input type="email" name="recieverEmail" value={formData.recieverEmail} onChange={handleChange} placeholder="Reciever Email" required />
                            <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" required />
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
                        <h3>Certificate Preview : </h3>
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
    const renderStepBulk = () => {
        switch (step) {
            case 1:
                return (
                    <div className='step step-1'>
                        <div className="togglecontainer">
                            <IsIndividualToggle first={'Single'} second={'Bulk'} isIndividual={isIndividual} setIsIndividual={setIsIndividual} />
                        </div>
                        <button className='cta' onClick={handleNext}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div className='step step-2'>
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
    return (
        <div className='generate page'>
            <h1 className='heading'>Generate Certificates.</h1>
            {/* <ProgressBar className='progress-bar' steps={steps} currentStep={step} stepWidth={'100px'} lineWidth={'138px'} /> */}
            <ProgressBar className='progress-bar' steps={steps} currentStep={step} stepWidth={'140px'} lineWidth={'200px'} />
            {
                isIndividual ?
                    <>
                        {renderStepIndividual()}
                    </>
                    :
                    <>
                        {renderStepBulk()}
                    </>
            }
        </div>
    )
}