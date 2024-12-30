import { useMemo, useState } from "react";
import {
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Tag,
  Popconfirm,
  Col,
  Row,
  Switch,
  Button,
  Input,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import TodoDetailsModal from "@/components/TodoDetailsModal";

import {
  useGetAllTodos,
  useDeleteOneTodo,
  useToggleTodoDoneStatus,
} from "@/hooks/todoHooks";

import { IdType, QueryParamsType } from "@/types";
import { formatDateTime } from "@/utils/helperFunctions";

const defaultParams: QueryParamsType = {};

const TodoList = () => {
  const [params, setParams] = useState<QueryParamsType>({ ...defaultParams });
  const [filter, setFilter] = useState<QueryParamsType>({ ...defaultParams });

  const [showTodoDetailsModal, setShowTodoDetailsModal] = useState(false);
  const [selectedId, setSelectedId] = useState<IdType | null>(null);

  const { data: resData, isLoading } = useGetAllTodos(params);
  const { data = [] } = resData || { data: [] };

  const deleteTodoMutation = useDeleteOneTodo();
  const toggleTodoDoneStatusMutation = useToggleTodoDoneStatus();

  const handleShowTodoDetailsModal = (
    show: boolean = false,
    id: IdType | null = null
  ) => {
    setShowTodoDetailsModal(show);
    setSelectedId(id);
  };

  const columns: TableColumnsType<any> = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "title",
      },
      { title: "Description", dataIndex: "description" },
      {
        title: "Status",
        dataIndex: "isComplete",
        render(isComplete: boolean) {
          return isComplete ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="warning">Pending</Tag>
          );
        },
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (createdAt: string) =>
          formatDateTime(createdAt, "MMM DD, YYYY, hh:mm A"),
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        render: (updatedAt: string) =>
          formatDateTime(updatedAt, "MMM DD, YYYY, hh:mm A"),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render(_, record) {
          return (
            <Row gutter={16}>
              <Col>
                <EditOutlined
                  onClick={() => handleShowTodoDetailsModal(true, record._id)}
                />
              </Col>

              <Col>
                <Popconfirm
                  title={`Are you sure you want to delete this todo?`}
                  onConfirm={() => deleteTodoMutation.mutate(record._id)}
                  placement="right"
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Col>

              <Col>
                <Popconfirm
                  title={`Are you sure you want to ${
                    record.isComplete ? "mark as pending" : "mark as completed"
                  }?`}
                  onConfirm={() =>
                    toggleTodoDoneStatusMutation.mutate(record._id)
                  }
                  placement="right"
                >
                  <Switch
                    checked={record.isComplete}
                    loading={toggleTodoDoneStatusMutation.isLoading}
                    size="small"
                  />
                </Popconfirm>
              </Col>
            </Row>
          );
        },
      },
    ],
    [deleteTodoMutation, toggleTodoDoneStatusMutation]
  );

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    const newParams = {
      ...params,
      page: params.limit !== pageSize ? 1 : current,
      limit: pageSize,
    };
    setParams(newParams);
  };

  const handleChange =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      const value = typeof e === "string" ? e : e?.target?.value;
      setFilter((prev) => ({ ...prev, [name]: value }));
    };

  const onFilter = () => {
    const newParams = { ...params, ...filter };
    setParams(newParams);
  };

  const onClearFilter = () => {
    setFilter({ ...defaultParams });
    setParams({ ...defaultParams });
  };

  return (
    <div>
      <Row className="mb-4" align="middle" justify="space-between">
        <Col span={20}>
          <Row className="stretch">
            <Input
              className="w-96"
              value={filter.query}
              onChange={handleChange("query")}
              allowClear
            />

            <Select
              className="w-48 mx-2"
              placeholder="Select Status"
              value={filter.complete?.toString()}
              onChange={handleChange("complete")}
              allowClear
              options={[
                { label: "Completed", value: "true" },
                { label: "Pending", value: "false" },
              ]}
            />

            <Button type="primary" onClick={onFilter}>
              Filter
            </Button>

            <Button className="ml-2" onClick={onClearFilter}>
              Clear
            </Button>
          </Row>
        </Col>

        <Button type="primary" onClick={() => handleShowTodoDetailsModal(true)}>
          + Add Todo
        </Button>
      </Row>

      <Table
        columns={columns}
        dataSource={data?.map((todo) => ({ ...todo, key: todo._id }))}
        onChange={onChange}
        pagination={false}
        loading={isLoading}
      />

      <TodoDetailsModal
        open={showTodoDetailsModal}
        todoId={selectedId}
        onClose={() => handleShowTodoDetailsModal()}
        onCancel={() => handleShowTodoDetailsModal()}
      />
    </div>
  );
};

export default TodoList;
