import React from 'react';
import { Button } from '@/components/ui/button';

interface StepReviewProps {
  formState: any;
  onSubmit: () => void;
  onBack: () => void;
}

const StepReview: React.FC<StepReviewProps> = ({
  formState,
  onSubmit,
  onBack,
}) => (
  <div className="space-y-4 w-full">
    <h3 className="text-xl font-bold mb-4">Review</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <strong>Name:</strong> {formState.step1.name}
      </div>
      <div>
        <strong>Email:</strong> {formState.step1.email}
      </div>
      <div>
        <strong>Age:</strong> {formState.step2.age}
      </div>
      <div>
        <strong>Gender:</strong> {formState.step2.gender}
      </div>
      <div>
        <strong>Address:</strong> {formState.step3.address}
      </div>
      <div>
        <strong>City:</strong> {formState.step3.city}
      </div>
    </div>
    <div className="flex gap-4 mt-6">
      <Button type="button" onClick={onSubmit}>
        Submit
      </Button>
      <Button type="button" variant="outline" onClick={onBack}>
        Back
      </Button>
    </div>
  </div>
);

export default StepReview;
