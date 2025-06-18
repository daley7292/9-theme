"use client";

import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Input, Link } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { PasswordMask } from "@/components/passwordMask";
import { useAuth } from "@/libs/auth";
import errorHandle from "@/libs/errorHandler";

export default function Page() {
  const t = useTranslations();

  const { login } = useAuth();

  type FormValues = z.infer<typeof schema>;
  // 定义 Zod 模式
  const schema = z.object({
    email: z.string().email({ message: t("emailInvalid") }),
    password: z.string().min(8, { message: t("passwordInvalid") }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    startTransition(async () => {
      try {
        await login(data.email, data.password);
      } catch (e) {
        errorHandle(e);
      }
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  const [params, setParams] = useState({
    isVisible: false,
  });

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
        <p className="pb-2 text-xl font-medium">{t("loginTitle")}</p>
        <p className="text-small text-default-500">{t("loginDesc")}</p>
      </div>
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyPress}
      >
        <Input
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
        />
        <Input
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
                setParams((prev) => ({ ...prev, isVisible: !prev.isVisible }))
              }
            />
          }
        />
        <div className="flex justify-end items-center">
          <Link size="sm" className="" href="forgot-password">
            {t("forgotPassword")}
          </Link>
        </div>
        <Button
          className="w-full"
          color="primary"
          type="submit"
          radius="lg"
          isLoading={isPending}
        >
          {!isPending && <Icon icon="ri:login-box-line" width={20} />}
          {!isPending && t("login")}
        </Button>
      </form>
      <p className="text-center text-small">
        {t.rich("noAccount", {
          link: (chunks) => (
            <Link href="register" size="sm">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </>
  );
}
