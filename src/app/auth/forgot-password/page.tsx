"use client";

import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Button,
  Input,
  Link,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";

import { PasswordMask } from "@/components/passwordMask";
import { useAuth } from "@/libs/auth";
import errorHandle from "@/libs/errorHandler";
import { toast } from "@/libs/toastHandler";
import { site } from "../../../../config";

export default function Page() {
  const t = useTranslations();

  const { login, reset, sendEmailVerify, remoteConfig } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [params, setParams] = useState({
    email: "",
    timer: -1,
    isVisible: false,
    isVisible1: false,
  });

  type FormValues = z.infer<typeof schema>;
  // 定义 Zod 模式
  const emailSchema = z.string().email({ message: t("emailInvalid") });
  const schema = z
    .object({
      email: z.string().email({ message: t("emailInvalid") }),
      verifyCode: z.string().min(1, { message: t("verifyCodeInvalid") }),
      password: z.string().min(8, { message: t("passwordInvalid") }),
      password1: z.string(),
    })
    .refine((values) => values.password === values.password1, {
      message: t("password1Invalid"),
      path: ["password1"],
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    startTransition(async () => {
      try {
        await reset(data.email, data.password, data.verifyCode);
        await login(data.email, data.password);
      } catch (e) {
        errorHandle(e);
      }
    });
  };

  // 获取验证码间隔
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (params.timer > 0) {
      intervalId = setInterval(() => {
        setParams((prevParams) => ({
          ...prevParams,
          timer: prevParams.timer - 1,
        }));
      }, 1000);
    } else {
      setParams((prevParams) => ({ ...prevParams, timer: -1 }));
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [params.timer]);

  const handleVerifySend = async (token?: string) => {
    try {
      emailSchema.parse(params.email);
      await sendEmailVerify(params.email, token);
      toast.success(t("verifyCodeSuccess"));
      setParams((prevParams) => ({ ...prevParams, timer: 60 }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.issues[0].message);
      } else {
        errorHandle(e);
      }
    }
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const inputClass = {
    label: "group-data-[filled-within=true]:text-default-900",
    input: "placeholder:text-foreground-700",
    inputWrapper:
      "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
    helperWrapper: "h-4",
  };
  return (
    <>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">{t("resetTitle")}</p>
        <p className="text-small text-default-500">{t("resetDesc")}</p>
      </div>
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register("email")}
          label={t("email")}
          name="email"
          placeholder={t("emailPlaceholder")}
          type="email"
          variant="bordered"
          classNames={inputClass}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          value={params.email}
          onValueChange={(value) =>
            setParams((prev) => ({ ...prev, email: value }))
          }
        />
        <Input
          {...register("verifyCode")}
          label={t("verifyCode")}
          name="verifyCode"
          placeholder={t("verifyCodePlaceholder")}
          type="text"
          variant="bordered"
          classNames={inputClass}
          isInvalid={!!errors.verifyCode}
          errorMessage={errors.verifyCode?.message}
          endContent={
            <Button
              radius="sm"
              color="primary"
              className="h-full"
              onPress={() => {
                if (site.enableCaptcha) {
                  onOpen();
                } else {
                  handleVerifySend();
                }
              }}
              isLoading={params.timer > 0}
              spinner={null}
            >
              {params.timer <= 0
                ? t("verifyCodeSend")
                : params.timer.toString()}
            </Button>
          }
        />
        <Input
          {...register("password")}
          label={t("password")}
          name="password"
          placeholder={t("passwordPlaceholder")}
          type={params.isVisible ? "text" : "password"}
          variant="bordered"
          classNames={inputClass}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            <PasswordMask
              isVisible={params.isVisible}
              onClick={() =>
                setParams((prev) => ({ ...prev, isVisible: !prev.isVisible }))
              }
            />
          }
        />
        <Input
          {...register("password1")}
          label={t("password1")}
          name="password1"
          placeholder={t("password1Placeholder")}
          type={params.isVisible1 ? "text" : "password"}
          variant="bordered"
          classNames={inputClass}
          isInvalid={!!errors.password1}
          errorMessage={errors.password1?.message}
          endContent={
            <PasswordMask
              isVisible={params.isVisible1}
              onClick={() =>
                setParams((prev) => ({ ...prev, isVisible1: !prev.isVisible1 }))
              }
            />
          }
        />
        <Button
          className="w-full"
          color="primary"
          type="submit"
          isLoading={isPending}
        >
          {!isPending && <Icon icon="ri:refresh-line" width={20} />}
          {!isPending && t("resetPassword")}
        </Button>
      </form>
      <p className="text-center text-small">
        {t.rich("rememberAccount", {
          link: (chunks) => (
            <Link href="login" size="sm">
              {chunks}
            </Link>
          ),
        })}
      </p>
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="flex justify-center items-center p-4">
              <Turnstile
                siteKey={site.siteKey}
                onSuccess={async (token) => {
                  await handleVerifySend(token);
                  onClose();
                }}
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
