import React, { useEffect, useRef, useState } from "react";
import { Col, Input, Modal, ModalProps, Row } from "antd";

import { useTodoContext } from "@/context/TodoListContext";

import { IdType } from "@/types";
import TodoType from "@/types/TodoType";

interface ITodoDetailsModalProps extends ModalProps {
  todoId: IdType | null;
  onClose?: () => void;
  onSuccess: () => void;
}

const TodoDetailsModal: React.FC<ITodoDetailsModalProps> = ({
  todoId,
  onSuccess,
  ...props
}) => {
  const prevProps = useRef({ saving: false });

  const [todoDetails, setTodoDetails] = useState<TodoType | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const {
    state: { map, newItem },
    actions: { createOne, updateOne },
  } = useTodoContext();
  const todo = todoId ? map[todoId] : newItem;

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
      setTodoDetails({} as TodoType);
    }
  }, [props.open]);

  useEffect(() => {
    if (prevProps.current.saving && !todo?.saving) {
      if (!todo?.error) {
        props?.onClose?.();
        onSuccess?.();
      }
    }

    return () => {
      prevProps.current = {
        saving: todo?.saving ?? false,
      };
    };
  }, [todo?.saving]);

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

    const payload = {
      title: todoDetails?.title.trim(),
      description: todoDetails?.description?.trim(),
    };

    if (todoId) {
      updateOne(todoId, payload!);
    } else {
      createOne(payload!);
    }
  };

  const loading = todo?.saving ?? false;

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
