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
  Button,
  useRecordContext,
} from "react-admin";
import { useLocation, Link } from "react-router-dom";

interface Lesson {
  id: number;
  title: string;
  order: number;
}

const LessonFilters = [<FilterLiveSearch source="title" key="title" />];

const ListActions = () => {
  const location = useLocation();
  const unitId = new URLSearchParams(location.search).get("unit_id");
  return (
    <TopToolbar>
      {unitId && <CreateButton to={`/lessons/create?unit_id=${unitId}`} />}
    </TopToolbar>
  );
};

const ViewFlashcardsButton = () => {
  const record = useRecordContext<Lesson>();
  if (!record) return null;

  return (
    <Button
      component={Link}
      to={`/flashcards?filter=${JSON.stringify({ lessonId: record.id })}`}
      label="View Flashcards"
    />
  );
};

export const LessonList = () => {
  const location = useLocation();
  const unitId = new URLSearchParams(location.search).get("unit_id");

  return (
    <List
      actions={<ListActions />}
      filters={LessonFilters}
      filter={{ unitId: unitId }}
    >
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="order" />
        <EditButton />
        <ViewFlashcardsButton />
      </Datagrid>
    </List>
  );
};
