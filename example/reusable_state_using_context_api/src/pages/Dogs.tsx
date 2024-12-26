import { useEffect, useMemo, useState } from "react";
import { Avatar, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import DogDetailsDrawer from "@/components/DogDetailsDrawer";

import { useDogContext } from "@/context/DogContext";
import { getBoardKey } from "@/context/BaseListContext";

import { IdType, QueryParamsType } from "@/types";

const Dogs = () => {
  const [params, setParams] = useState<QueryParamsType>({ page: 1, limit: 10 });

  const {
    state: { map, boards },
    actions: { getAll },
  } = useDogContext();

  const { listMap, loading, metaData } = useMemo(() => {
    const boardKey = getBoardKey(params);
    const mBoard = boards[boardKey];

    if (!mBoard) {
      return {
        listMap: {},
        loading: true,
        metaData: {},
      };
    }

    return mBoard;
  }, [boards, params]);
  const list = listMap?.[params.page!] || [];

  const [selectedId, setSelectedId] = useState<IdType | null>(null);

  const columns: TableColumnsType<any> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        render: (image) => <Avatar src={image?.url} />,
      },
      { title: "Name", dataIndex: "name" },
      {
        title: "Breed Group",
        dataIndex: "breed_group",
        render: (text) => text || "-",
      },
      { title: "Life Span", dataIndex: "life_span" },
      {
        title: "Actions",
        dataIndex: "actions",
        render(_, record) {
          return <EyeOutlined onClick={() => setSelectedId(record?.id)} />;
        },
      },
    ],
    [setSelectedId]
  );

  useEffect(() => {
    const params = { page: 1, limit: 10 };
    setParams(params);
    getAll(params);
  }, []);

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    const newParams = { ...params, page: current, limit: pageSize };
    setParams(newParams);
    getAll(newParams);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={list.map((id: IdType) => ({ ...map[id], key: id }))}
        onChange={onChange}
        pagination={{
          total: metaData?.totalItems ?? 0,
          pageSize: params.limit,
          pageSizeOptions: [5, 10, 15],
        }}
        loading={loading}
      />

      <DogDetailsDrawer
        selectedDogId={selectedId}
        onClose={() => setSelectedId(null)}
        open={selectedId !== null}
      />
    </div>
  );
};

export default Dogs;
