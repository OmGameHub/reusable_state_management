import React, { useEffect } from "react";
import { Avatar, Drawer, DrawerProps, Row, Tag } from "antd";

import { useDogContext } from "@/context/DogContext";

import { IdType } from "@/types";

interface DogDetailsDrawer extends DrawerProps {
  selectedDogId: IdType | null;
}

const DogDetailsDrawer: React.FC<DogDetailsDrawer> = ({
  selectedDogId,
  ...props
}) => {
  const {
    state: { map },
    actions: { getOne },
  } = useDogContext();
  const selectedDogDetails = map[selectedDogId ?? ""];

  useEffect(() => {
    if (selectedDogId) {
      getOne(selectedDogId);
    }
  }, [selectedDogId]);

  return (
    <Drawer {...props} title="Dog Details">
      <Row className="mb-4" justify={"center"}>
        <Avatar
          size={180}
          src={selectedDogDetails?.image?.url}
          shape="square"
          alt={selectedDogDetails?.name}
        />
      </Row>

      {[
        { label: "Name", value: selectedDogDetails?.name },
        { label: "Breed Group", value: selectedDogDetails?.breed_group },
        { label: "Life Span", value: selectedDogDetails?.life_span },
        {
          label: "Temperament",
          value: selectedDogDetails?.temperament
            ? selectedDogDetails?.temperament
                ?.split(", ")
                ?.map((temperament: string) => (
                  <Tag key={temperament} className="capitalize m-1">
                    {temperament}
                  </Tag>
                ))
            : "-",
        },
        {
          label: "Bred For",
          value: selectedDogDetails?.bred_for
            ? selectedDogDetails?.bred_for?.split(", ")?.map((bred: string) => (
                <Tag key={bred} className="capitalize">
                  {bred}
                </Tag>
              ))
            : "-",
        },
        {
          label: "Origin",
          value: selectedDogDetails?.origin
            ? selectedDogDetails?.origin?.split(", ")?.map((origin: string) => (
                <Tag key={origin} className="capitalize">
                  {origin}
                </Tag>
              ))
            : "-",
        },
        { label: "Height", value: selectedDogDetails?.height?.imperial },
        { label: "Weight", value: selectedDogDetails?.weight?.imperial },
      ].map(({ label, value }) => (
        <Row key={label} className="mb-2">
          <h3>
            <span className="font-semibold">{label}:</span> {value || "-"}
          </h3>
        </Row>
      ))}
    </Drawer>
  );
};

export default DogDetailsDrawer;
