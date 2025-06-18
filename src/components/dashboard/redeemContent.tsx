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
import { Dispatch, SetStateAction, useTransition } from "react";

export const RedeemContent = ({
  onClose,
  redeem,
  setRedeem,
}: {
  onClose: () => void;
  redeem: string;
  setRedeem: Dispatch<SetStateAction<string>>;
}) => {
  const t = useTranslations();
  const [isRedeem, startRedeem] = useTransition();
  const handleRedeem = () => {
    startRedeem(async () => {
      try {
        if (!redeem) throw Error(t("profileRedeemEmpty"));
        await fetch.post("user/redeemPlan", {
          redeem_code: redeem,
        });
        toast.success(t("profileRedeemSuccess"));
        setRedeem("");
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
          <ModalHeader className="flex flex-col gap-1">
            {t("profileRedeemTitle")}
          </ModalHeader>
          <ModalBody className="text-default-500">
            {t("profileRedeemContent")}
          </ModalBody>
          <ModalFooter>
            <Button
              radius="lg"
              isDisabled={isRedeem}
              onPress={onClose}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("profileRedeemCancel")}
            </Button>
            <Button
              radius="lg"
              isLoading={isRedeem}
              onPress={handleRedeem}
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isRedeem && t("profileRedeemConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
