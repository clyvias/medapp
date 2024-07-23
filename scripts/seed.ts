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
        question: "¿Qué es la ley de continuidad en hidrodinámica?",
        answer:
          "La ley de continuidad establece que el caudal de ingreso es igual al caudal de salida en un tubo rígido sin fugas ni entradas adicionales.",
      },
      {
        lessonId: 1,
        question:
          "¿Qué relación existe entre la velocidad del fluido y el área de sección transversal según la ley de continuidad?",
        answer:
          "Son inversamente proporcionales. Donde el área es menor, el fluido transita a mayor velocidad, y viceversa.",
      },
      {
        lessonId: 1,
        question: "¿Qué establece el teorema de Bernoulli?",
        answer:
          "El teorema de Bernoulli explica la presión como una forma de energía y establece que la energía total de un fluido ideal en un tubo rígido es constante.",
      },
      {
        lessonId: 1,
        question:
          "Cuáles son los componentes de la presión total según Bernoulli?",
        answer:
          "La presión total es la suma de la presión lateral, la presión cinética y la presión potencial gravitatoria.",
      },
      {
        lessonId: 1,
        question:
          "Qué es un aneurisma y cuáles son sus posibles consecuencias?",
        answer:
          "Un aneurisma es una dilatación localizada y permanente en las paredes de las arterias. Puede llevar a la ruptura del vaso y hemorragia, o a la formación de trombos debido a la estasis sanguínea.",
      },
      {
        lessonId: 1,
        question:
          "¿Cuál es la diferencia principal entre el flujo laminar y el turbulento?",
        answer:
          "El flujo laminar es ordenado y silencioso, mientras que el flujo turbulento es desordenado y audible (produce murmullos).",
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
