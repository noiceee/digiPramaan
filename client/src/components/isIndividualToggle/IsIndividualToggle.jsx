import './isIndividualToggle.scss';

export default function IsIndividualToggle({isIndividual, setIsIndividual}) {
    const handleTabSwitch = () => {
        setIsIndividual((prev)=>!prev)
    }
    return (
        <div className="tab-wrapper">
            <span className={isIndividual ? "active" : ''} onClick={handleTabSwitch}>Individual</span>
            <span className={isIndividual ? '' : "active"} onClick={handleTabSwitch}>Organisation</span>
        </div>
    )
}