import { Edit, SimpleForm, required, TextInput } from "react-admin";

export const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" validate={[required()]} label="Id" />
        <TextInput source="title" validate={[required()]} label="Materia" />
        <TextInput source="imageSrc" validate={[required()]} label="Imagen" />
      </SimpleForm>
    </Edit>
  );
};
