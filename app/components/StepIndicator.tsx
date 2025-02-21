import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = ['Amount', 'Wallet', 'Verify', 'Order'];

  return (
    <div className="step-indicator flex items-center w-full relative">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative w-full">
          {/* Connecting Line (From Circle to Circle) */}
          {index > 0 && (
            <div
              className={`absolute top-5 left-[50%] h-1 ${
                index < currentStep ? "bg-[#039FFF]" : "bg-gray-500"
              }`}
            />
          )}

          {/* Step Circle */}
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10 ${
              index + 1 <= currentStep
                ? "border-[#039FFF] bg-[#039FFF] text-white" // Active & completed steps
                : "border-gray-400 bg-transparent text-gray-400" // Upcoming steps
            }`}
          >
            {index + 1}
          </div>

          {/* Step Name (Changes color dynamically) */}
          <p
            className={`mt-2 text-sm font-semibold ${
              index + 1 <= currentStep ? "text-[#039FFF]" : "text-gray-500"
            }`}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;