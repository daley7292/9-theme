import { addToast } from "@heroui/react";

type Color =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning";

const createToast = (msg: string, color: Color) => {
  addToast({
    title: msg,
    color: color,
  });
};

export const toast = {
  default: (msg: string) => createToast(msg, "default"),
  primary: (msg: string) => createToast(msg, "primary"),
  secondary: (msg: string) => createToast(msg, "secondary"),
  success: (msg: string) => createToast(msg, "success"),
  error: (msg: string) => createToast(msg, "danger"),
  warning: (msg: string) => createToast(msg, "warning"),
};
