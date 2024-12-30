import React from "react";
import { Link } from "react-router";
import { Avatar, Drawer, DrawerProps, Row, Spin, Tag } from "antd";

import { useGetCat } from "@/hooks/catHooks";

import { IdType } from "@/types";

interface CatDetailsDrawer extends DrawerProps {
  selectedCatId: IdType | null;
}

const CatDetailsDrawer: React.FC<CatDetailsDrawer> = ({
  selectedCatId,
  ...props
}) => {
  const { data: selectedCatDetails, isLoading } = useGetCat(selectedCatId);

  if (!selectedCatDetails && isLoading) {
    return (
      <Drawer {...props} title="Dog Details">
        <Row className="mb-4" justify={"center"}>
          <Spin size="large" />
        </Row>
      </Drawer>
    );
  }

  return (
    <Drawer {...props} width={500} title="Dog Details">
      <Row className="mb-4" justify={"center"}>
        <Avatar
          size={180}
          src={selectedCatDetails?.image}
          shape="square"
          alt={selectedCatDetails?.name}
        />
      </Row>

      {[
        { label: "Name", value: selectedCatDetails?.name },
        {
          label: "Weight",
          value: `${selectedCatDetails?.weight?.imperial} lbs`,
        },
        {
          label: "Temperament",
          value: selectedCatDetails?.temperament
            ? selectedCatDetails?.temperament
                .split(", ")
                .map((temperament: string) => (
                  <Tag key={temperament} className="capitalize m-1">
                    {temperament}
                  </Tag>
                ))
            : "-",
        },
        { label: "Life Span", value: selectedCatDetails?.life_span },
        { label: "Origin", value: selectedCatDetails?.origin },
        {
          label: "Description",
          value: selectedCatDetails?.description || "-",
        },
        {
          label: "Wikipedia",
          value: selectedCatDetails?.wikipedia_url ? (
            <Link
              className="text-blue-500"
              to={selectedCatDetails?.wikipedia_url}
              target="_blank"
              rel="noreferrer"
            >
              {selectedCatDetails?.wikipedia_url}
            </Link>
          ) : (
            "-"
          ),
        },
        {
          label: "CFA",
          value: selectedCatDetails?.cfa_url ? (
            <Link
              className="text-blue-500"
              to={selectedCatDetails?.cfa_url}
              target="_blank"
              rel="noreferrer"
            >
              {selectedCatDetails?.cfa_url}
            </Link>
          ) : (
            "-"
          ),
        },
        {
          label: "Vetstreet",
          value: selectedCatDetails?.vetstreet_url ? (
            <Link
              className="text-blue-500"
              to={selectedCatDetails?.vetstreet_url}
              target="_blank"
              rel="noreferrer"
            >
              {selectedCatDetails?.vetstreet_url}
            </Link>
          ) : (
            "-"
          ),
        },
        {
          label: "VCA Hospitals",
          value: selectedCatDetails?.vcahospitals_url ? (
            <Link
              className="text-blue-500"
              to={selectedCatDetails?.vcahospitals_url}
              target="_blank"
              rel="noreferrer"
            >
              {selectedCatDetails?.vcahospitals_url}
            </Link>
          ) : (
            "-"
          ),
        },
      ].map(({ label, value }) => (
        <Row key={label} className="mb-2">
          <span className="font-semibold">{label}:</span> {value || "-"}
        </Row>
      ))}
    </Drawer>
  );
};

export default CatDetailsDrawer;
