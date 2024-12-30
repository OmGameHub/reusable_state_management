import { useQuery } from "react-query";
import buildReactQueryHooks from "./buildReactQueryHooks";
import axiosService from "@/config/axiosConfig";
import CatType from "@/types/CatType";

const endpoint = "/public/cats";

const {
  useGetAll: useGetAllCats,
  useGetOne: useGetCat
} = buildReactQueryHooks<CatType>({
  queryName: "Cat",
  apiEndpoint: endpoint,
  keyId: "id",
});



const useGetRandomCat = () => useQuery({
  queryKey: "randomCat",
  queryFn: async () => {
    const { data } = await axiosService.get(`${endpoint}/cat/random`);
    return data.data as CatType;
  },
});

export { useGetAllCats, useGetCat, useGetRandomCat };

