"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import Notification from "@/components/layout/Notification/Notification";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationTimer {
  id: string;
  timerId: NodeJS.Timeout | null;
  remainingTime: number;
  startTime: number;
  paused: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => "",
  removeNotification: () => {},
  clearNotifications: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
  showSuccess: () => "",
  showError: () => "",
  showWarning: () => "",
  showInfo: () => "",
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, NotificationTimer>>(new Map());

  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
    // Timer entfernen
    const timer = timersRef.current.get(id);
    if (timer?.timerId) {
      clearTimeout(timer.timerId);
    }
    timersRef.current.delete(id);
  }, []);

  const pauseTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer && timer.timerId && !timer.paused) {
      clearTimeout(timer.timerId);
      const elapsed = Date.now() - timer.startTime;
      timer.remainingTime = Math.max(0, timer.remainingTime - elapsed);
      timer.timerId = null;
      timer.paused = true;
      timersRef.current.set(id, timer);
    }
  }, []);

  const resumeTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer && timer.paused && timer.remainingTime > 0) {
      timer.startTime = Date.now();
      timer.paused = false;
      timer.timerId = setTimeout(() => {
        setNotifications((current) => current.filter((n) => n.id !== id));
        timersRef.current.delete(id);
      }, timer.remainingTime);
      timersRef.current.set(id, timer);
    }
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = generateId();
      const newNotification: Notification = {
        id,
        ...notification,
        duration: notification.duration ?? 5000, // Standard-Dauer: 5 Sekunden
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Timer für automatisches Entfernen setzen
      if (!newNotification.persistent && newNotification.duration) {
        const startTime = Date.now();
        const timerId = setTimeout(() => {
          setNotifications((current) => current.filter((n) => n.id !== id));
          timersRef.current.delete(id);
        }, newNotification.duration);

        timersRef.current.set(id, {
          id,
          timerId,
          remainingTime: newNotification.duration,
          startTime,
          paused: false,
        });
      }

      return id;
    },
    [generateId]
  );

  const clearNotifications = useCallback(() => {
    // Alle Timer löschen
    timersRef.current.forEach((timer) => {
      if (timer.timerId) {
        clearTimeout(timer.timerId);
      }
    });
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({
        type: "success",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({
        type: "error",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({
        type: "warning",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({
        type: "info",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        pauseTimer,
        resumeTimer,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          description={
            notification.message ? [notification.message] : undefined
          }
          onClose={() => removeNotification(notification.id)}
          onMouseEnter={() => pauseTimer(notification.id)}
          onMouseLeave={() => resumeTimer(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
