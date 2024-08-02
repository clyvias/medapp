"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  ShowButton,
} from "react-admin";

export const CourseList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" />
      <ImageField source="imageSrc" />
      <EditButton />
      <ShowButton label="View Units" />
    </Datagrid>
  </List>
);
