import React, { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";

import { requestHandler } from "@/utils/requestHandler";
import { IdType, QueryParamsType } from "@/types";
import axiosService from "@/config/axiosConfig";

// Define a generic type for Action
type ActionType = { type: string; payload: any };
// Define a generic type for reducer function, which takes state and action as arguments and return a new state
type ReducerFunctionType<T> = (
  state: IBaseListContext<T>["state"],
  action: ActionType
) => IBaseListContext<T>["state"];
// Define a generic type for action function, which takes state and dispatch as arguments and return a promise
type ActionFunctionType<T> = (
  state: IBaseListContext<T>["state"],
  dispatch: (action: ActionType) => void
) => (...args: any[]) => Promise<any>;

// Define the parameter type for the BaseListContext
export type BaseListContextType<T> = {
  // The name of the context
  name: string;
  // The API endpoint for data fetching
  endpoint: string;
  // Custom services for fetching data from the API
  services?: Partial<{
    getOne: (id: IdType) => Promise<any>;
    getAll: (params: QueryParamsType) => Promise<any>;
    createOne: (data: Record<string, any>) => Promise<any>;
    updateOne: (id: IdType, data: Record<string, any>) => Promise<any>;
    deleteOne: (id: IdType) => Promise<any>;
  }>;
  // The initial state of the context
  initState?: Record<string, any>;
  // Custom actions that can be performed within the context
  actions?: Record<string, ActionFunctionType<T>>;
  // Custom reducers for handling state updates
  reducers?: Record<string, ReducerFunctionType<T>>;
};

// Define the interface for the BaseListContext
export interface IBaseListContext<T = any> {
  // The state object containing data and UI state
  state: {
    // A map to store data items by their IDs
    map: Record<string, T | null>;

    // A map to store data boards by their keys
    boards: Record<
      string,
      {
        loading?: boolean;
        listMap: Record<number, IdType[]>;
        metaData: Record<string, any>;
      }
    >;

    // Data for a new item being created
    newItem: (T & { saving: boolean; error: null }) | null;

    // Allows for additional custom state properties
    [key: string]: any;
  };

  // The actions object containing functions to interact with the context data and state
  actions: {
    // Create a new data item
    createOne: (
      data: Record<string, any>,
      setLoading?: (loading: boolean) => void
    ) => Promise<any>;

    // Get all data items based on the given parameters
    getAll: (
      params: QueryParamsType,
      setLoading?: (loading: boolean) => void
    ) => Promise<any>;
    // Get a single data item by its ID
    getOne: (
      id: IdType,
      setLoading?: (loading: boolean) => void
    ) => Promise<any>;

    // Update a single data item by its ID
    updateOne: (
      id: IdType,
      data: Record<string, any>,
      setLoading?: (loading: boolean) => void
    ) => Promise<any>;

    // Delete a single data item by its ID
    deleteOne: (
      id: IdType,
      setLoading?: (loading: boolean) => void
    ) => Promise<any>;

    // Allows for additional custom action functions
    [key: string]: (...args: any[]) => Promise<any>;
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const getBoardKey = (params: QueryParamsType = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, ...restParams } = params;
  return JSON.stringify(restParams);
};

// A base class for creating list contexts that manage data fetching, state, and actions.
class BaseListContext<T = any> {
  // The name of the context
  private contextName: string;
  // The initial state of the context
  private initState: IBaseListContext<T>["state"];
  // Custom actions specific to this instance of the context
  private customActions: Record<string, ActionFunctionType<T>> = {};
  // The API endpoint for data fetching
  API_ENDPOINT: string;

  private services = {
    getOne: (id: IdType) => axiosService.get(`${this.API_ENDPOINT}/${id}`),
    getAll: (params: QueryParamsType) =>
      axiosService.get(this.API_ENDPOINT, { params }),
    createOne: (data: Record<string, unknown>) =>
      axiosService.post(this.API_ENDPOINT, data),
    updateOne: (id: IdType, data: Record<string, any>) =>
      axiosService.patch(`${this.API_ENDPOINT}/${id}`, data),
    deleteOne: (id: IdType) =>
      axiosService.delete(`${this.API_ENDPOINT}/${id}`),
  };

  // Reducers for handling state updates
  private reducers: Record<string, ReducerFunctionType<T>> = {
    // Reducer for handling the 'createOne' action
    createOne: (state: IBaseListContext<T>["state"], action: ActionType) => {
      const { payload } = action;

      return Object.assign({}, state, {
        newItem: Object.assign({}, payload, { saving: true, error: null }),
      });
    },
    // Reducer for handling the 'createOneSuccess' action
    createOneSuccess: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      const { payload } = action;
      payload._id = payload._id || payload.id;
      payload.id = payload._id;
      const { id } = payload;

      return Object.assign({}, state, {
        map: Object.assign({}, state.map, { [id]: payload }),
        newItem: null,
      });
    },
    // Reducer for handling the 'createOneFailure' action
    createOneFailure: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      return Object.assign({}, state, {
        newItem: Object.assign({}, state.newItem, {
          saving: false,
          error: action.payload,
        }),
      });
    },
    // Reducer for handling the 'setOneItemLoading' action
    setOneItemLoading: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      const { id, ...restPayload } = action.payload;

      return Object.assign({}, state, {
        map: Object.assign({}, state.map, {
          [id]: Object.assign({}, state.map[id], restPayload),
        }),
      });
    },
    // Reducer for handling the 'getOneSuccess' action
    getOneSuccess: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      const { payload } = action;
      payload._id = payload._id || payload.id;
      payload.id = payload._id;
      const { id } = payload;

      return Object.assign({}, state, {
        map: Object.assign({}, state.map, { [id]: payload }),
      });
    },
    // Reducer for handling the 'setAllItemsLoading' action
    setAllItemsLoading: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      const { params, ...restPayload } = action.payload;
      const boardKey = getBoardKey(params);

      return Object.assign({}, state, {
        boards: Object.assign({}, state.boards, {
          [boardKey]: Object.assign({}, state.boards[boardKey], restPayload),
        }),
      });
    },
    // Reducer for handling the 'getAllSuccess' action
    getAllSuccess: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      const { params, data, metaData } = action.payload;
      const boardKey = getBoardKey(params);

      const map = data.reduce((acc: Record<IdType, T>, item: any) => {
        const id = item._id ?? item.id;
        acc[id] = { ...item, id, _id: id };
        return acc;
      }, {});
      const list = data.map((item: any) => item?._id || item?.id);

      return Object.assign({}, state, {
        map: Object.assign({}, state.map, map),
        boards: Object.assign({}, state.boards, {
          [boardKey]: Object.assign({}, state.boards[boardKey], {
            listMap: Object.assign({}, state.boards[boardKey].listMap, {
              [params.page]: list,
            }),
            loading: false,
            metaData,
          }),
        }),
      });
    },
    // Reducer for handling the 'deleteOneSuccess' action
    deleteOneSuccess: (
      state: IBaseListContext<T>["state"],
      action: ActionType
    ) => {
      const id = action.payload;

      const map = Object.assign({}, state.map);
      map[id] = null;

      const boardKeys = Object.keys(state.boards);
      const boards = boardKeys.reduce((acc: Record<string, any>, key) => {
        const listMap = state.boards[key].listMap;
        for (const pageIdx in listMap) {
          listMap[pageIdx] = listMap[pageIdx].filter((itemId) => itemId !== id);
        }

        acc[key] = Object.assign({}, state.boards[key], { listMap });
        return acc;
      }, {});

      return Object.assign({}, state, { map, boards });
    },
  };

  // Constructor for the BaseListContext class
  constructor({
    name,
    endpoint,
    services = {},
    initState = {},
    actions = {},
    reducers = {},
  }: BaseListContextType<T>) {
    this.contextName = name;
    this.API_ENDPOINT = endpoint;
    this.services = Object.assign({}, this.services, services);
    this.initState = Object.assign(
      {
        map: {},
        boards: {},
        metaData: {},
        newItem: null,
      },
      initState
    );
    this.reducers = Object.assign({}, this.reducers, reducers);
    this.customActions = Object.assign({}, actions);
  }

  // The main reducer function for the context
  private readonly reducer = (
    state: IBaseListContext<T>["state"],
    action: ActionType
  ) => {
    const actionType = action.type;
    if (actionType in this.reducers) {
      return this.reducers[actionType](state, action);
    }

    return state;
  };

  // Method to build and return the context and its provider
  buildContext = () => {
    // Create the context using React's createContext API
    const BaseListContext = createContext<IBaseListContext<T>>({
      state: this.initState,
      actions: {} as IBaseListContext<T>["actions"],
    });

    // Define the provider component for the context
    const BaseListProvider: React.FC<{ children: React.ReactNode }> = ({
      children,
    }) => {
      const { customActions, services } = this;
      const [state, dispatch] = useReducer(this.reducer, this.initState);
      // Define the actions object containing functions to interact with the context data and state
      const actions: IBaseListContext<T>["actions"] = {
        // Action to create a new data item
        createOne: (data, setLoading) => {
          dispatch({ type: "createOne", payload: data });

          return requestHandler(
            () => services.createOne(data),
            (resData) => {
              dispatch({ type: "createOneSuccess", payload: resData });
            },
            (error: any) => {
              console.log(`Error creating ${this.contextName}`, error);
              toast.error("Something went wrong while saving data!");
              dispatch({ type: "createOneFailure", payload: error });
            },
            setLoading
          );
        },
        // Action to fetch all data items
        getAll: (params, setLoading) => {
          dispatch({
            type: "setAllItemsLoading",
            payload: { params, loading: true },
          });

          return requestHandler(
            () => services.getAll(params),
            (resData) => {
              const { data, ...meta } = resData.data;
              dispatch({
                type: "getAllSuccess",
                payload: { params, data, metaData: meta },
              });
            },
            (error: any) => {
              console.log(`Error fetching ${this.contextName} list`, error);
              toast.error("Something went wrong fetching list data!");
              dispatch({
                type: "setAllItemsLoading",
                payload: { params, error, loading: false },
              });
            },
            setLoading
          );
        },
        // Action to fetch a single data item by ID
        getOne: (id, setLoading) => {
          dispatch({
            type: "setOneItemLoading",
            payload: { id, loading: true },
          });
          return requestHandler(
            () => services.getOne(id),
            (resData) => {
              dispatch({ type: "getOneSuccess", payload: resData?.data });
            },
            (error: any) => {
              console.log(
                `Error fetching ${this.contextName} with id: ${id}`,
                error
              );
              toast.error("Something went wrong while fetching!");
              dispatch({
                type: "setOneItemLoading",
                payload: { id, error, loading: false },
              });
            },
            setLoading
          );
        },
        // Action to update a single data item by ID
        updateOne: (id, data, setLoading) => {
          dispatch({
            type: "setOneItemLoading",
            payload: { id, saving: true },
          });
          return requestHandler(
            () => services.updateOne(id, data),
            (resData) => {
              dispatch({ type: "getOneSuccess", payload: resData?.data });
            },
            (error: any) => {
              console.log(
                `Error updating ${this.contextName} with id: ${id}`,
                error
              );
              toast.error("Something went wrong while saving data!");
              dispatch({
                type: "setOneItemLoading",
                payload: { id, error, saving: false },
              });
            },
            setLoading
          );
        },
        // Action to delete a single data item by ID
        deleteOne: (id, setLoading) => {
          dispatch({
            type: "setOneItemLoading",
            payload: { id, deleting: true },
          });
          return requestHandler(
            () => services.deleteOne(id),
            () => {
              dispatch({ type: "deleteOneSuccess", payload: id });
            },
            (error: any) => {
              console.log(
                `Error deleting ${this.contextName} with id: ${id}`,
                error
              );
              toast.error("Something went wrong while deleting!");
              dispatch({
                type: "setOneItemLoading",
                payload: { id, error, deleting: false },
              });
            },
            setLoading
          );
        },
      };
      // Add any custom actions defined for this instance
      Object.keys(customActions).forEach((key) => {
        actions[key] = customActions[key](state, dispatch);
      });

      return (
        // Provide the context value to the children components
        <BaseListContext.Provider value={{ state, actions }}>
          {children}
        </BaseListContext.Provider>
      );
    };

    // Return both the Provider component and a custom hook to access the context
    return {
      BaseListProvider,
      useBaseListContext: () => useContext(BaseListContext),
    };
  };
}

export default BaseListContext;
