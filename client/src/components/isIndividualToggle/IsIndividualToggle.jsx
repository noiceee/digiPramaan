import './isIndividualToggle.scss';

export default function IsIndividualToggle({first, second, isIndividual, setIsIndividual}) {
    const handleTabSwitch = () => {
        setIsIndividual((prev)=>!prev)
    }
    return (
        <div className="tab-wrapper">
            <span className={isIndividual ? "active" : ''} onClick={handleTabSwitch}>{first}</span>
            <span className={isIndividual ? '' : "active"} onClick={handleTabSwitch}>{second}</span>
        </div>
    )
}