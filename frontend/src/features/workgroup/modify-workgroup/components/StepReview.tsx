import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { type WorkgroupFormData } from '@/features/workgroup/modify-workgroup/schemas/modify-workgroup-schemas';

interface StepReviewProps {
  form: UseFormReturn<WorkgroupFormData>;
  onSubmit: () => void;
  onBack: () => void;
}

const orgChartSummaryColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info: any) => info.getValue() ?? '',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info: any) => info.getValue() ?? '',
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: (info: any) => info.getValue() ?? '',
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: (info: any) => info.getValue() ?? '',
  },
  {
    accessorKey: 'parentId',
    header: 'Parent',
    cell: (info: any) => {
      const value = info.getValue();
      return value ?? 'root';
    },
  },
];

const StepReview: React.FC<StepReviewProps> = ({ form, onSubmit, onBack }) => {
  const values = form.getValues();
  const orgChartSummary = values.orgChartSummary ?? [];

  return (
    <div className="space-y-4 w-full">
      <h2 className="step-title">Worgroup Review</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <strong>Name:</strong> {values.name}
        </div>
        <div>
          <strong>Email:</strong> {values.email}
        </div>
        <div className="col-span-2">
          <strong>OrgChart Summary:</strong>
          <div className="mt-2">
            <DataTable
              columns={orgChartSummaryColumns}
              data={orgChartSummary}
              isLoading={false}
            />
          </div>
        </div>
        <div>
          <strong>Address:</strong> {values.address}
        </div>
        <div>
          <strong>City:</strong> {values.city}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Button type="button" onClick={form.handleSubmit(onSubmit)}>
          Submit
        </Button>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default StepReview;
