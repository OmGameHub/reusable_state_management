import { AxiosResponse } from "axios";

import { APIResponseType } from "./types";

// A utility function for handling API requests with loading, success, and error handling
export const requestHandler = async (
  api: () => Promise<AxiosResponse<APIResponseType, any>>,
  onSuccess: (data: APIResponseType) => void,
  onError: (error: string) => void,
  setLoading?: ((loading: boolean) => void) | null,
) => {
  try {
    // Show loading state if setLoading function is provided
    setLoading?.(true);

    // Make the API request
    const response = await api();
    const { data } = response;
    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error: any) {
    // Handle error cases, including unauthorized and forbidden cases
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear(); // Clear local storage on authentication issues
    }

    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading?.(false);
  }
};
