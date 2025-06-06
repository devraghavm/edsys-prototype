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

interface Step3Props {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ form, onNext, onBack }) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4 w-full">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Address" {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="City" {...field} className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormNavigation
        onBack={onBack}
        onNext={onNext}
        isLastStep
        isNextDisabled={!form.formState.isValid}
      />
    </form>
  </Form>
);

export default Step3;
