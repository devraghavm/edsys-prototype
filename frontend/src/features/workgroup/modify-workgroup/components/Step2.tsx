import React, { useRef } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import type { Step2FormData } from '@/features/workgroup/modify-workgroup/schemas/modify-workgroup-schemas';
import { OrgChart, type OrgChartData } from '@/components/OrgChart';
import FormNavigation from '@/components/form-navigation-buttons';
import { Form } from '@/components/ui/form';
// Removed incorrect import of setValue

interface Step2Props {
  form: UseFormReturn<Step2FormData>;
  onNext: () => void;
  onBack: () => void;
}

// Helper to build orgChartSummary from orgChart
function buildOrgChartSummary(orgChart: OrgChartData) {
  return orgChart.nodes.map((node: any) => {
    // Find the edge where this node is the target, and get the source as parentId
    const parentEdge = orgChart.edges?.find(
      (edge: any) => edge.target === node.id
    );
    return {
      id: node.id,
      name: node.data?.name,
      department: node.data?.department,
      position: node.data?.position,
      parentId: parentEdge ? parentEdge.source : undefined,
    };
  });
}

const Step2: React.FC<Step2Props> = ({ form, onNext, onBack }) => {
  const { watch, setValue, handleSubmit } = form;
  const orgChart = watch('orgChart');
  const latestOrgChart = useRef(orgChart);

  // Update ref on every change
  const handleOrgChartChange = (newData: OrgChartData) => {
    if (JSON.stringify(latestOrgChart.current) !== JSON.stringify(newData)) {
      latestOrgChart.current = newData;
      setValue('orgChart', newData, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // On Next, update form value before proceeding
  const handleNext = () => {
    setValue('orgChart', latestOrgChart.current, { shouldValidate: true });
    const normalizedOrgChart = {
      ...latestOrgChart.current,
      nodes:
        latestOrgChart.current?.nodes?.map((node: any) => ({
          ...node,
          data: node.data ?? {},
        })) ?? [],
      edges: latestOrgChart.current?.edges ?? [],
    };
    setValue('orgChartSummary', buildOrgChartSummary(normalizedOrgChart), {
      shouldValidate: true,
    });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleNext)} className="space-y-4 w-full">
        <h3 className="step-title">Workgroup Matrix</h3>
        <div className="org-chart-container">
          <OrgChart
            data={orgChart as OrgChartData}
            onChange={handleOrgChartChange}
          />
        </div>
        <FormNavigation
          onBack={onBack}
          onNext={handleNext}
          isNextDisabled={!form.formState.isValid}
        />
      </form>
    </Form>
  );
};

export default Step2;
