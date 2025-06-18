import { Button, Link } from "@heroui/react";

export const PlanButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <Button
    as={Link}
    size="sm"
    fullWidth
    color="primary"
    variant="flat"
    href={href}
    className="hover:scale-105 transition-transform"
  >
    {children}
  </Button>
);
