import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";
import { Loader } from "../loader";
import { useEffect, useMemo } from "react";
import { useCopyToClipboard, useEventListener } from "usehooks-ts";
import { toast } from "@/libs/toastHandler";

const MarkdownIt = require("markdown-it");
const md = MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  listIndent: true,
});

export const KnowledgeContent = ({
  info,
}: {
  info: KnowledgeDetailData | null;
}) => {
  const [copiedText, copy] = useCopyToClipboard();

  const content = useMemo(() => {
    if (!info)
      return (
        <div className="w-full h-[100px] flex justify-center items-center">
          <Loader />
        </div>
      );
    return <div dangerouslySetInnerHTML={{ __html: md.render(info.body) }} />;
  }, [info]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://cdn.tailwindcss.com`;
    script.onload = () => {
      window.tailwind = {
        config: {
          darkMode: "class",
        },
      };
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEventListener("click", (event: MouseEvent) => {
    if (
      event.target &&
      (event.target as HTMLElement).getAttribute("data-copy")
    ) {
      event.preventDefault();
      const name = (event.target as HTMLElement).getAttribute("data-copy");
      copy(name ?? "");
      toast.success("复制成功");
    }
  });

  return (
    <ModalContent>
      {() => (
        <>
          <ModalHeader>{!!info && <p>{info?.title}</p>}</ModalHeader>
          <ModalBody>
            <ScrollShadow>{content}</ScrollShadow>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
};
