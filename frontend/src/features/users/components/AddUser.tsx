import React from 'react';
import { useAddUserWithRoles } from '../query/usersApi';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import MultipleSelector, {
  type Option,
} from '@/components/ui/multiple-selector';
import { useDispatch } from 'react-redux';
import { addUser } from '../slice/usersSlice';

const addUserSchema = z.object({
  user_name: z.string().min(2, 'Username is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  roles: z
    .array(z.number({ invalid_type_error: 'Role ID must be a number' }))
    .min(1, 'At least one role is required'),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

type Role = {
  id: number;
  role_name: string;
  role_desc: string;
  priority: number;
};

const AddUser: React.FC = () => {
  const addUserMutation = useAddUserWithRoles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch roles from /roles
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get('/roles');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Prepare options for MultipleSelector
  const roleOptions: Option[] = roles.map((role) => ({
    label: `${role.role_name} (${role.role_desc})`,
    value: role.id.toString(),
  }));

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      user_name: '',
      first_name: '',
      last_name: '',
      email: '',
      roles: [],
    },
  });

  const onSubmit = async (values: AddUserFormValues) => {
    const result = await addUserMutation.mutateAsync(values);
    dispatch(addUser(result));
    navigate('/users');
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add User</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
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
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Roles as shadcn multiple-selector */}
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <FormControl>
                  <MultipleSelector
                    options={roleOptions}
                    placeholder="Select roles"
                    value={roleOptions.filter((option) =>
                      field.value.includes(Number(option.value))
                    )}
                    onChange={(selected) => {
                      field.onChange(
                        selected.map((option) => Number(option.value))
                      );
                    }}
                    className="min-w-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={addUserMutation.isPending}>
            Add User
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddUser;
