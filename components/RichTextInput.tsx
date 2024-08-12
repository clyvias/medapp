import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useInput, InputProps } from "react-admin";

const RichTextInput = (props: InputProps) => {
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
  } = useInput(props);

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current && field.value) {
      quillRef.current.getEditor().root.innerHTML = field.value;
    }
  }, [field.value]);

  const handleChange = (content: string) => {
    field.onChange(content);
  };

  const modules = {
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
      [{ color: [] }, { background: [] }], // Added color and background color options
      ["clean"],
    ],
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={handleChange}
        modules={modules}
      />
      {isSubmitted && invalid && <span>{error?.message}</span>}
    </div>
  );
};

export default RichTextInput;
