import { toast } from "react-toastify";

import BaseListContext, {
  IBaseListContext,
  BaseListContextType,
} from "./BaseListContext";

import { requestHandler } from "@/utils/requestHandler";
import axiosService from "@/config/axiosConfig";
import TodoType from "@/types/TodoType";
import { IdType } from "@/types";

export type TodoContextType = BaseListContextType<TodoType>;

type TodoListContextType = IBaseListContext<TodoType>;

interface ITodoListContext extends TodoListContextType {
  actions: TodoListContextType["actions"] & {
    toggleTodoDoneStatus: (
      id: IdType,
      setLoading?: (loading: boolean) => void
    ) => Promise<void>;
  };
}

const endpoint = "/todos";

const services: TodoContextType["services"] = {
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

const actions: TodoContextType["actions"] = {
  toggleTodoDoneStatus:
    (_, dispatch) => (id: IdType, setLoading?: (loading: boolean) => void) => {
      dispatch({ type: "setOneItemLoading", payload: { id, loading: true } });

      return requestHandler(
        () => axiosService.patch(`${endpoint}/toggle/status/${id}`),
        (resData) => {
          dispatch({
            type: "getOneSuccess",
            payload: resData.data,
          });
        },
        (error) => {
          console.error("Error toggling todo done status", error);
          toast.error("Something went wrong toggling todo done status");
          dispatch({ type: "setOneItemLoading", payload: { id, error } });
        },
        setLoading
      );
    },
};

const { BaseListProvider: TodoListContextProvider, useBaseListContext } =
  new BaseListContext<TodoType>({
    name: "Todo",
    endpoint,
    services,
    actions,
  }).buildContext();

const useTodoContext = useBaseListContext as () => ITodoListContext;

export { TodoListContextProvider, useTodoContext };
