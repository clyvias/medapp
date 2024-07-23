"use client";

import Link from "next/link";
import { Check, Crown, Brain } from "lucide-react";
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
  started: boolean;
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
  started,
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

  const getIcon = () => {
    if (completed) return <Check className="h-10 w-10" />;
    if (started) return <Crown className="h-10 w-10" />;
    return <Brain className="h-10 w-10 text-gray-400" />;
  };

  const getReviewText = () => {
    if (!started) return "Not started";
    if (!nextReviewAt) return "Review now";

    const now = new Date();
    const diffMs = nextReviewAt.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (diffMinutes <= 0) return "Review now";
    if (diffMinutes < 60) return `Review in ${diffMinutes}m`;

    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
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
            value={completed ? 100 : started ? percentage : 0}
            styles={{
              path: {
                stroke: completed ? "#22c55e" : started ? "#4ade80" : "#e5e7eb",
              },
              trail: {
                stroke: "#e5e7eb",
              },
            }}
          >
            <Button
              size="rounded"
              variant={current ? "secondary" : "default"}
              className="h-[70px] w-[70px] border-b-8"
            >
              {getIcon()}
            </Button>
          </CircularProgressbarWithChildren>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold text-neutral-700">{lessonName}</p>
          <p className="text-xs text-muted-foreground">
            {completed ? "Completed - " : ""}
            {getReviewText()}
          </p>
        </div>
      </div>
    </Link>
  );
};
