"use client";

import { InfoCard, LoadingInfoCard } from "@/components/dashboard/infoCard";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { TicketContent } from "@/components/dashboard/ticketContent";
import { useAuth } from "@/libs/auth";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import {
  Button,
  Card,
  CardBody,
  Chip,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import useSWR from "swr";

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();

  const { data, isLoading, mutate } = useSWR("user/ticket/fetch");
  const [chat, setChat] = useState<TicketData | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const statusColor = useCallback((item: TicketData): Color => {
    if (item.status === 1) return "default";
    if (item.reply_status === 0) {
      return "success";
    }
    return "warning";
  }, []);
  const statusName = useCallback((item: TicketData): string => {
    if (item.status === 1) return t("ticketStatusClose");
    if (item.reply_status === 0) {
      return t("ticketStatusReply");
    }
    return t("ticketStatusWait");
  }, []);
  const fetchTicket = async (id: number) => {
    try {
      const { data } = await fetch.get(`user/ticket/fetch?id=${id}`);
      return data.data as TicketData;
    } catch (e) {
      errorHandle(e);
    }
  };
  const renderTicket = async (id: number) => {
    if (!data || !data.data) return;
    if (!Array.isArray(data.data)) return;
    if (data.data.length === 0) return;
    const ticket = await fetchTicket(id);
    if (!ticket) return;
    setChat(ticket);
    onOpen();
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");
  const [isClosing, startClosing] = useTransition();
  const onCloseTicket = (id: number) => {
    startClosing(async () => {
      try {
        await fetch.post(`user/ticket/close`, { id: id });
        await mutate();
        onClose();
      } catch (e) {
        errorHandle(e);
      }
    });
  };
  const [isPending, startPending] = useTransition();
  const onSend = () => {
    if (!chat) return;
    startPending(async () => {
      try {
        await fetch.post(`user/ticket/reply`, {
          id: chat.id,
          message: content,
        });
        await fetchTicket(chat.id);
      } catch (e) {
        errorHandle(e);
      } finally {
        setContent("");
      }
    });
  };
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null
  );
  useEffect(() => {
    if (!chat) return;
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimer(
        setInterval(async () => {
          const { data } = await fetch.get(`user/ticket/fetch?id=${chat.id}`);
          if (data.data.message?.length !== chat.message?.length) {
            setChat(data.data);
          }
        }, 5000)
      );
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [chat, isOpen]);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
    onClose: onCreateClose,
  } = useDisclosure();

  return (
    <>
      <div className="flex flex-row gap-4 md:px-12">
        <Button
          variant="flat"
          color="primary"
          className={cn(
            "mx-auto sm:mx-0",
            "transition-transform duration-300 hover:scale-105 tracking-wider"
          )}
          onPress={onCreateOpen}
        >
          提交工单
        </Button>
      </div>
      <div className="gap-4 p-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <NoticeCard />
        {isLoading ? (
          <LoadingInfoCard />
        ) : (
          data &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.map((ticket: TicketData) => (
            <InfoCard
              key={ticket.id}
              title={ticket.subject}
              icon=""
              endContent={
                <div>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="ri:error-warning-line" />}
                    onPress={async () => renderTicket(ticket.id)}
                    className="transition-transform duration-300 hover:scale-105 tracking-wider"
                  >
                    {t("dashboardNoticeDetail")}
                  </Button>
                </div>
              }
            >
              <div className="flex flex-row gap-2">
                <Chip
                  size="sm"
                  variant="dot"
                  color={statusColor(ticket)}
                  radius="sm"
                  className={cn(
                    "border-1",
                    "border-" + statusColor(ticket) + "-200",
                    "bg-" + statusColor(ticket) + "-100",
                    "text-" + statusColor(ticket) + "-500"
                  )}
                >
                  {statusName(ticket)}
                </Chip>
                <Chip
                  variant="flat"
                  size="sm"
                  color={statusColor(ticket)}
                  radius="sm"
                >
                  {t("updateAt", {
                    date: format.dateTime(ticket.updated_at * 1000, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }),
                  })}
                </Chip>
              </div>
            </InfoCard>
          ))
        )}
      </div>
      <Modal
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        scrollBehavior="inside"
        classNames={{
          closeButton: "top-4 right-4",
        }}
      >
        <ModalContent>
          {(onClose) =>
            chat && (
              <>
                <ModalHeader className="gap-2 items-center w-[90%]">
                  <span className="truncate">{chat.subject}</span>
                  {chat.status === 0 && (
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => onCloseTicket(chat.id)}
                      isLoading={isClosing}
                      className="transition-transform duration-300 hover:scale-105 tracking-wider"
                    >
                      {!isClosing && t("ticketClose")}
                    </Button>
                  )}
                </ModalHeader>
                <ScrollShadow>
                  <ModalBody>
                    {chat.message?.map((item: TicketMessageData) => (
                      <div
                        key={item.id.toString()}
                        className={cn(
                          "flex ",
                          item.is_me ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex flex-col gap-1 max-w-[90%] text-sm",
                            item.is_me ? "text-right" : "text-left"
                          )}
                        >
                          {format.dateTime(item.updated_at * 1000, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                          <Card
                            radius="lg"
                            shadow="none"
                            className={cn(
                              item.is_me ? "bg-primary-200" : "bg-default-200"
                            )}
                          >
                            <CardBody className="text-sm">
                              {item.message}
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </ModalBody>
                </ScrollShadow>
                <ModalFooter>
                  <Input
                    radius="lg"
                    variant="bordered"
                    classNames={{
                      label: "group-data-[filled-within=true]:text-default-900",
                      input: "placeholder:text-foreground-700",
                      inputWrapper:
                        "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
                      helperWrapper: "h-4",
                    }}
                    value={content}
                    onValueChange={setContent}
                    placeholder="输入内容回复工单..."
                  />
                  <Button
                    radius="lg"
                    variant="flat"
                    color="primary"
                    className={cn(
                      "transition-transform duration-300 hover:scale-105 tracking-wider"
                    )}
                    isLoading={isPending}
                    onPress={onSend}
                  >
                    {!isPending && t("ticketReply")}
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isCreateOpen}
        scrollBehavior="inside"
        onOpenChange={onCreateOpenChange}
      >
        <TicketContent mutate={mutate} onClose={onCreateClose} />
      </Modal>
    </>
  );
}
