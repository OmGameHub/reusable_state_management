# Reusable State Management in React

This guide introduces a scalable and reusable approach to managing state in React applications. By using the **Context API**, a custom `BaseListContext` class and `buildReactQueryHooks`, you can efficiently manage data lists, streamline CRUD operations, and ensure a consistent state management strategy across your app.

---

## **Features**

1. **Reusability**: Quickly create state management contexts and hooks for different data types without duplicating code.
2. **Scalability**: Handle complex state management for various entities across large applications.
3. **Consistency**: Standardize CRUD operations and state management across multiple modules.
4. **Integration**: Easily plug this pattern into existing React applications.
5. **Performance**: Utilize React Query for caching, data fetching, and efficient UI updates.

---

## **Understanding `BaseListContext`**

`BaseListContext` is a reusable utility designed to simplify state management in React apps. It provides:
- Shared state management for lists of data.
- Common CRUD operations (Create, Read, Update, Delete).
- Modular and reusable structure that reduces repetitive code.  

### **Key Features**
- **Reusability**: Share a common state management pattern for any data type (e.g., dogs, tasks, users).
- **Centralized Logic**: Manage loading states, errors, and metadata (e.g., pagination).
- **Customizable**: Easily adapt to different endpoints and entity types.

---

### **Step-by-Step Guide: Using `BaseListContext`**

#### **1. Define Your Data Type**

Define the structure of the data entity you'll manage. For example:

```typescript
// types/DogType.ts
type DogType = {
  id: number;
  name: string;
  breed_group?: string;
  image: {
    url: string;
  };
  life_span?: string;
  temperament?: string;
};

export default DogType;
```

#### **2. Create a Context for Your Data Type**

Use `BaseListContext` to generate a custom context for your data type. Provide a name and the API endpoint:

```typescript
// context/DogContext.ts
import BaseListContext from "./BaseListContext";
import DogType from "@/types/DogType";

const { BaseListProvider: DogContextProvider, useBaseListContext } =
  new BaseListContext<DogType>({
    name: "Dog", // Unique name for the context
    endpoint: "/public/dogs", // API endpoint for fetching dogs
  }).buildContext();

export { DogContextProvider, useBaseListContext as useDogContext };
```

#### **3. Use the Context in Components**

Access the state and CRUD actions through the custom context's hooks:

```typescript
// pages/Dogs.tsx
import { useDogContext } from "@/context/DogContext";

const Dogs = () => {
  const {
    state: { map, boards },
    actions: { getAll },
  } = useDogContext();

  useEffect(() => {
    getAll({ page: 1, limit: 10 }); // Fetch dogs
  }, []);

  return (
    <div>
      {Object.values(map).map((dog) => (
        <div key={dog.id}>
          <img src={dog.image.url} alt={dog.name} />
          <h3>{dog.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default Dogs;
```

#### **4. Wrap Your App with the Context Provider**

Ensure the `DogContextProvider` wraps your application to make the context accessible:

```typescript
// App.tsx
import { DogContextProvider } from "@/context/DogContext";

const App = () => (
  <DogContextProvider>
    <Dogs />
  </DogContextProvider>
);

export default App;
```

---

## **Understanding `buildReactQueryHooks`**

`buildReactQueryHooks` is a utility that simplifies data fetching using **React Query**. Instead of creating hooks for each data type manually, it generates reusable hooks for fetching, caching, and managing data with ease.

### **Key Features**
- **Reusability**: Create hooks for any data type with minimal setup.
- **Built-in Caching**: Automatically leverage React Query's caching.
- **Customization**: Easily specify endpoints, query keys, and API configurations.

---

### **Step-by-Step Guide: Using `buildReactQueryHooks`**

#### **1. Install React Query**

Ensure React Query is installed in your project:

```bash
npm install react-query
```

#### **2. Set Up a Query Client**

Configure a `QueryClient` for managing query caching:

```typescript
// config/queryClient.ts
import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
```

#### **3. Generate Hooks for Your Data Type**

Create React Query hooks using `buildReactQueryHooks`:

```typescript
// hooks/dogHooks.ts
import buildReactQueryHooks from "./buildReactQueryHooks";
import DogType from "@/types/DogType";

const {
  useGetAll: useGetAllDogs,
  useGetOne: useGetDog,
} = buildReactQueryHooks<DogType>({
  queryName: "Dog", // Query key for caching
  apiEndpoint: "/public/dogs", // API endpoint for fetching dogs
  keyId: "id", // Primary key of the entity
});

export { useGetAllDogs, useGetDog };
```

#### **4. Use the Hooks in Components**

Use the generated hooks to fetch and manage data:

```typescript
// pages/Dogs.tsx
import { useGetAllDogs } from "@/hooks/dogHooks";

const Dogs = () => {
  const { data: resData, isFetching } = useGetAllDogs({ page: 1, limit: 10 });
  const dogs = resData?.data ?? [];

  return (
    <div>
      {isFetching && <p>Loading...</p>}
      {dogs.map((dog) => (
        <div key={dog.id}>
          <img src={dog.image.url} alt={dog.name} />
          <h3>{dog.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default Dogs;
```

#### **5. Wrap Your App with the Query Client Provider**

Enable React Query by wrapping your app with the `QueryClientProvider`:

```typescript
// App.tsx
import { QueryClientProvider } from "react-query";
import queryClient from "@/config/queryClient";
import Dogs from "@/pages/Dogs";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Dogs />
  </QueryClientProvider>
);

export default App;
```

---

## **Comparison: `BaseListContext` vs. `buildReactQueryHooks`**

| **Feature**           | **BaseListContext**                            | **buildReactQueryHooks**                     |
|-----------------------|-----------------------------------------------|---------------------------------------------|
| **Purpose**           | Centralized state management for CRUD actions. | Simplified data fetching and caching.       |
| **Abstraction**       | Provides a global state with actions like create, update, delete. | Focuses on fetching and caching data.       |
| **Reusability**       | Create reusable contexts for different data types. | Create reusable data-fetching hooks.        |
| **When to Use**       | For state-heavy apps needing shared CRUD logic. | For API-heavy apps needing optimized fetching and caching. |

---

## **Screenshots**

### Dogs Page  
![Dogs Page](./screenshots/dogs_page.png)

### Cats Page  
![Cats Page](./screenshots/cats_page.png)

---

## **Credits**

This project uses APIs from [Free API](https://freeapi.app/). For more details, visit their [GitHub repository](https://github.com/hiteshchoudhary/apihub).

---

## **Conclusion**

By combining `BaseListContext` and `buildReactQueryHooks`, this reusable state management solution offers a highly efficient, scalable, and maintainable approach to managing data in React applications.  

Whether you're building a simple CRUD app or a complex enterprise application, this pattern ensures consistency, performance, and ease of integration.  

Happy coding! 🚀
