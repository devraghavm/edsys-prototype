import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormNavigation from '@/components/form-navigation-buttons';
import { type Step1FormData } from '@/features/workgroup/modify-workgroup/schemas/modify-workgroup-schemas';

interface Step1Props {
  form: UseFormReturn<Step1FormData>;
  onNext: () => void;
}

const handleFormSubmit = (
  form: UseFormReturn<Step1FormData>,
  onNext: () => void
) => {
  return (e: React.FormEvent) => {
    console.log('Submitting Step 1');
    form.handleSubmit(onNext)(e);
  };
};

const Step1: React.FC<Step1Props> = ({ form, onNext }) => {
  return (
    <Form {...form}>
      <form
        onSubmit={handleFormSubmit(form, onNext)}
        className="space-y-4 w-full"
      >
        <h3 className="step-title">Workgroup Details</h3>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormNavigation
          isFirstStep
          onNext={onNext}
          isNextDisabled={!form.formState.isValid}
        />
      </form>
    </Form>
  );
};

export default Step1;
