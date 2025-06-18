import { string2render } from "@/libs/stringRender";
import {
  Button,
  cn,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";
import { useFormatter, useTranslations } from "next-intl";

export const NoticeContent = ({
  content,
}: {
  content: NoticeData | PopMessageData;
}) => {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>{content.title}</ModalHeader>
          <ModalBody>
            <ScrollShadow>
              {/* {slides[index].content} */}
              {string2render(content.content)}
            </ScrollShadow>
          </ModalBody>
          <ModalFooter className="text-sm text-foreground flex justify-between items-center">
            {t("createAt", {
              date: format.dateTime(content.updated_at * 1000, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }),
            })}
            <Button
              size="sm"
              color="primary"
              onPress={onClose}
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("noticeConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
