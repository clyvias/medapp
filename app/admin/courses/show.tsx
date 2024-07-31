"use client";

import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ImageField,
  ReferenceManyField,
  Datagrid,
  CreateButton,
  EditButton,
  ShowButton,
  useRecordContext,
} from "react-admin";

interface Course {
  id: number;
  title: string;
  imageSrc: string;
}

const UnitCreateButton = () => {
  const record = useRecordContext<Course>();
  if (!record) return null;
  return (
    <CreateButton
      label="Create Unit"
      to={{
        pathname: "/units/create",
        search: `?course_id=${record.id}`,
      }}
    />
  );
};

export const CourseShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <ImageField source="imageSrc" />
      <UnitCreateButton />
      <ReferenceManyField
        reference="units"
        target="courseId"
        label="Units"
        sort={{ field: "order", order: "ASC" }}
      >
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="description" />
          <TextField source="order" />
          <EditButton />
          <ShowButton label="View Lessons" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
