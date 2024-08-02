import { Create, SimpleForm, required, TextInput } from "react-admin";

export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Materia" />
        <TextInput source="imageSrc" validate={[required()]} label="Imagen" />
      </SimpleForm>
    </Create>
  );
};
