import BaseListContext from "./BaseListContext";
import DogType from "@/types/DogType";

const { BaseListProvider: DogContextProvider, useBaseListContext } =
  new BaseListContext<DogType>({
    name: "Dog",
    endpoint: "/public/dogs",
  }).buildContext();

const useDogContext = useBaseListContext;

export { DogContextProvider, useDogContext };
