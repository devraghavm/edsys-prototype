import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => (
  <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
    {steps.map((step, idx) => (
      <div key={step} style={{ flex: 1, textAlign: 'center' }}>
        <div
          style={{
            height: 8,
            background: idx <= currentStep ? '#4f46e5' : '#e5e7eb',
            borderRadius: 4,
            marginBottom: 4,
            transition: 'background 0.3s',
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: idx <= currentStep ? '#4f46e5' : '#6b7280',
          }}
        >
          {step}
        </span>
      </div>
    ))}
  </div>
);

export default ProgressBar;
