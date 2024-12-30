import { useQuery, useMutation } from "react-query";
import { IdType, QueryParamsType } from "@/types";
import axiosService from "@/config/axiosConfig";
import queryClient from "@/config/queryClient";

// Define the type for the API service methods
export type API_ServiceType = {
  getOne: (id: IdType) => Promise<any>;
  getAll: (params: QueryParamsType) => Promise<any>;
  createOne: (data: Record<string, any>) => Promise<any>;
  updateOne: (id: IdType, data: Record<string, any>) => Promise<any>;
  deleteOne: (id: IdType) => Promise<any>;
};

// Define the props for the BaseListReactQuery component
export interface BaseListReactQueryProps {
  queryName: string;
  apiEndpoint: string;
  keyId?: string;
  services?: Partial<API_ServiceType>;
}

const buildReactQueryHooks = <T = Record<string, any>>({
  queryName,
  apiEndpoint,
  keyId = "_id",
  services = {},
}: BaseListReactQueryProps) => {
  // Define the default API service methods.
  const _services = {
    getAll: (params: QueryParamsType) => axiosService.get(apiEndpoint, { params }),
    getOne: (id: IdType | null) => axiosService.get(`${apiEndpoint}/${id}`),
    createOne: (data: Record<string, unknown>) => axiosService.post(apiEndpoint, data),
    updateOne: (id: IdType, data: Record<string, any>) => axiosService.patch(`${apiEndpoint}/${id}`, data),
    deleteOne: (id: IdType) => axiosService.delete(`${apiEndpoint}/${id}`),
    ...services,
  };

  // Return an object containing the generated React Query hooks.
  return {
    useGetAll: (params: QueryParamsType) => useQuery({
      queryKey: [queryName, params],
      queryFn: async () => {
        const { data } = await _services.getAll(params);
        const resData = data.data as { [key: string]: any; data: T[] };

        resData.data.forEach((item: T) => {
          queryClient.setQueryData([queryName, item[keyId as keyof T]], item);
        });
        return resData;
      },
    }),
    useGetOne: (id: IdType | null) => useQuery({
      queryKey: [queryName, id],
      queryFn: async () => {
        if (!id) return null;
        const { data } = await _services.getOne(id);
        return data.data as T;
      },
      enabled: !!id,
    }),
    useCreateOne: () => useMutation({
      mutationKey: [queryName],
      mutationFn: async (payload: Record<string, any>) => {
        const { data } = await _services.createOne(payload);
        return data.data as T;
      },
      onSuccess: () => queryClient.invalidateQueries([queryName]),
    }),
    useUpdateOne: () => useMutation({
      mutationKey: [queryName],
      mutationFn: async (payload: Record<string, any>) => {
        const { data } = await _services.updateOne(payload._id, payload);
        return data.data as T;
      },
      onSuccess: () => queryClient.invalidateQueries([queryName]),
    }),
    useDeleteOne: () => useMutation({
      mutationFn: async (id: IdType) => {
        const { data } = await _services.deleteOne(id);
        return data.data as any;
      },
      onSuccess: () => queryClient.invalidateQueries([queryName]),
    }),
  };
};

export default buildReactQueryHooks;
