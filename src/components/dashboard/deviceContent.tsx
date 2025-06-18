import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { toast } from "@/libs/toastHandler";
import {
  Button,
  cn,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export const DeviceContent = ({
  onClose,
  session,
  mutate,
}: {
  onClose: () => void;
  session: ActiveSessionData;
  mutate: () => Promise<void>;
}) => {
  const t = useTranslations();
  const [isDeleting, startDelete] = useTransition();
  const onSessionDelete = () => {
    startDelete(async () => {
      try {
        await fetch.post("user/removeActiveSession", {
          session_id: session.key,
        });
        toast.success("删除成功");
        await mutate();
      } catch (e) {
        errorHandle(e);
      } finally {
        onClose();
      }
    });
  };

  return (
    <ModalContent>
      {() => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            {t("profileDeviceTitle")}
          </ModalHeader>
          <ModalFooter>
            <Button
              radius="lg"
              onPress={onClose}
              isDisabled={isDeleting}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("profileDeviceCancel")}
            </Button>
            <Button
              radius="lg"
              color="primary"
              onPress={onSessionDelete}
              isLoading={isDeleting}
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isDeleting && t("profileDeviceConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
