import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { toast } from "@/libs/toastHandler";
import {
  Button,
  cn,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export const ResetContent = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations();
  const [isResetting, startReset] = useTransition();
  const onReset = () => {
    startReset(async () => {
      try {
        await fetch.get("user/resetSecurity");
        toast.success(t("profileResetToast"));
      } catch (e) {
        errorHandle(e);
      } finally {
        onClose();
      }
    });
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            {t("profileResetTitle")}
          </ModalHeader>
          <ModalBody className="text-default-500">
            {t("profileResetContent")}
          </ModalBody>
          <ModalFooter>
            <Button
              radius="lg"
              isDisabled={isResetting}
              onPress={onClose}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("profileResetCancel")}
            </Button>
            <Button
              radius="lg"
              isLoading={isResetting}
              onPress={onReset}
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isResetting && t("profileResetConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
