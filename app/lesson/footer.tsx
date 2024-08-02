import { useKey, useMedia } from "react-use";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({ onCheck, disabled, lessonId }: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer className="bg-white border-t-2 py-4">
      <div className="max-w-[1140px] mx-auto flex items-center justify-between px-6 lg:px-10">
        <Button
          disabled={disabled}
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant="secondary"
        >
          Continue
        </Button>
      </div>
    </footer>
  );
};
