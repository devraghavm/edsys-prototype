import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { deleteUser as deleteUserAction, type User } from '../slice/usersSlice';
import apiClient from '@/api/apiClient';
import { useDispatch } from 'react-redux';

export type AddUserWithRolesDto = {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: number[];
};

type QueryOptions = {
  queryKey: string[];
  queryFn: () => Promise<User[]>;
  staleTime: number;
  refetchOnWindowFocus: boolean;
  refetchInterval: number | false;
  onSuccess: (data: User[]) => void;
};

export const useFetchUsersWithRoles = (): UseQueryResult<User[], Error> =>
  useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get('/users/with-roles');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    onSuccess: (data) => {
      console.log(`call onSuccess with data: ${JSON.stringify(data)}`);
    },
  } as QueryOptions);

export const useAddUserWithRoles = (): UseMutationResult<
  any,
  Error,
  AddUserWithRolesDto
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUser: AddUserWithRolesDto) => {
      const response = await apiClient.post('/users/with-roles', newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
    },
  });
};

export const useUpdateUserWithRoles = (): UseMutationResult<
  any,
  Error,
  { id: number } & {
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    roles: number[];
  }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updateUser: any) => {
      const { id, ...rest } = updateUser;
      const response = await apiClient.put(`/users/${id}/with-roles`, rest);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
    },
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      dispatch(deleteUserAction(id));
    },
  });
};
