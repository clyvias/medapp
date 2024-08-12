import React from "react";
import {
  Edit,
  SimpleForm,
  required,
  ReferenceInput,
  ImageField,
  NumberInput,
  useRedirect,
  useNotify,
  useGetOne,
  Loading,
  TextInput,
  useGetRecordId,
} from "react-admin";
import RichTextInput from "../../../components/RichTextInput";
import CustomImageInput from "../../../components/CustomImageInput";

const FlashcardEdit = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  const recordId = useGetRecordId();

  const {
    data: flashcard,
    isLoading,
    error,
  } = useGetOne("flashcards", { id: recordId });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!flashcard) return <div>No flashcard found</div>;

  const onSuccess = (data: any) => {
    notify("Flashcard updated successfully");
    // Use the lessonId from the original flashcard data
    const lessonId = flashcard.lessonId;
    console.log("Redirecting to lesson:", lessonId);
    if (lessonId) {
      redirect(`/lessons/${lessonId}/show`);
    } else {
      console.error("LessonId not found");
      // Fallback redirect if lessonId is not available
      redirect("/lessons");
    }
  };

  return (
    <Edit mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <RichTextInput
          source="question"
          validate={[required()]}
          label="Pregunta"
        />
        <CustomImageInput
          source="questionImageUrl"
          label="Imagen de la pregunta"
          accept="image/*"
        >
          <ImageField source="src" title="title" />
        </CustomImageInput>
        <RichTextInput
          source="answer"
          validate={[required()]}
          label="Respuesta"
        />
        <CustomImageInput
          source="answerImageUrl"
          label="Imagen de la respuesta"
          accept="image/*"
        >
          <ImageField source="src" title="title" />
        </CustomImageInput>
        <ReferenceInput source="lessonId" reference="lessons">
          <TextInput source="lessonId" disabled />
        </ReferenceInput>
        <NumberInput source="order" disabled />
      </SimpleForm>
    </Edit>
  );
};

export default FlashcardEdit;
