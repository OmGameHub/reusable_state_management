import { useMemo, useState } from "react";
import { Avatar, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import DogDetailsDrawer from "@/components/DogDetailsDrawer";

import { useGetAllDogs } from "@/hooks/dogHooks";

import { IdType, QueryParamsType } from "@/types";

const Dogs = () => {
  const [params, setParams] = useState<QueryParamsType>({ page: 1, limit: 10 });

  const { data: resData, isFetching } = useGetAllDogs(params);
  const { data = [], ...metaData } = resData ?? { data: [] };

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

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    const newParams = { ...params, page: current, limit: pageSize };
    setParams(newParams);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        onChange={onChange}
        pagination={{
          total: metaData?.totalItems ?? 0,
          pageSize: params.limit,
          pageSizeOptions: [5, 10, 15],
        }}
        loading={isFetching}
      />

      {selectedId !== null && (
        <DogDetailsDrawer
          selectedDogId={selectedId}
          onClose={() => setSelectedId(null)}
          open={selectedId !== null}
        />
      )}
    </div>
  );
};

export default Dogs;
