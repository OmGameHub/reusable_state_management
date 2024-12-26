import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Tag,
  Tooltip,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";

import CatDetailsDrawer from "@/components/CatDetailsDrawer";

import { useCatContext } from "@/context/CatContext";
import { getBoardKey } from "@/context/BaseListContext";

import { IdType, QueryParamsType } from "@/types";

const Cats = () => {
  const [params, setParams] = useState<QueryParamsType>({ page: 1, limit: 5 });

  const {
    state: { map, boards, randomCatId, randomCatLoading },
    actions: { getAll, getOneRandomCat },
  } = useCatContext();

  const randomCatDetails = useMemo(
    () => randomCatId && map[randomCatId],
    [map, randomCatId]
  );

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
        render: (image) => <Avatar src={image} />,
      },
      { title: "Name", dataIndex: "name" },
      {
        title: "Temperament",
        dataIndex: "temperament",
        render: (temperament) =>
          temperament
            ? temperament.split(", ").map((temperament: string) => (
                <Tag key={temperament} className="capitalize m-1">
                  {temperament}
                </Tag>
              ))
            : "-",
      },
      { title: "Life Span", dataIndex: "life_span" },
      {
        title: "Actions",
        dataIndex: "actions",
        render(_, record) {
          return (
            <Tooltip title="View Details">
              <EyeOutlined onClick={() => setSelectedId(record?.id)} />
            </Tooltip>
          );
        },
      },
    ],
    [setSelectedId]
  );

  useEffect(() => {
    const params = { page: 1, limit: 5 };
    setParams(params);
    getAll(params);

    if (!randomCatId) {
      getOneRandomCat();
    }
  }, []);

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    const newParams = {
      ...params,
      page: params.limit !== pageSize ? 1 : current,
      limit: pageSize,
    };
    setParams(newParams);
    getAll(newParams);
  };

  return (
    <div>
      {randomCatDetails && (
        <Card
          title="Random Cat"
          className="mb-4"
          extra={
            <Tooltip title="Find Another Random Cat">
              <ReloadOutlined onClick={() => getOneRandomCat()} />
            </Tooltip>
          }
          loading={randomCatLoading}
        >
          <Row gutter={16}>
            <Col>
              <Avatar
                size={120}
                src={randomCatDetails.image}
                shape="square"
                alt={randomCatDetails.name}
              />
            </Col>

            <Col>
              {[
                { label: "Name", value: randomCatDetails?.name },
                {
                  label: "Temperament",
                  value: randomCatDetails?.temperament
                    ? randomCatDetails?.temperament
                        .split(", ")
                        .map((temperament: string) => (
                          <Tag key={temperament} className="capitalize">
                            {temperament}
                          </Tag>
                        ))
                    : "-",
                },
                {
                  label: "Life Span",
                  value: randomCatDetails?.life_span || "-",
                },
              ].map(({ label, value }) => (
                <Row key={label} className="mb-1">
                  <span className="font-semibold mr-1">{label}:</span>
                  <span>{value || "-"}</span>
                </Row>
              ))}

              <Row>
                <Button
                  className="px-0"
                  type="link"
                  size="small"
                  onClick={() => setSelectedId(randomCatId)}
                >
                  <EyeOutlined />
                  View Details
                </Button>
              </Row>
            </Col>
          </Row>
        </Card>
      )}

      <Table
        columns={columns}
        dataSource={list.map((id: IdType) => ({ ...map[id], key: id }))}
        onChange={onChange}
        pagination={{
          current: params.page,
          total: metaData?.totalItems ?? 0,
          pageSize: params.limit,
          pageSizeOptions: [5, 10, 15],
        }}
        loading={loading}
      />

      <CatDetailsDrawer
        selectedCatId={selectedId}
        onClose={() => setSelectedId(null)}
        open={selectedId !== null}
      />
    </div>
  );
};

export default Cats;
