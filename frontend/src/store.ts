import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '@/features/users/slice/usersSlice';
import createWorkgroupReducer from '@/features/workgroup/create-workgroup/slice/createWorkgroupSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    createWorkgroup: createWorkgroupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
