import React from 'react';

interface Props {
  onBack?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  isNextDisabled?: boolean;
}

const FormNavigation: React.FC<Props> = ({
  onBack,
  onNext,
  isLastStep,
  isFirstStep,
  isNextDisabled,
}) => (
  <div
    style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}
  >
    <button type="button" onClick={onBack} disabled={isFirstStep}>
      Back
    </button>
    <button type="submit" disabled={isNextDisabled}>
      {isLastStep ? 'Submit' : 'Next'}
    </button>
  </div>
);

export default FormNavigation;
