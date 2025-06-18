import CellValue from "@/components/cell-value";
import { PasswordMask } from "@/components/passwordMask";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { toast } from "@/libs/toastHandler";
import { checkPeriod } from "@/libs/utils";
import { inputClass } from "@/styles/inputClass";
import {
  Button,
  cn,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  ScrollShadow,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  useRef,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { site } from "../../../../config";
import { useAuth } from "@/libs/auth";

const periodList = [
  "month_price",
  "quarter_price",
  "half_year_price",
  "year_price",
  "two_year_price",
  "three_year_price",
  "onetime_price",
  "reset_price",
];

export const Content = ({
  plan,
  payment,
}: {
  plan: PlanData;
  payment: PaymentData[];
}) => {
  const t = useTranslations();
  const format = useFormatter();
  const { login } = useAuth();

  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

  const [period, setPeriod] = useState("month_price");
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const [params, setParams] = useState({
    email: "",
    timer: -1,
    isVisible: false,
    isVisible1: false,
    isAcceptTerms: false,
  });
  const emailSuffixRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!payment) return;
    if (!Array.isArray(payment)) return;
    setSelectedPayment(payment[0].id.toString());
  }, [payment]);

  useEffect(() => {
    setPeriod(checkPeriod(plan));
  }, [plan]);

  useEffect(() => {
    setCoupon(null);
  }, [couponCode]);

  const getPrice = useMemo(() => {
    if (!plan) return 0;
    const value = plan[period as keyof PlanData];
    if (!value) return 0;
    return value as number;
  }, [plan, period]);

  const getCouponPrice = useMemo(() => {
    if (!coupon) {
      return getPrice;
    } else {
      if (!getPrice) return 0;
      if (coupon.type === 1) {
        return getPrice - coupon.value < 0 ? 0 : getPrice - coupon.value;
      } else {
        return getPrice * (1 - coupon.value / 100);
      }
    }
  }, [coupon, getPrice]);
  const { remoteConfig, register: reg, sendEmailVerify } = useAuth();
  type FormValues = z.infer<typeof schema>;
  // 定义 Zod 模式
  const schema = z.object({
    email: Array.isArray(remoteConfig?.email_whitelist_suffix)
      ? z.string().min(1, { message: t("emailEmpty") })
      : z.string().email({ message: t("emailInvalid") }),
    verifyCode:
      remoteConfig?.is_email_verify === 1
        ? z.string().min(1, { message: t("verifyCodeInvalid") })
        : z.string().optional(),
    password: z.string().min(8, { message: t("passwordInvalid") }),
    inviteCode: z.string().optional(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [turnstileAction, setTurnstileAction] = useState<
    "verify" | "submit" | null
  >(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const submitDataRef = useRef<FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    submitDataRef.current = data;
    if (site.enableCaptcha) {
      if (turnstileToken) {
        setIsSubmitting(true);
        submitOrder(turnstileToken);
        setIsSubmitting(false);
      } else {
        setTurnstileAction("submit");
        onOpen();
      }
    }else{
      submitOrder();
    }
  };

  const submitOrder = async (token?: string) => {
    const formData = submitDataRef.current;
    if (!formData) {
      onClose();
      setIsSubmitting(false);
      return;
    }
    try {
      const fullemail = Array.isArray(remoteConfig?.email_whitelist_suffix)
        ? formData.email + "@" + emailSuffixRef.current?.value
        : formData.email;
      const res = await fetch.post("shop/order/pay", {
        invite_code: formData.inviteCode,
        email: fullemail,
        email_code: formData.verifyCode,
        password: formData.password,
        plan_id: plan?.id,
        period: period,
        coupon_code: couponCode,
        method: selectedPayment,
        turnstile_token: token,
      });
      await login(fullemail, formData.password);
      if (res.status) {
        window.location.href = res.data.data;
      }
    } catch (e) {
      errorHandle(e);
    } finally {
      submitDataRef.current = null;
      onClose();
      setIsSubmitting(false);
    }
  };

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
      onClose();
      return toast.error(t("emailEmpty"));
    }
    try {
      await sendEmailVerify(params.email, token);
      toast.success(t("verifyCodeSuccess"));
      setParams((prevParams) => ({ ...prevParams, timer: 60 }));
    } catch (e) {
      errorHandle(e);
    } finally {
      onClose();
    }
  };
  const [isChecking, startChecking] = useTransition();
  const checkCoupon = () => {
    if (!couponCode) return;
    if (!plan) return;
    startChecking(async () => {
      try {
        const res = await fetch.post("shop/coupon/check", {
          code: couponCode,
        });
        const data = res.data.data as CouponData;
        if (
          (!data.limit_period || data.limit_period?.includes(period)) &&
          (!data.limit_plan_ids ||
            data.limit_plan_ids?.includes(plan.id.toString()))
        ) {
          toast.success(t("couponCodeSuccess"));
          setCoupon(res.data.data);
        } else {
          setCouponCode("");
          throw Error(t("couponCodeInvalid"));
        }
      } catch (e) {
        errorHandle(e);
      }
    });
  };

  return (
    <>
      <ModalContent>
        {(onClose) => (
          <ScrollShadow>
            <ModalHeader>{t("shopPlanTitle", { plan: plan.name })}</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full pb-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="ri:shopping-bag-4-line"
                        width={16}
                        className="text-primary"
                      />
                      <span className="text-small text-default-500 font-bold">
                        {t("shopPlanPeriod")}
                      </span>
                    </div>
                    <Tabs
                      fullWidth
                      color="primary"
                      variant="bordered"
                      radius="lg"
                      classNames={{
                        tabList: "border-primary/25",
                      }}
                      selectedKey={period}
                      onSelectionChange={(key) => {
                        setPeriod(key as string);
                        setCouponCode("");
                        setCoupon(null);
                      }}
                    >
                      {periodList
                        .filter((key) => plan[key as keyof PlanData] !== null)
                        .map((value) =>
                          value === "reset_price" ? null : (
                            <Tab
                              key={value}
                              className="h-full"
                              title={
                                <div className="flex flex-col items-center gap-2">
                                  <span className="font-bold text-primary group-data-[selected=true]:text-primary-foreground">
                                    {t(value)}
                                  </span>
                                  <span>
                                    {format.number(
                                      (plan[
                                        value as keyof PlanData
                                      ] as number) / 100,
                                      {
                                        style: "currency",
                                        currency: "CNY",
                                      }
                                    )}
                                  </span>
                                </div>
                              }
                            />
                          )
                        )}
                    </Tabs>
                  </div>
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
                      label={
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="ri:mail-line"
                            width={16}
                            className="text-primary"
                          />
                          <span className="text-small text-default-500">
                            {t("email")}
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
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
                            (
                              remoteConfig?.email_whitelist_suffix as string[]
                            ).includes(suffix)
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
                                email:
                                  params.email.split("@")[0] +
                                  "@" +
                                  e.target.value,
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
                      label={
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="ri:verified-badge-line"
                            width={16}
                            className="text-primary"
                          />
                          <span className="text-small text-default-500">
                            {t("verifyCode")}
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
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
                          size="sm"
                          onPress={(token) => {
                            setTurnstileAction("verify");
                            if (site.enableCaptcha) {
                              if (turnstileToken) {
                                handleVerifySend(turnstileToken);
                              } else {
                                onOpen();
                              }
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
                    {...register("password")}
                    label={
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="ri:lock-password-line"
                          width={16}
                          className="text-primary"
                        />
                        <span className="text-small text-default-500">
                          {t("password")}
                        </span>
                      </div>
                    }
                    labelPlacement="outside"
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    radius="lg"
                    classNames={inputClass}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    endContent={
                      <PasswordMask
                        isVisible={isVisible}
                        onClick={() => setIsVisible((prev) => !prev)}
                      />
                    }
                  />
                  <Input
                    {...register("inviteCode")}
                    type="text"
                    label={
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="ri:share-line"
                          width={16}
                          className="text-primary"
                        />
                        <span className="text-small text-default-500">
                          {t("inviteCode")}
                        </span>
                      </div>
                    }
                    labelPlacement="outside"
                    placeholder={t("inviteCodePlaceholder", {
                      optional: t("optional"),
                    })}
                    variant="bordered"
                    radius="lg"
                    classNames={inputClass}
                    isInvalid={!!errors.inviteCode}
                    errorMessage={errors.inviteCode?.message}
                    // defaultValue={searchParams.get("code") ?? ""}
                    // isReadOnly={searchParams.get("code") !== null}
                  />
                  <Input
                    type="text"
                    label={
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="ri:ticket-line"
                          width={16}
                          className="text-primary"
                        />
                        <span className="text-small text-default-500">
                          {t("couponCode")}
                        </span>
                      </div>
                    }
                    labelPlacement="outside"
                    placeholder={t("couponCodePlaceholder")}
                    variant="bordered"
                    radius="lg"
                    classNames={inputClass}
                    value={couponCode}
                    onValueChange={setCouponCode}
                    endContent={
                      <Button
                        size="sm"
                        color={coupon ? "success" : "primary"}
                        isDisabled={!!coupon}
                        isLoading={isChecking}
                        onPress={checkCoupon}
                      >
                        {isChecking ? null : coupon ? (
                          <Icon
                            icon="ri:list-check-3"
                            width={20}
                            className="text-success-700"
                          />
                        ) : (
                          t("couponCodeApply")
                        )}
                      </Button>
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                    label={
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="ri:bank-card-line"
                          width={16}
                          className="text-primary"
                        />
                        <span className="text-small text-default-500 font-bold">
                          {t("paymentMethod")}
                        </span>
                      </div>
                    }
                  >
                    {payment &&
                      Array.isArray(payment) &&
                      payment.map((item: PaymentData) => (
                        <Radio
                          classNames={{
                            base: cn(
                              "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                              "flex max-w-full cursor-pointer rounded-large gap-4 py-4 border-medium",
                              "data-[selected=true]:border-primary/25 data-[selected=true]:bg-primary-50",
                              "transition-transform duration-300 hover:scale-105 tracking-wider"
                            ),
                            wrapper: "hidden",
                            label:
                              "flex items-center justify-start w-full gap-2 text-default-500",
                          }}
                          key={item.id.toString()}
                          value={item.id.toString()}
                        >
                          <div className="min-w-[24px] min-h-[24px]">
                            {item.icon ? (
                              <Image
                                alt=""
                                width={24}
                                height={24}
                                radius="none"
                                src={item.icon}
                              />
                            ) : (
                              <Icon icon="ri:secure-payment-line" width={24} />
                            )}
                          </div>
                          <span className="text-md font-bold text-default-700 tracking-wider">
                            {item.name}
                          </span>
                        </Radio>
                      ))}
                  </RadioGroup>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="ri:file-list-3-line"
                        width={16}
                        className="text-primary"
                      />
                      <span className="text-small text-default-500 font-bold">
                        {t("orderSummary")}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col gap-2",
                        "bg-content1 p-4 rounded-large border-2 border-primary/25"
                      )}
                    >
                      <CellValue
                        label={t("orderPrice")}
                        value={
                          coupon ? (
                            <>
                              <del>
                                {format.number(getPrice / 100, {
                                  style: "currency",
                                  currency: "CNY",
                                })}
                              </del>{" "}
                              <span className="text-danger">
                                {format.number(getCouponPrice / 100, {
                                  style: "currency",
                                  currency: "CNY",
                                })}
                              </span>
                            </>
                          ) : (
                            format.number(getCouponPrice / 100, {
                              style: "currency",
                              currency: "CNY",
                            })
                          )
                        }
                      />
                      <CellValue
                        label={t("orderTotal")}
                        value={format.number(getCouponPrice / 100, {
                          style: "currency",
                          currency: "CNY",
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 w-full flex flex-row justify-end gap-2">
                  <Button
                    variant="light"
                    color="danger"
                    radius="lg"
                    isDisabled={isSubmitting}
                    onPress={onClose}
                    className="transition-transform duration-300 hover:scale-105 tracking-wider"
                  >
                    {t("orderCancel")}
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    color="primary"
                    radius="lg"
                    className="transition-transform duration-300 hover:scale-105 tracking-wider"
                  >
                    {!isSubmitting && t("orderPay")}
                  </Button>
                </div>
              </form>
            </ModalBody>
          </ScrollShadow>
        )}
      </ModalContent>
      <Modal
        placement="center"
        isKeyboardDismissDisabled
        isDismissable={false}
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
      >
        <ModalContent>
          {() => (
            <div className="w-full h-[100px] flex justify-center items-center">
              <Turnstile
                siteKey={site.siteKey}
                onSuccess={(token) => {
                  console.log(token);
                  setTurnstileToken(token);
                  if (turnstileAction === "verify") {
                    handleVerifySend(token);
                  } else if (turnstileAction === "submit") {
                    submitOrder(token);
                  }
                }}
                onError={() => {
                  errorHandle(t("orderTurnstileError"));
                  onClose();
                }}
                onExpire={() => {
                  setTurnstileToken(null);
                }}
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
