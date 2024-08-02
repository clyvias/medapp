"use client";

import React from "react";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

import { CourseList } from "./courses/list";
import { CourseEdit } from "./courses/edit";
import { CourseCreate } from "./courses/create";
import { CourseShow } from "./courses/show";

import { UnitList } from "./unit/list";
import { UnitEdit } from "./unit/edit";
import { UnitCreate } from "./unit/create";

import { LessonList } from "./lesson/list";
import { LessonEdit } from "./lesson/edit";
import { LessonCreate } from "./lesson/create";

import { FlashcardList } from "./flashcard/list";
import { FlashcardEdit } from "./flashcard/edit";
import { FlashcardCreate } from "./flashcard/create";
import { LessonShow } from "./lesson/show";
import { UnitShow } from "./unit/show";

const dataProvider = simpleRestProvider("/api");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="courses"
      list={CourseList}
      show={CourseShow}
      edit={CourseEdit}
      create={CourseCreate}
    />
    <Resource
      name="units"
      show={UnitShow}
      edit={UnitEdit}
      create={UnitCreate}
    />
    <Resource
      name="lessons"
      show={LessonShow}
      edit={LessonEdit}
      create={LessonCreate}
    />
    <Resource name="flashcards" edit={FlashcardEdit} create={FlashcardCreate} />
  </Admin>
);

export default App;
