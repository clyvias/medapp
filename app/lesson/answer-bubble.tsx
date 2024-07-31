import DOMPurify from "dompurify";

type Props = {
  answer: string;
};

export const AnswerBubble = ({ answer }: Props) => {
  const sanitizedAnswer = DOMPurify.sanitize(answer);

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
      <div
        className="text-xl font-semibold text-neutral-700 whitespace-pre-wrap answer-content"
        dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
      />
    </div>
  );
};
