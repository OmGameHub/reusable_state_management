type TodoType = {
  _id: string;
  title: string;
  description?: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
  loading?: boolean;
  saving?: boolean;
  error?: any;
};

export default TodoType;
