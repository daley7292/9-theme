import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { toast } from "@/libs/toastHandler";
import {
  Button,
  cn,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

export const TransferContent = ({
  balance,
  onClose,
  mutate,
}: {
  balance: number;
  onClose: () => void;
  mutate: () => Promise<void>;
}) => {
  const t = useTranslations();

  const [transfer, setTransfer] = useState("");
  const [isTransferring, startTransfer] = useTransition();
  const onTransfer = () => {
    startTransfer(async () => {
      try {
        const transfer_amount = parseInt(transfer) * 100;
        if (transfer_amount <= 0 || isNaN(transfer_amount))
          throw Error(t("inviteTransferError"));

        await fetch.post("/user/transfer", {
          transfer_amount,
        });
        await mutate();
        toast.success(t("inviteTransferSuccess"));
      } catch (e) {
        errorHandle(e);
      } finally {
        setTransfer("");
        onClose();
      }
    });
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            {t("inviteTransferTitle")}
          </ModalHeader>
          <ModalBody>
            <div className="rounded-lg bg-warning-50 p-4">
              <div className="flex items-center">
                <div className="shrink-0">
                  <Icon
                    icon="ri:alert-line"
                    className="h-6 w-6 text-warning-800"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-warning-800">
                    {t("inviteTransferDesc")}
                  </h3>
                </div>
              </div>
            </div>
            <Spacer y={2} />
            <Input
              radius="lg"
              isReadOnly
              label={t("inviteTransferCurrenct")}
              labelPlacement="outside"
              variant="bordered"
              defaultValue={balance.toString()}
              className="w-full"
              startContent={
                <span className="text-default-500 text-sm">￥</span>
              }
              classNames={{
                label:
                  "group-data-[filled-within=true]:text-default-500 text-sm",
                input: "placeholder:text-foreground-700 placeholder:text-tiny",
                inputWrapper:
                  "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
              }}
            />
            <Input
              radius="lg"
              label={t("inviteTransferInput")}
              placeholder={t("inviteTransferPlaceholder")}
              labelPlacement="outside"
              variant="bordered"
              className="w-full"
              startContent={
                <span className="text-default-500 text-sm">￥</span>
              }
              value={transfer}
              onValueChange={setTransfer}
              classNames={{
                label:
                  "group-data-[filled-within=true]:text-default-500 text-sm",
                input:
                  "placeholder:text-foreground-700 placeholder:text-tiny tracking-wider",
                inputWrapper:
                  "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              radius="lg"
              onPress={onClose}
              isDisabled={isTransferring}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("inviteTransferCancel")}
            </Button>
            <Button
              radius="lg"
              onPress={onTransfer}
              isLoading={isTransferring}
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isTransferring && t("inviteTransferConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
