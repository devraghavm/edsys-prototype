import apiClient from '@/api/apiClient';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

export type User = {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  userRoles?: {
    id: number;
    role_name: string;
    role_desc: string;
    priority: number;
  }[];
  roles?: number[]; // Array of role IDs
};

type UsersState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchProducts = createAsyncThunk('users/fetchUsers', async () => {
  const response = await apiClient.get('/users');
  return response.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    updateUser(state, action: PayloadAction<User>) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = action.payload;
      }
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch products';
      });
  },
});

export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
