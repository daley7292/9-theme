import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
  Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useCallback } from "react";

export const LoadingInfoCard = () => (
  <InfoCard icon="" title="Loading" isLoading endContent="Loading">
    Loading
  </InfoCard>
);

export const InfoCard = ({
  isLoading,
  title,
  icon,
  children,
  endContent,
  className,
  color,
}: {
  isLoading?: boolean;
  title: React.ReactNode;
  icon: string;
  children?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  color?: string
}) => {
  const renderContent = useCallback(
    (content: React.ReactNode) =>
      isLoading ? (
        <Skeleton className="rounded-lg">Skeleton</Skeleton>
      ) : (
        content
      ),
    [isLoading]
  );

  return (
    <Card
      fullWidth
      radius="lg"
      className={cn(
        "p-3 hover:shadow-md hover:shadow-primary-500/20 transition-shadow",
        className,
        color && "hover:shadow-" + color + "-500/20",
      )}
    >
      <CardHeader className="font-bold tracking-wider text-default-700 truncate">
        {renderContent(title)}
      </CardHeader>
      <CardBody className="tracking-wide">{renderContent(children)}</CardBody>
      {endContent && <CardFooter>{renderContent(endContent)}</CardFooter>}
      <Icon
        icon={icon}
        width={64}
        height={64}
        className={cn(
          "absolute w-[128px] h-[128px] opacity-25",
          "-right-6 -top-8 text-primary-200",
          color && "text-" + color + "-200"
        )}
      />
    </Card>
  );
};
