import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import {
  Button,
  cn,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

export const TicketContent = ({
  mutate,
  onClose,
}: {
  mutate: () => Promise<void>;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketContent, setTicketContent] = useState("");

  const [isSubmit, startSubmit] = useTransition();
  const onOpenTicket = () => {
    startSubmit(async () => {
      try {
        await fetch.post(`user/ticket/save`, {
          subject: ticketTitle,
          level: 0,
          message: ticketContent,
        });
        await mutate();
        onClose();
      } catch (e) {
        errorHandle(e);
      }
    });
  };
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex items-center gap-2">
            {t("ticketOpen")}
          </ModalHeader>
          <ModalBody>
            <Input
              radius="lg"
              label={t("ticketTitle")}
              placeholder={t("ticketTitlePlaceholder")}
              variant="bordered"
              classNames={{
                label: "group-data-[filled-within=true]:text-default-900",
                input: "placeholder:text-foreground-700",
                inputWrapper:
                  "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
                helperWrapper: "h-4",
              }}
              value={ticketTitle}
              onValueChange={setTicketTitle}
            />
            <Textarea
              radius="lg"
              label={t("ticketContent")}
              placeholder={t("ticketContentPlaceholder")}
              variant="bordered"
              classNames={{
                label: "group-data-[filled-within=true]:text-default-900",
                input: "resize-y placeholder:text-foreground-700",
                inputWrapper:
                  "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
                helperWrapper: "h-4",
              }}
              value={ticketContent}
              onValueChange={setTicketContent}
              disableAutosize
            />
          </ModalBody>
          <ModalFooter>
            <Button
              radius="lg"
              onPress={onClose}
              isDisabled={isSubmit}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("ticketCancel")}
            </Button>
            <Button
              radius="lg"
              onPress={onOpenTicket}
              isLoading={isSubmit}
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isSubmit && t("ticketConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
