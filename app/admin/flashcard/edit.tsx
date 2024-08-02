import {
  Edit,
  SimpleForm,
  required,
  ReferenceInput,
  ImageField,
} from "react-admin";
import RichTextInput from "../../../components/RichTextInput";
import CustomImageInput from "../../../components/CustomImageInput";

export const FlashcardEdit = () => {
  return (
    <Edit>
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
        <ReferenceInput source="lessonId" reference="lessons" />
      </SimpleForm>
    </Edit>
  );
};
