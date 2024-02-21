import "./progressBar.scss";

export default function ProgressBar({steps, currentStep}) {

    return (
        <div className="progress-bar">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`step ${index + 1 === currentStep ? "active" : ""} ${index + 1 < currentStep ? "completed" : ""}`}
                >
                    <div className={`line ${index + 1 <= currentStep - 1 ? "completed" : ""} ${index + 1 == currentStep ? "active" : ""} ${index + 1 === 4 ? "invisible" : ""}`}></div>
                    <div className="step-circle">
                        {index + 1}
                    </div>
                    <div className="step-label">{step}</div>
                </div>
            ))}
        </div>
    );
}
