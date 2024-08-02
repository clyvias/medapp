import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceManyField,
  Datagrid,
  CreateButton,
  EditButton,
  ShowButton,
  DeleteButton,
  TopToolbar,
  useRecordContext,
  ShowProps,
} from "react-admin";

interface Unit {
  id: number;
  title: string;
  description: string;
  order: number;
}

const UnitTitle = () => {
  const record = useRecordContext<Unit>();
  return <span>Unit {record ? `"${record.title}"` : ""}</span>;
};

const UnitShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

const LessonCreateButton = () => {
  const record = useRecordContext<Unit>();
  if (!record) return null;
  return (
    <CreateButton
      label="Create Lesson"
      to={{
        pathname: "/lessons/create",
        search: `?unit_id=${record.id}`,
      }}
    />
  );
};

export const UnitShow: React.FC<ShowProps> = (props) => (
  <Show {...props} actions={<UnitShowActions />} title={<UnitTitle />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="order" />
      <LessonCreateButton />
      <ReferenceManyField
        reference="lessons"
        target="unitId"
        label="Lessons"
        sort={{ field: "order", order: "ASC" }}
      >
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="order" />
          <EditButton />
          <ShowButton label="View Flashcards" />
          <DeleteButton />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
