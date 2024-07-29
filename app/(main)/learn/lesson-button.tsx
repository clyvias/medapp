"use client";

import Link from "next/link";
import { Check, Clock, Brain } from "lucide-react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  current: boolean;
  progress: number;
  started: boolean;
  completed: boolean;
  isReviewNeeded: boolean;
  nextReviewAt: Date | null;
  hasReviewDate: boolean;
  lessonName: string;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  current,
  progress,
  started,
  completed,
  isReviewNeeded,
  nextReviewAt,
  hasReviewDate,
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
    if (isReviewNeeded || hasReviewDate) return <Clock className="h-10 w-10" />;
    if (!started) return <Brain className="h-10 w-10" />;
    return <Check className="h-10 w-10" />;
  };

  const getReviewText = () => {
    if (!started) return "No iniciado";
    if (isReviewNeeded) return "Repasar ahora";
    if (hasReviewDate && nextReviewAt) {
      const now = new Date();
      const diffTime = nextReviewAt.getTime() - now.getTime();
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));

      if (diffMinutes < 60) return `Repaso en ${diffMinutes}m`;

      const diffHours = Math.ceil(diffTime / (1000 * 3600));
      if (diffHours < 24) return `Repaso en ${diffHours}h`;

      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      return `Repaso en ${diffDays}d`;
    }
    if (completed) return "Completed";
    return "In progress";
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
            value={progress}
            strokeWidth={8}
            styles={buildStyles({
              strokeLinecap: "round",
              pathColor: started ? "#4ade80" : "#e5e7eb",
              trailColor: "#e5e7eb",
              rotation: 0.15,
              pathTransitionDuration: 0.5,
            })}
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
          <p className="text-xs text-muted-foreground">{getReviewText()}</p>
        </div>
      </div>
    </Link>
  );
};
