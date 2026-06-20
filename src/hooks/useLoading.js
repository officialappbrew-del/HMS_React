import { useDispatch } from 'react-redux';
import { startApiRequest, endApiRequest, setGlobalLoading, setPageLoading } from '../features/loadingSlice';

export const useLoading = () => {
  const dispatch = useDispatch();

  const startLoading = (requestId, message = 'Loading...') => {
    dispatch(startApiRequest({ requestId, message }));
  };

  const stopLoading = (requestId) => {
    dispatch(endApiRequest({ requestId }));
  };

  const setGlobalLoadingState = (loading) => {
    dispatch(setGlobalLoading(loading));
  };

  const setPageLoadingState = (loading) => {
    dispatch(setPageLoading(loading));
  };

  // Helper function to wrap async operations
  const withLoading = async (asyncFn, requestId, message = 'Loading...') => {
    try {
      startLoading(requestId, message);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(requestId);
    }
  };

  return {
    startLoading,
    stopLoading,
    setGlobalLoadingState,
    setPageLoadingState,
    withLoading
  };
};

export default useLoading;