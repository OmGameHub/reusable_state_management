import buildReactQueryHooks from "./buildReactQueryHooks";
import DogType from "@/types/DogType";

const {
  useGetAll: useGetAllDogs,
  useGetOne: useGetDog,
} = buildReactQueryHooks<DogType>({
  queryName: "Dog",
  apiEndpoint: "/public/dogs",
  keyId: "id",
});

export { useGetAllDogs, useGetDog };