import React from "react";
import {
  CloseIcon,
  ErrorIcon,
  SuccessIcon,
  WarningIcon,
  InfoIcon,
} from "@/assets/icons";
import IconButton from "@/components/atoms/IconButton/IconButton";
import styles from "./Notification.module.scss";

interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string[];
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function Notification({
  type = "info",
  title = "Info",
  description,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: NotificationProps) {
  return (
    <div
      className={`${styles.notification} ${styles[type]}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.notification__header}>
        <div className={styles.notification__header__icon}>
          {type === "success" && <SuccessIcon height={20} width={20} />}
          {type === "error" && <ErrorIcon height={20} width={20} />}
          {type === "warning" && <WarningIcon height={20} width={20} />}
          {type === "info" && <InfoIcon height={20} width={20} />}
          <p>{title}</p>
        </div>
        <IconButton
          icon={CloseIcon}
          onClick={onClose}
          iconColor={`rgb(var(--on-${type}))`}
          iconSize={16}
        />
      </div>
      {description && (
        <ul className={styles.notification__list}>
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
