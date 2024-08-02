import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceManyField,
  Datagrid,
  CreateButton,
  EditButton,
  RichTextField,
  useRecordContext,
  DeleteButton,
  TopToolbar,
  ShowProps,
} from "react-admin";

interface Lesson {
  id: number;
  title: string;
  order: number;
}

const LessonTitle = () => {
  const record = useRecordContext<Lesson>();
  return <span>Lesson {record ? `"${record.title}"` : ""}</span>;
};

const LessonShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

const FlashcardCreateButton = () => {
  const record = useRecordContext<Lesson>();
  if (!record) return null;
  return (
    <CreateButton
      label="Create Flashcard"
      to={{
        pathname: "/flashcards/create",
        search: `?lesson_id=${record.id}`,
      }}
    />
  );
};

export const LessonShow: React.FC<ShowProps> = (props) => (
  <Show {...props} actions={<LessonShowActions />} title={<LessonTitle />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="order" />
      <FlashcardCreateButton />
      <ReferenceManyField
        reference="flashcards"
        target="lessonId"
        label="Flashcards"
        sort={{ field: "order", order: "ASC" }}
      >
        <Datagrid>
          <TextField source="id" />
          <RichTextField source="question" />
          <RichTextField source="answer" />
          <TextField source="order" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
