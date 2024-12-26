import { toast } from "react-toastify";

import BaseListContext, {
  BaseListContextType,
  IBaseListContext,
} from "./BaseListContext";

import { requestHandler } from "@/utils/requestHandler";
import axiosService from "@/config/axiosConfig";
import CatType from "@/types/CatType";
import { IdType } from "@/types";

type CatListContextType = IBaseListContext<CatType>;

interface ICatListContext extends CatListContextType {
  state: CatListContextType["state"] & {
    randomCatId: IdType | null;
    randomCatLoading?: boolean;
    randomCatError?: any;
  };
  actions: CatListContextType["actions"] & {
    getOneRandomCat: (setLoading?: (loading: boolean) => void) => Promise<void>;
  };
}

const endpoint = "/public/cats";

const reducers: BaseListContextType<CatType>["reducers"] = {
  setOneRandomItemLoading: (state, actions) => {
    const { loading = false, error = null } = actions.payload;

    return Object.assign({}, state, {
      randomCatLoading: loading,
      randomCatError: error,
    });
  },
  getOneRandomSuccess: (state, action) => {
    const { payload } = action;
    const { id } = payload;
    payload._id = id || payload._id;
    payload.id = id || payload._id;

    return Object.assign({}, state, {
      randomCatId: id,
      randomCatLoading: false,
      map: Object.assign({}, state.map, { [id]: payload }),
    });
  },
};

const actions: BaseListContextType<CatType>["actions"] = {
  getOneRandomCat:
    (_, dispatch) => (setLoading?: (loading: boolean) => void) => {
      dispatch({ type: "setOneRandomItemLoading", payload: { loading: true } });

      return requestHandler(
        () => axiosService.get(`${endpoint}/cat/random`),
        (resData) => {
          dispatch({ type: "getOneRandomSuccess", payload: resData.data });
        },
        (error) => {
          console.error("Error fetching random cat", error);
          toast.error("Something went wrong fetching random cat details");
          dispatch({ type: "setOneRandomItemLoading", payload: { error } });
        },
        setLoading
      );
    },
};

const catListContext = new BaseListContext<CatType>({
  name: "Cat",
  endpoint,
  initState: {
    randomCatId: null,
    randomCatLoading: false,
    randomCatError: null,
  },
  reducers,
  actions,
});

const { BaseListProvider: CatContextProvider, useBaseListContext } =
  catListContext.buildContext();

const useCatContext = useBaseListContext as () => ICatListContext;

export { CatContextProvider, useCatContext };
