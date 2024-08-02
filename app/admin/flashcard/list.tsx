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
  RichTextField,
} from "react-admin";
import { useLocation } from "react-router-dom";

const FlashcardFilters = [
  <FilterLiveSearch source="question" key="question-filter" />,
];

const ListActions = () => {
  const location = useLocation();
  const lessonId = new URLSearchParams(location.search).get("lesson_id");
  return (
    <TopToolbar>
      {lessonId && (
        <CreateButton
          key="create-button"
          to={`/flashcards/create?lesson_id=${lessonId}`}
        />
      )}
    </TopToolbar>
  );
};

export const FlashcardList = () => {
  const location = useLocation();
  const lessonId = new URLSearchParams(location.search).get("lesson_id");

  return (
    <List
      actions={<ListActions />}
      filters={FlashcardFilters}
      filter={{ lessonId: lessonId }}
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <RichTextField source="question" />
        <RichTextField source="answer" />
        <TextField source="order" />
        <EditButton />
      </Datagrid>
    </List>
  );
};
