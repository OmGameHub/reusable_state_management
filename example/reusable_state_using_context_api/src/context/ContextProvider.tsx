import { FC, ReactNode } from "react";

import { DogContextProvider } from "./DogContext";
import { CatContextProvider } from "./CatContext";
import { TodoListContextProvider } from "./TodoListContext";

// Define the props interface for context provider components.
interface ContextProviderProps {
  // React children to be rendered within the provider.
  children: ReactNode;
}

/**
 * Combines an array of context provider components into a single provider component.
 *
 * @param providers - An array of context provider components to combine. Defaults to an empty array.
 * @returns A React component that renders the combined context providers.
 */
const combineContextProviders = (
  providers: FC<ContextProviderProps>[] = []
) => {
  // Use the `reduce` method to iterate over the array of providers.
  return providers.reduce(
    // For each provider, create a new component that renders the accumulated providers and the current provider.
    (AccumulatedProviders, CurrentProvider) =>
      ({ children }) =>
        (
          <AccumulatedProviders>
            <CurrentProvider>{children}</CurrentProvider>
          </AccumulatedProviders>
        ),
    // Use an empty fragment as the initial value for the accumulator.
    ({ children }: ContextProviderProps) => <>{children}</>
  );
};

// Create a context provider component that combines an empty array of providers.
const ContextProvider: FC<ContextProviderProps> = combineContextProviders([
  DogContextProvider,
  CatContextProvider,
  TodoListContextProvider,
]);

// Export the context provider component as the default export.
export default ContextProvider;
