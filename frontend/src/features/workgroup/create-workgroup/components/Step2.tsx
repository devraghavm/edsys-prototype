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

interface Step2Props {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ form, onNext, onBack }) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4 w-full">
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                placeholder="Age"
                type="number"
                {...field}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <select
                {...field}
                className="w-full border rounded px-3 py-2"
                value={field.value ?? ''}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!form.formState.isValid}
      />
    </form>
  </Form>
);

export default Step2;
