import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
  const imageSrc = variant === "hearts" ? "/heart.svg" : "/points.svg";
  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full",
        variant === "points" && "border-orange-400 bg-orange-400",
        variant === "hearts" && "border-rose-500 bg-rose-500"
      )}
    >
      <div
        className={cn(
          "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
          variant === "points" && "bg-orange-400",
          variant === "hearts" && "bg-rose-500"
        )}
      >
        {variant === "hearts" ? "Corazones restantes" : "Total XP"}
      </div>
      <div
        className={cn(
          "rounded-2xl bg-white iems-center flex justify-center p-6 font-bold text-lg",
          variant === "hearts" && "text-rose-500",
          variant === "points" && "text-orange-400"
        )}
      >
        <Image
          alt="icon"
          src={imageSrc}
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value}
      </div>
    </div>
  );
};
