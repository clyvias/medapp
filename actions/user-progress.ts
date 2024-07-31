"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, userProgress, challenges } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Sin permisión");
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error("Materia no encontrada");
  }

  // if (!course.units.length || !course.units[0].lessons.length) {
  //   throw new Error("Materia sin lecciones");
  // }

  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/medboost.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/medboost.svg",
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (
  flashcardId: number
): Promise<{ error?: string }> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const currentUserProgress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
    });

    if (!currentUserProgress) {
      return { error: "User progress not found" };
    }

    if (currentUserProgress.hearts === 0) {
      return { error: "hearts" };
    }

    await db
      .update(userProgress)
      .set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
      })
      .where(eq(userProgress.userId, userId));

    return {};
  } catch (error) {
    console.error("Error reducing hearts:", error);
    return { error: "Failed to reduce hearts" };
  }
};
