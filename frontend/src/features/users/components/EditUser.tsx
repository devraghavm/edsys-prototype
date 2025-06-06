import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useUpdateUserWithRoles } from '../query/usersApi';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultipleSelector, {
  type Option,
} from '@/components/ui/multiple-selector';
import { useDispatch } from 'react-redux';
import { updateUser } from '../slice/usersSlice';

const editUserSchema = z.object({
  user_name: z.string().min(2, 'Username is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  roles: z
    .array(z.number({ invalid_type_error: 'Role ID must be a number' }))
    .min(1, 'At least one role is required'),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;
type Role = {
  id: number;
  role_name: string;
  role_desc: string;
  priority: number;
};

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUserWithRoles();
  const dispatch = useDispatch();

  // Fetch user details with roles
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-with-roles', id],
    queryFn: async () => {
      const res = await apiClient.get(`/users/${id}/with-roles`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch all roles
  const { data: roles = [], isLoading: rolesLoading } = useQuery<Role[]>({
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

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      user_name: '',
      first_name: '',
      last_name: '',
      email: '',
      roles: [],
    },
  });

  // Populate form with user data when loaded
  useEffect(() => {
    if (user) {
      form.reset({
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        roles: Array.isArray(user.userRoles)
          ? user.userRoles.map((r: any) => r.id)
          : [],
      });
    }
  }, [user, form]);

  const onSubmit = async (values: EditUserFormValues) => {
    const result = await updateUserMutation.mutateAsync({
      id: Number(id),
      ...values,
    });
    dispatch(updateUser(result));
    navigate('/users');
  };

  if (userLoading || rolesLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit User</h2>
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
          <Button type="submit" disabled={updateUserMutation.isPending}>
            Update User
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUser;
