import Image from "next/image";
import DOMPurify from "dompurify";

type Props = {
  question: string;
};

export const QuestionBubble = ({ question }: Props) => {
  const sanitizedQuestion = DOMPurify.sanitize(question);

  return (
    <div className="flex items-center gap-x-4 mb-6">
      <Image
        src="/doctor-1.svg"
        alt="doc"
        height={60}
        width={60}
        className="hidden lg:block"
      />
      <Image
        src="/doctor-1.svg"
        alt="doc"
        height={40}
        width={40}
        className="block lg:hidden"
      />
      <div className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base">
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedQuestion }}
          className="question-content"
        />
        <div className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90" />
      </div>
    </div>
  );
};
