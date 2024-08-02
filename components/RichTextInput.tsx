import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useInput, InputProps } from "react-admin";

const RichTextInput = (props: InputProps) => {
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
  } = useInput(props);

  return (
    <div>
      <ReactQuill
        {...field}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        }}
      />
      {isSubmitted && invalid && <span>{error?.message}</span>}
    </div>
  );
};

export default RichTextInput;
