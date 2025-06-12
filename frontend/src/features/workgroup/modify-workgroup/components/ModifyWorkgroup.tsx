import React, { useEffect, useState } from 'react';
import ProgressBar from '@/components/progress-bar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workgroupStep1Schema,
  workgroupStep2Schema,
  workgroupStep3Schema,
  fullWorkgroupSchema,
  type WorkgroupFormData,
  type Step1FormData,
  type Step2FormData,
  type Step3FormData,
} from '@/features/workgroup/modify-workgroup/schemas/modify-workgroup-schemas';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import StepReview from './StepReview';
import disneyOrgData from '@/data/disneyOrgData.json';
import { type OrgChartData, OrgChartCardNode } from '@/components/OrgChart';
import { computeTreeLayout, computeNodeLevels } from '@/utils/treeLayout';
import { useParams } from 'react-router';

const steps = ['Details', 'Matrix', 'Additional Details', 'Review'];

const nodeTypes = {
  orgChartCard: OrgChartCardNode,
};

const levelColors = [
  'bg-blue-300',
  'bg-green-300',
  'bg-orange-300',
  'bg-pink-300',
  'bg-purple-300',
];

const orgPositions = computeTreeLayout(disneyOrgData);
const nodeLevels = computeNodeLevels(disneyOrgData);

const disneyOrgDataWithPositions = disneyOrgData.map((node) => {
  const level = nodeLevels[node.id] ?? 0;
  return {
    id: node.id,
    type: 'orgChartCard',
    data: {
      ...node,
      customCssClassnames: `w-64 border-2 shadow-md transition ${
        !orgPositions[node.id]?.orphan
          ? levelColors[level % levelColors.length]
          : 'bg-red-300'
      } text-white border-2 border-[#222]`,
      topConnectable: orgPositions[node.id]?.orphan ?? false,
      bottomConnectable: !orgPositions[node.id]?.orphan,
    },
    position: {
      x: orgPositions[node.id]?.x ?? 0,
      y: orgPositions[node.id]?.y ?? 0,
    },
  };
});

const disneyOrgChartData: OrgChartData = {
  nodes: disneyOrgDataWithPositions,
  edges: disneyOrgDataWithPositions
    .filter((node) => node.data.parentId)
    .map((node) => ({
      id: `${node.data.parentId}-${node.id}`,
      source: node.data.parentId!,
      target: node.id,
      type: 'smoothstep',
      deletable: false,
      style: { strokeWidth: 3 },
    })),
  nodeTypes,
  minDistance: 300,
};

const defaultValues: WorkgroupFormData = {
  name: '',
  email: '',
  orgChart: disneyOrgChartData,
  address: '',
  city: '',
};

const ModifyWorkgroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WorkgroupFormData>(defaultValues);

  // Step-specific forms with explicit types
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(workgroupStep1Schema),
    mode: 'onChange',
    defaultValues: { name: formData.name, email: formData.email },
  });

  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(workgroupStep2Schema),
    mode: 'onChange',
    defaultValues: { orgChart: formData.orgChart },
  });

  const step3Form = useForm<Step3FormData>({
    resolver: zodResolver(workgroupStep3Schema),
    mode: 'onChange',
    defaultValues: { address: formData.address, city: formData.city },
  });

  const reviewForm = useForm<WorkgroupFormData>({
    resolver: zodResolver(fullWorkgroupSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  useEffect(() => {
    if (currentStep === 3) {
      reviewForm.reset(formData);
    }
  }, [currentStep, formData, reviewForm]);

  // Helper to get the current form instance
  const getCurrentForm = () => {
    switch (currentStep) {
      case 0:
        return step1Form;
      case 1:
        return step2Form;
      case 2:
        return step3Form;
      default:
        return reviewForm;
    }
  };

  const handleNext = async () => {
    const form = getCurrentForm();
    const valid = await form.trigger();
    if (!valid) return;
    setFormData((prev) => ({ ...prev, ...form.getValues() }));
    setCurrentStep((s) => s + 1);
    console.log('Form data updated:', form.getValues());
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    const valid = await reviewForm.trigger();
    if (!valid) {
      setCurrentStep(0);
      return;
    }
    localStorage.setItem(
      'ModifyWorkgroupData',
      JSON.stringify(reviewForm.getValues())
    );
    alert('Form submitted! Data saved to localStorage.');
    setFormData(defaultValues);
    step1Form.reset(defaultValues);
    step2Form.reset(defaultValues);
    step3Form.reset(defaultValues);
    reviewForm.reset(defaultValues);
    setCurrentStep(0);
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="page-title">Modify Workgroup</h2>
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
          form={reviewForm}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default ModifyWorkgroup;
