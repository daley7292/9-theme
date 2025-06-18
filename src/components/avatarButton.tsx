import { useAuth } from "@/libs/auth";
import {
  Avatar,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export const AvatarButton = () => {
  const t = useTranslations();
  const { userInfo, logout } = useAuth();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLogout, startLogout] = useTransition();
  const handleClick = () => {
    startLogout(async () => {
      try {
        await logout();
      } catch (e) {
        // Handle error if needed
      }
    });
  };

  if (!userInfo) return null;
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            name={userInfo.email ?? ""}
            src={userInfo.avatar_url ?? ""}
            className="hover:scale-105 transition-transform"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" variant="faded">
          <DropdownItem key="logout" onPress={onOpen} className="text-danger">
            {t("navLogout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isOpen}
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("profileLogoutTitle")}
              </ModalHeader>
              <ModalBody className="text-default-500">
                {t("profileLogoutContent")}
              </ModalBody>
              <ModalFooter>
                <Button
                  radius="lg"
                  isDisabled={isLogout}
                  onPress={onClose}
                  variant="light"
                  color="danger"
                  className={cn(
                    "transition-transform duration-300 hover:scale-105 tracking-wider"
                  )}
                >
                  {t("profileLogoutCancel")}
                </Button>
                <Button
                  radius="lg"
                  isLoading={isLogout}
                  onPress={handleClick}
                  color="primary"
                  className={cn(
                    "transition-transform duration-300 hover:scale-105 tracking-wider"
                  )}
                >
                  {!isLogout && t("profileLogoutConfirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
