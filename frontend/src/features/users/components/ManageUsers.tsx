import React, { useEffect } from 'react';
import { useFetchUsersWithRoles, useDeleteUser } from '../query/usersApi';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { DataTable } from '@/components/ui/data-table';
import { useDispatch } from 'react-redux';
import { setUsers } from '../slice/usersSlice';

const columns = (
  deleteUser: ReturnType<typeof useDeleteUser>,
  navigate: ReturnType<typeof useNavigate>
) => [
  {
    accessorKey: 'user_name',
    header: 'Username',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'userRoles',
    header: 'Roles',
    cell: (info: any) =>
      Array.isArray(info.row.original.userRoles)
        ? info.row.original.userRoles
            .map((role: any) => role.role_name)
            .join(', ')
        : '',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/users/edit/${row.original.id}`)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteUser.mutate(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

const ManageUsers: React.FC = () => {
  const { data: users = [], isLoading } = useFetchUsersWithRoles();
  const deleteUser = useDeleteUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('ManageUsers users:', users);

  // Update redux state when users data changes
  useEffect(() => {
    dispatch(setUsers(users));
  }, [users, dispatch]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link to="/users/add">
          <Button>Add User</Button>
        </Link>
      </div>
      <DataTable
        columns={columns(deleteUser, navigate)}
        data={users}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ManageUsers;
