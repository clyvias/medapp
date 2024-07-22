"use client";

import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  current: boolean;
  percentage: number;
  completed: boolean;
  nextReviewAt: Date | null;
  lessonName: string;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  current,
  percentage,
  completed,
  nextReviewAt,
  lessonName,
}: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;

  const Icon = completed ? Check : Clock;

  const getReviewText = () => {
    if (!nextReviewAt) return "Not started";
    const now = new Date();
    const diffHours = Math.round(
      (nextReviewAt.getTime() - now.getTime()) / (1000 * 60 * 60)
    );
    if (diffHours <= 0) return "Review now";
    if (diffHours < 24) return `Review in ${diffHours}h`;
    const diffDays = Math.round(diffHours / 24);
    return `Review in ${diffDays}d`;
  };

  return (
    <Link href={`/lesson/${id}`}>
      <div
        className="relative flex flex-col items-center"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !completed ? 60 : 24,
        }}
      >
        <div className="relative h-[102px] w-[102px]">
          <CircularProgressbarWithChildren
            value={percentage}
            styles={{
              path: {
                stroke: "#4ade80",
              },
              trail: {
                stroke: "#e5e7eb",
              },
            }}
          >
            <Button
              size="rounded"
              variant={current ? "secondary" : "default"} // Changed from "outline" to "default"
              className="h-[70px] w-[70px] border-b-8"
            >
              <Icon
                className={cn("h-10 w-10", completed && "text-green-500")}
              />
            </Button>
          </CircularProgressbarWithChildren>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold text-neutral-700">{lessonName}</p>
          <p className="text-xs text-muted-foreground">{getReviewText()}</p>
        </div>
      </div>
    </Link>
  );
};
