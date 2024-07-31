import React from "react";
import { ImageInput, ImageInputProps } from "react-admin";

type CustomImageInputProps = Omit<ImageInputProps, "accept"> & {
  accept?: string;
};

const CustomImageInput: React.FC<CustomImageInputProps> = ({
  accept,
  ...props
}) => {
  return <ImageInput accept={accept as any} {...props} />;
};

export default CustomImageInput;
