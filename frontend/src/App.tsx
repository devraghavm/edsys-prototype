import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  deleteProduct as deleteProductAction,
} from './features/products/productsSlice';
import { type RootState, type AppDispatch } from './store';
import {
  useFetchProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './features/products/productsApi';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const { data: queryItems } = useFetchProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    setIsLoading(true);
    setLoadingButton('add');
    const newProduct = { title: 'New Product' };
    addProductMutation.mutate(newProduct, {
      // onSettled is called regardless of whether the query or mutation was successful or resulted in an error.
      // It is always called after the request has completed.
      onSettled: () => {
        setIsLoading(false);
        setLoadingButton(null);
      },
    });
  };

  const handleUpdateProduct = (id: number, title: string) => {
    setIsLoading(true);
    setLoadingButton(`update-${id}`);
    updateProductMutation.mutate(
      { id, title },
      {
        onSettled: () => {
          setIsLoading(false);
          setLoadingButton(null);
          setEditingProduct(null);
        },
      }
    );
  };

  const handleDeleteProduct = (id: number) => {
    setIsLoading(true);
    setLoadingButton(`delete-${id}`);

    // Optimistically update the UI
    const previousProducts = products;
    dispatch(deleteProductAction(id));

    deleteProductMutation.mutate(id, {
      onSettled: () => {
        setIsLoading(false);
        setLoadingButton(null);
      },
      onError: () => {
        // Revert the change if the mutation fails
        dispatch(fetchProducts());
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button
        onClick={handleAddProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
        disabled={isLoading}
      >
        Add Product
        {loadingButton === 'add' && (
          <div className="ml-2 border-2 border-t-2 border-white rounded-full w-4 h-4 animate-spin"></div>
        )}
      </button>
      <ul className="mt-4 space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            {editingProduct && editingProduct.id === product.id ? (
              <>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  className="border rounded px-2 py-1 flex-grow mr-2"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateProduct(product.id, editingProduct.title)
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
                    disabled={isLoading}
                  >
                    Save
                    {loadingButton === `update-${product.id}` && (
                      <div className="ml-2 border-2 border-t-2 border-white rounded-full w-4 h-4 animate-spin"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="flex-grow">{product.title}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 flex items-center"
                    disabled={isLoading}
                  >
                    Delete
                    {loadingButton === `delete-${product.id}` && (
                      <div className="ml-2 border-2 border-t-2 border-white rounded-full w-4 h-4 animate-spin"></div>
                    )}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
