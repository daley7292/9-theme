"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Button,
  Checkbox,
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
import { useSearchParams } from "next/navigation";
import { toast } from "@/libs/toastHandler";
import { site } from "../../../../config";

export default function Page() {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const { remoteConfig, register: reg, sendEmailVerify } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [params, setParams] = useState({
    email: "",
    timer: -1,
    isVisible: false,
    isVisible1: false,
    isAcceptTerms: false,
  });
  const emailSuffixRef = useRef<HTMLSelectElement>(null);

  type FormValues = z.infer<typeof schema>;
  // 定义 Zod 模式
  const schema = z
    .object({
      email: Array.isArray(remoteConfig?.email_whitelist_suffix)
        ? z.string().min(1, { message: t("emailEmpty") })
        : z.string().email({ message: t("emailInvalid") }),
      verifyCode:
        remoteConfig?.is_email_verify === 1
          ? z.string().min(1, { message: t("verifyCodeInvalid") })
          : z.string().optional(),
      password: z.string().min(8, { message: t("passwordInvalid") }),
      password1: z.string(),
      redeemCode: z.string().optional(),
      inviteCode:
        remoteConfig?.is_invite_force === 1
          ? z.string().min(6, { message: t("inviteCodeInvalid") })
          : z.string().optional(),
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
    const email = Array.isArray(remoteConfig?.email_whitelist_suffix)
      ? data.email + "@" + emailSuffixRef.current?.value
      : data.email;
    startTransition(async () => {
      try {
        await reg(
          email,
          data.password,
          data.verifyCode ?? "",
          data.redeemCode ?? "",
          data.inviteCode ?? ""
        );
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
    if (!params.email || !params.email.split("@")[0]) {
      return toast.error(t("emailEmpty"));
    }
    try {
      await sendEmailVerify(params.email, token);
      toast.success(t("verifyCodeSuccess"));
      setParams((prevParams) => ({ ...prevParams, timer: 60 }));
    } catch (e) {
      errorHandle(e);
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
  if (!remoteConfig) return null;
  return (
    <>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">{t("registerTitle")}</p>
        <p className="text-small text-default-500">{t("registerDesc")}</p>
      </div>
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!Array.isArray(remoteConfig?.email_whitelist_suffix) ? (
          <Input
            autoComplete="off"
            {...register("email")}
            label={t("email")}
            name="email"
            placeholder={t("emailPlaceholder")}
            type="email"
            variant="bordered"
            radius="lg"
            classNames={inputClass}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            value={params.email}
            onValueChange={(value) =>
              setParams((prev) => ({
                ...prev,
                email: value,
              }))
            }
          />
        ) : (
          <Input
            autoComplete="off"
            {...register("email")}
            label={t("email")}
            name="email"
            placeholder={t("emailPlaceholder")}
            type="text"
            variant="bordered"
            radius="lg"
            classNames={inputClass}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            value={params.email.split("@")[0]}
            onValueChange={(value) => {
              if (emailSuffixRef.current === null) return;
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              let newValue = value;
              let suffix = emailSuffixRef.current?.value || "";

              if (value.includes("@")) {
                newValue = value.split("@")[0];
              }

              if (emailRegex.test(value)) {
                const emailParts = value.split("@");
                newValue = emailParts[0];
                suffix = emailParts[1];
                if (
                  (remoteConfig?.email_whitelist_suffix as string[]).includes(
                    suffix
                  )
                ) {
                  emailSuffixRef.current.value = suffix;
                } else {
                  suffix = emailSuffixRef.current?.value || "";
                }
              }

              setParams((prev) => ({
                ...prev,
                email: `${newValue}@${suffix}`,
              }));
            }}
            endContent={
              <div className="flex items-center text-small">
                <label className="text-default-700">@</label>
                <select
                  className="outline-none border-0 bg-transparent text-default-700 bg-background"
                  id="emailSuffix"
                  name="emailSuffix"
                  ref={emailSuffixRef}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      email: params.email.split("@")[0] + "@" + e.target.value,
                    })
                  }
                >
                  {remoteConfig?.email_whitelist_suffix.map(
                    (suffix: string) => (
                      <option
                        key={suffix}
                        value={suffix}
                        className="text-black"
                      >
                        {suffix}
                      </option>
                    )
                  )}
                </select>
              </div>
            }
          />
        )}
        {remoteConfig?.is_email_verify === 1 && (
          <Input
            {...register("verifyCode")}
            label={t("verifyCode")}
            name="verifyCode"
            placeholder={t("verifyCodePlaceholder")}
            type="text"
            variant="bordered"
            radius="lg"
            classNames={inputClass}
            isInvalid={!!errors.verifyCode}
            errorMessage={errors.verifyCode?.message}
            endContent={
              <Button
                color="primary"
                className="h-full"
                onPress={()=>{
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
        )}
        <Input
            autoComplete="off"
          {...register("password")}
          label={t("password")}
          name="password"
          placeholder={t("passwordPlaceholder")}
          type={params.isVisible ? "text" : "password"}
          variant="bordered"
          radius="lg"
          classNames={inputClass}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            <PasswordMask
              isVisible={params.isVisible}
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  isVisible: !prev.isVisible,
                }))
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
          radius="lg"
          classNames={inputClass}
          isInvalid={!!errors.password1}
          errorMessage={errors.password1?.message}
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
          {...register("redeemCode")}
          label={t("redeemCode")}
          name="redeemCode"
          placeholder={t("redeemCodePlaceholder")}
          type="text"
          variant="bordered"
          radius="lg"
          classNames={inputClass}
          isInvalid={!!errors.redeemCode}
          errorMessage={errors.redeemCode?.message}
        />
        <Input
          {...register("inviteCode")}
          isRequired={remoteConfig?.is_invite_force === 1}
          type="text"
          label={t("inviteCode")}
          placeholder={t("inviteCodePlaceholder", {
            optional: remoteConfig?.is_invite_force === 0 && t("optional"),
          })}
          variant="bordered"
          radius="lg"
          classNames={inputClass}
          isInvalid={!!errors.inviteCode}
          errorMessage={errors.inviteCode?.message}
          defaultValue={searchParams.get("code") ?? ""}
          isReadOnly={searchParams.get("code") !== null}
        />
        {remoteConfig?.tos_url && (
          <div className="w-full flex justify-start items-center mb-3 gap-1">
            <Checkbox
              size="sm"
              color="primary"
              isSelected={params.isAcceptTerms}
              onValueChange={(bool) =>
                setParams((prev) => ({
                  ...prev,
                  isAcceptTerms: bool,
                }))
              }
            >
              {t("terms")}
            </Checkbox>
            <Link
              href={remoteConfig.tos_url ?? ""}
              size="sm"
              target="_blank"
              showAnchorIcon
            >
              {t("termsLink")}
            </Link>
          </div>
        )}
        <Button
          className="w-full"
          color="primary"
          type="submit"
          radius="lg"
          isLoading={isPending}
          isDisabled={
            remoteConfig?.tos_url && !params.isAcceptTerms ? true : false
          }
        >
          {!isPending && <Icon icon="ri:pencil-line" width={20} />}
          {!isPending && t("register")}
        </Button>
      </form>
      <p className="text-center text-small">
        {t.rich("hasAccount", {
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
                onSuccess={async (token: string) => {
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
