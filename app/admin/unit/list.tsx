"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  CreateButton,
  TopToolbar,
  FilterLiveSearch,
} from "react-admin";
import { useLocation } from "react-router-dom";

const UnitFilters = [<FilterLiveSearch key="courseId" source="title" />];

const ListActions = () => {
  const location = useLocation();
  const courseId = new URLSearchParams(location.search).get("course_id");
  return (
    <TopToolbar>
      {courseId && <CreateButton to={`/units/create?course_id=${courseId}`} />}
    </TopToolbar>
  );
};

export const UnitList = () => {
  const location = useLocation();
  const courseId = new URLSearchParams(location.search).get("course_id");

  return (
    <List
      actions={<ListActions />}
      filters={UnitFilters}
      filter={{ courseId: courseId }}
    >
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <TextField source="order" />
        <EditButton />
      </Datagrid>
    </List>
  );
};
