import { useAuth } from "@/libs/auth";
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
  Select,
  SelectItem,
  SharedSelection,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export const WithdrawContent = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations();
  const router = useRouter();
  const { appConfig } = useAuth();

  const [withdraw, setWithdraw] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<SharedSelection>(
    new Set([])
  );
  const [isWithdrawing, startWithdraw] = useTransition();
  const onWithdraw = () => {
    startWithdraw(async () => {
      try {
        const index = parseInt(withdrawMethod.anchorKey ?? "");
        await fetch.post(`user/ticket/withdraw`, {
          withdraw_account: withdraw,
          withdraw_method: appConfig?.withdraw_methods[index],
        });
        router.push("/ticket");
        toast.success("申请成功，等待审核");
      } catch (e) {
        errorHandle(e);
      } finally {
        setWithdraw("");
      }
    });
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            {t("inviteWithdrawTitle")}
          </ModalHeader>
          <ModalBody>
            <Select
              radius="lg"
              label={t("inviteWithdrawType")}
              labelPlacement="outside"
              placeholder={t("inviteWithdrawSelect")}
              className="w-full"
              variant="bordered"
              selectedKeys={withdrawMethod}
              onSelectionChange={setWithdrawMethod}
              classNames={{
                label: "group-data-[filled=true]:text-default-500 text-sm",
                trigger:
                  "border-primary/25 data-[hover=true]:border-primary/50 data-[open=true]:border-primary/75  data-[focus=true]:border-primary/75",
                value: "text-default-700 text-tiny tracking-wider",
                listbox: "text-default-700 text-tiny",
              }}
            >
              {appConfig
                ? appConfig.withdraw_methods.map(
                    (item: string, idx: number) => (
                      <SelectItem
                        key={idx.toString()}
                        color="primary"
                        variant="flat"
                      >
                        {item}
                      </SelectItem>
                    )
                  )
                : []}
            </Select>
            <Input
              radius="lg"
              label={t("inviteWithdrawInput")}
              labelPlacement="outside"
              variant="bordered"
              placeholder={t("inviteWithdrawPlaceholder")}
              className="w-full"
              value={withdraw}
              onValueChange={setWithdraw}
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
              isDisabled={isWithdrawing}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("inviteWithdrawCancel")}
            </Button>
            <Button
              radius="lg"
              onPress={onWithdraw}
              isLoading={isWithdrawing}
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isWithdrawing && t("inviteWithdrawConfirm")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
