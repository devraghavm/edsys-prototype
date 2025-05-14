import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  type Product,
} from '../slice/productsSlice';
import apiClient from '@/api/apiClient';
import { useDispatch } from 'react-redux';

type QueryOptions = {
  queryKey: string[];
  queryFn: () => Promise<Product[]>;
  staleTime: number;
  refetchOnWindowFocus: boolean;
  refetchInterval: number | false;
  onSuccess: (data: Product[]) => void;
};

export const useFetchProducts = (): UseQueryResult<Product[], Error> =>
  useQuery({
    queryKey: ['products'],
    // The queryFn in React Query is called under several conditions:
    //  1. Initial Load: When the component that uses the useQuery hook mounts for the first time.
    //  2. Stale Data: When the data in the cache is considered stale. This is determined by the staleTime configuration.
    //  3. Window Focus: When the window regains focus, if refetchOnWindowFocus is set to true.
    //  4. Interval Refetching: At regular intervals, if refetchInterval is set.
    //  5. Manual Refetch: When you manually refetch the query using methods like queryClient.invalidateQueries or queryClient.refetchQueries.
    //  6. Network Reconnect: When the network reconnects, if refetchOnReconnect is set to true.
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get('/products');
      return response.data;
    },
    // The time that cache stays valid
    // If staleTime has not been reached, React Query will not trigger a new request when useFetchItems is called again.
    // Instead, it will serve the data from its cache since the data is still considered "fresh."
    // If the server data changes during the staleTime, React Query won't automatically know about it
    // since it doesn't check the server until the cache is marked as "stale" or a manual refresh is triggered (e.g., queryClient.invalidateQueries or refetch). or refetchInterval is used
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (default: 0)
    // Scenarios When refetchOnWindowFocus is Triggered
    //  1. Switching Tabs: When the user switches from another browser tab back to the tab where your application is running.
    //  2. Switching Windows: When the user switches from another application window (e.g., a different browser window or a different application) back to the browser window where your application is running.
    //  3. Minimize/Restore: When the user minimizes the browser window and then restores it.
    //  4. Lock/Unlock Screen: When the user locks their computer screen and then unlocks it, bringing the browser window back into focus.
    refetchOnWindowFocus: true, // Refetch on focus (default: true)
    // Use refetchInterval: Automatically poll the server at regular intervals.
    refetchInterval: 10000, // Polling every 10 seconds (default: false)
    // If the data in the cache is still valid (not stale), React Query will return it directly without making a new API request.
    // In this case, onSuccess won’t be triggered since the queryFn isn’t executed.
    // If the data returned by queryFn matches the existing cached data, React Query optimizes performance by not marking the query as "updated." Since there’s no perceived data change, the onSuccess callback is not called.
    onSuccess: (data) => {
      console.log(`call onSuccess with data: ${data}`);
      const dispatch = useDispatch();
      //dispatch(setItems(data));
    },
  } as QueryOptions);

export const useAddProduct = (): UseMutationResult<
  Product,
  Error,
  { title: string }
> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (newProduct: { title: string }): Promise<Product> => {
      const response = await apiClient.post('/products', newProduct);
      return response.data;
    },
    // This will only be called if the mutation is successful,
    // different with onSettled with will be called regardless of whether the mutation was successful or not
    onSuccess: (data) => {
      // Invalidate cache, refresh items after creating
      queryClient.invalidateQueries({ queryKey: ['products'] });
      dispatch(addProductAction(data));
    },
  });
};

export const useUpdateProduct = (): UseMutationResult<
  Product,
  Error,
  { id: number; title: string }
> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (updatedProduct: {
      id: number;
      title: string;
    }): Promise<Product> => {
      const response = await apiClient.put(
        `/products/${updatedProduct.id}`,
        updatedProduct
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate cache, refresh items after creating
      queryClient.invalidateQueries({ queryKey: ['products'] });
      dispatch(updateProductAction(data));
    },
  });
};
export const useDeleteProduct = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalidate cache, refresh items after creating
      queryClient.invalidateQueries({ queryKey: ['products'] });
      dispatch(deleteProductAction(id));
    },
  });
};
