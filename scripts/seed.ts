import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("seeding the database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Fisiologia",
        imageSrc: "/fisiologia.svg",
      },
      {
        id: 2,
        title: "Anatomia",
        imageSrc: "/anatomia.svg",
      },
      {
        id: 3,
        title: "Embriologia",
        imageSrc: "/embriologia.svg",
      },
      {
        id: 4,
        title: "Bioquimica",
        imageSrc: "/bioquimica.svg",
      },
      {
        id: 5,
        title: "Histologia",
        imageSrc: "/histologia.svg",
      },
      {
        id: 6,
        title: "Inmunologia",
        imageSrc: "/Inmunologia.svg",
      },
      {
        id: 7,
        title: "Microbiologia",
        imageSrc: "/microbiologia.svg",
      },
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: "Sistema Cardiovascular",
        description:
          "En esta unidad se estudiarán los principios de la biofísica de la circulación y la fisiología del sistema cardiovascular.",
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "Biofísica de la circulación",
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: "Potencial de Acción",
      },
      {
        id: 3,
        unitId: 1,
        order: 3,
        title: "Electrocardiograma",
      },
      {
        id: 4,
        unitId: 1,
        order: 4,
        title: "Ciclo Cardiaco",
      },
      {
        id: 5,
        unitId: 1,
        order: 5,
        title: "Regulación de la Presión Arterial",
      },
    ]);

    await db.insert(schema.flashcards).values([
      {
        lessonId: 1,
        question: "What is the main function of the cardiovascular system?",
        answer:
          "To transport blood, oxygen, and nutrients throughout the body.",
      },
      {
        lessonId: 1,
        question:
          "What are the three main components of the cardiovascular system?",
        answer: "Heart, blood vessels, and blood.",
      },
      // ... (more flashcards)
    ]);

    console.log("Seeding finished");
  } catch (error) {
    console.log(error);
    throw new Error("failed to seed the database");
  }
};

main();
