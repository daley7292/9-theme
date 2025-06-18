import {
  Button,
  cn,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { PasswordMask } from "../passwordMask";
import { inputClass } from "@/styles/inputClass";
import errorHandle from "@/libs/errorHandler";
import { useState, useTransition } from "react";
import { toast } from "@/libs/toastHandler";
import { useAuth } from "@/libs/auth";
import { useTranslations } from "next-intl";

export const ChangeContent = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations();
  const { changePass } = useAuth();
  const [isChanging, startChange] = useTransition();
  const [params, setParams] = useState({
    password1: "",
    password2: "",
    password3: "",

    isVisible1: false,
    isVisible2: false,
    isVisible3: false,
  });
  const onChange = () => {
    startChange(async () => {
      try {
        if (params.password1.length < 8 || params.password2.length < 8) {
          throw Error(t("passwordInvalid"));
        }
        if (params.password2 !== params.password3) {
          throw Error(t("profileChangeError"));
        }
        await changePass(params.password1, params.password2);
        toast.success(t("profileChangeToast"));
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
          <ModalHeader className="flex flex-col gap-1">修改密码</ModalHeader>
          <ModalBody>
            <Input
              radius="lg"
              label={t("profileChangePass1")}
              placeholder={t("profileChangePass1Placeholder")}
              variant="bordered"
              classNames={inputClass}
              type={params.isVisible1 ? "text" : "password"}
              value={params.password1}
              onValueChange={(value) =>
                setParams((prev) => ({ ...prev, password1: value }))
              }
              endContent={
                <PasswordMask
                  isVisible={params.isVisible1}
                  onClick={() =>
                    setParams((prev) => ({
                      ...prev,
                      isVisible1: !prev.isVisible1,
                    }))
                  }
                />
              }
            />
            <Input
              radius="lg"
              label={t("profileChangePass2")}
              placeholder={t("profileChangePass2Placeholder")}
              variant="bordered"
              classNames={inputClass}
              type={params.isVisible2 ? "text" : "password"}
              value={params.password2}
              onValueChange={(value) =>
                setParams((prev) => ({ ...prev, password2: value }))
              }
              endContent={
                <PasswordMask
                  isVisible={params.isVisible2}
                  onClick={() =>
                    setParams((prev) => ({
                      ...prev,
                      isVisible2: !prev.isVisible2,
                    }))
                  }
                />
              }
            />
            <Input
              radius="lg"
              label={t("profileChangePass3")}
              placeholder={t("profileChangePass3Placeholder")}
              variant="bordered"
              classNames={inputClass}
              type={params.isVisible3 ? "text" : "password"}
              value={params.password3}
              onValueChange={(value) =>
                setParams((prev) => ({ ...prev, password3: value }))
              }
              endContent={
                <PasswordMask
                  isVisible={params.isVisible3}
                  onClick={() =>
                    setParams((prev) => ({
                      ...prev,
                      isVisible3: !prev.isVisible3,
                    }))
                  }
                />
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              radius="lg"
              isDisabled={isChanging}
              onPress={onClose}
              variant="light"
              color="danger"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {t("profileChangePassCancel")}
            </Button>
            <Button
              radius="lg"
              onPress={onChange}
              isLoading={isChanging}
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
            >
              {!isChanging && t("profileChangePassButton")}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
