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

interface Step1Props {
  form: UseFormReturn<any>;
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ form, onNext }) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4 w-full">
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

export default Step1;
