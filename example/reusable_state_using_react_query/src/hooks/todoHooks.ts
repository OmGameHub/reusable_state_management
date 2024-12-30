import { useMutation } from "react-query";
import buildReactQueryHooks, { BaseListReactQueryProps } from "./buildReactQueryHooks";

import axiosService from "@/config/axiosConfig";
import queryClient from "@/config/queryClient";

import TodoType from "@/types/TodoType";
import { IdType } from "@/types";

const endpoint = "/todos";

const services: BaseListReactQueryProps["services"] = {
  getAll: (params) => {
    return new Promise((resolve, reject) => {
      axiosService
        .get(endpoint, { params })
        .then((res) => {
          const data = res.data.data;
          res.data.data = { data };
          resolve(res);
        })
        .catch(reject);
    });
  },
};

const {
  useCreateOne: useCreateOneTodo,
  useGetAll: useGetAllTodos,
  useGetOne: useGetOneTodo,
  useUpdateOne: useUpdateOneTodo,
  useDeleteOne: useDeleteOneTodo,
} = buildReactQueryHooks<TodoType>({
  queryName: "Todo",
  apiEndpoint: endpoint,
  services,
});

const useToggleTodoDoneStatus = () => useMutation({
  mutationFn: async (id: IdType) => {
    const { data } = await axiosService.patch(`${endpoint}/toggle/status/${id}`);
    return data.data;
  },
  onSuccess: () => queryClient.invalidateQueries("Todo"),
});

export {
  useCreateOneTodo,
  useGetAllTodos,
  useGetOneTodo,
  useUpdateOneTodo,
  useDeleteOneTodo,
  useToggleTodoDoneStatus,
};