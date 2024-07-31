import React from "react";
import {
  Create,
  SimpleForm,
  required,
  TextInput,
  CreateProps,
  useCreate,
  useNotify,
  useRedirect,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { useLocation } from "react-router-dom";
import RichTextInput from "../../../components/RichTextInput";

export const FlashcardCreate: React.FC<CreateProps> = (props) => {
  const [create] = useCreate();
  const notify = useNotify();
  const redirect = useRedirect();
  const location = useLocation();

  const lessonId = new URLSearchParams(location.search).get("lesson_id");

  const onSubmit = async (values: any) => {
    try {
      await create("flashcards", {
        data: {
          ...values,
          lessonId: lessonId ? parseInt(lessonId) : undefined,
        },
      });
      notify("Flashcard created successfully", { type: "success" });
      redirect(`/lessons/${lessonId}/show`);
    } catch (error) {
      notify("Error creating flashcard", { type: "error" });
      console.error(error);
    }
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={onSubmit}>
        <RichTextInput
          source="question"
          validate={[required()]}
          label="Pregunta"
        />
        <RichTextInput
          source="answer"
          validate={[required()]}
          label="Respuesta"
        />
        <TextInput source="questionImageUrl" />
        <TextInput source="answerImageUrl" />
        <ReferenceInput
          source="lessonId"
          reference="lessons"
          defaultValue={lessonId}
        >
          <SelectInput optionText="title" disabled />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
