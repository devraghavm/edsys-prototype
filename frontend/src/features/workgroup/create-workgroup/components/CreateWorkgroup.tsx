import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import {
  setStep1,
  setStep2,
  setStep3,
  resetForm,
} from '@/features/workgroup/create-workgroup/slice/createWorkgroupSlice';
import ProgressBar from '@/components/progress-bar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from '@/features/workgroup/create-workgroup/schemas/create-workgroup-schemas';
import { z } from 'zod';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import StepReview from './StepReview';

const steps = ['Personal', 'Demographics', 'Address', 'Review'];

const CreateWorkgroup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.createWorkgroup);

  // Step 1
  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: formState.step1,
  });

  // Step 2
  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      ...formState.step2,
      gender:
        formState.step2.gender === 'Male' ||
        formState.step2.gender === 'Female' ||
        formState.step2.gender === 'Other'
          ? formState.step2.gender
          : undefined,
    },
  });

  // Step 3
  const step3Form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: formState.step3,
  });

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await step1Form.trigger();
      if (!valid) return;
      dispatch(setStep1(step1Form.getValues()));
      setCurrentStep(1);
    } else if (currentStep === 1) {
      const valid = await step2Form.trigger();
      if (!valid) return;
      dispatch(setStep2(step2Form.getValues()));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await step3Form.trigger();
      if (!valid) return;
      dispatch(setStep3(step3Form.getValues()));
      setCurrentStep(3);
    }
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    // Mimic backend submission
    localStorage.setItem('CreateWorkgroupData', JSON.stringify(formState));
    dispatch(resetForm());
    alert('Form submitted! Data saved to localStorage.');
    setCurrentStep(0);
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold mb-6">Create Workgroup</h2>
      <ProgressBar steps={steps} currentStep={currentStep} />
      {currentStep === 0 && <Step1 form={step1Form} onNext={handleNext} />}
      {currentStep === 1 && (
        <Step2 form={step2Form} onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 2 && (
        <Step3 form={step3Form} onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 3 && (
        <StepReview
          formState={formState}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CreateWorkgroup;
