import React, { useEffect, useRef, useState } from "react";
import { Col, Input, Modal, ModalProps, Row } from "antd";

import {
  useGetOneTodo,
  useCreateOneTodo,
  useUpdateOneTodo,
} from "@/hooks/todoHooks";

import { IdType } from "@/types";
import TodoType from "@/types/TodoType";

interface ITodoDetailsModalProps extends ModalProps {
  todoId: IdType | null;
  onClose?: () => void;
}

const TodoDetailsModal: React.FC<ITodoDetailsModalProps> = ({
  todoId,
  ...props
}) => {
  const prevProps = useRef({ saving: false });

  const [todoDetails, setTodoDetails] = useState<TodoType | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const { data: todo, isLoading } = useGetOneTodo(todoId);

  const createOneTodoMutation = useCreateOneTodo();
  const updateOneTodoMutation = useUpdateOneTodo();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoDetails((prev) => ({ ...prev!, [name]: value }));
  };

  useEffect(() => {
    if (props.open && todoId) {
      if (todo) {
        setTodoDetails({ ...todo });
      }
    } else {
      setTodoDetails(null);
    }
  }, [props.open, todoId, todo]);

  useEffect(() => {
    const saving = updateOneTodoMutation?.isLoading || createOneTodoMutation?.isLoading;
    if (prevProps.current.saving && !saving) {
      if (!(updateOneTodoMutation?.error || createOneTodoMutation?.error)) {
        props.onClose?.();
      }
    }

    return () => {
      prevProps.current = { saving };
    };
  }, [updateOneTodoMutation?.isLoading, createOneTodoMutation?.isLoading]);

  const hasError = () => {
    const errors: Record<string, string | null> = {};

    let { title, description } = todoDetails || {};
    title = title?.trim?.();
    description = description?.trim?.();

    if (!title) {
      errors.title = "Title is required";
    }

    if (!description) {
      errors.description = "Description is required";
    }

    setErrors(errors);

    return Object.values(errors).some((v) => v !== null);
  };

  const onOk = () => {
    if (hasError()) return;

    const payload: any = {
      title: todoDetails?.title.trim(),
      description: todoDetails?.description?.trim(),
    };

    if (todoId) {
      payload._id = todoId;
      updateOneTodoMutation.mutate(payload);
    } else {
      createOneTodoMutation.mutate(payload);
    }
  };

  const loading =  isLoading || createOneTodoMutation.isLoading || updateOneTodoMutation.isLoading;

  return (
    <Modal {...props} title="Todo Details" onOk={onOk} confirmLoading={loading}>
      <Col className="mb-4">
        <label className="font-bold mb-4">Title</label>
        <Input
          name="title"
          placeholder="Title"
          value={todoDetails?.title}
          onChange={handleChange}
          disabled={loading}
        />
        <Row className="text-red-500 mt-1">{errors?.title}</Row>
      </Col>

      <Col>
        <label className="font-bold mb-4">Description</label>
        <Input.TextArea
          name="description"
          placeholder="Description"
          value={todoDetails?.description}
          onChange={handleChange}
          disabled={loading}
        />

        <Row className="text-red-500 mt-1">{errors?.description}</Row>
      </Col>
    </Modal>
  );
};

export default TodoDetailsModal;
