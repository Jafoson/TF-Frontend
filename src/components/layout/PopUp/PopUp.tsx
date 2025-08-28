"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useHover,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import styles from "./PopUp.module.scss";

// Context für PopUp State
interface PopUpContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refs: ReturnType<typeof useFloating>["refs"];
  floatingStyles: React.CSSProperties;
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  context: ReturnType<typeof useFloating>["context"];
}

const PopUpContext = createContext<PopUpContextType | null>(null);

const usePopUp = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error("PopUp components must be used within a PopUp provider");
  }
  return context;
};

// Hauptkomponente
interface PopUpProps {
  children: ReactNode;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end";
  offset?: number;
  canOpenByHover?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PopUp: React.FC<PopUpProps> & {
  Trigger: typeof PopUpTrigger;
  Container: typeof PopUpContainer;
  Property: typeof PopUpProperty;
} = ({
  children,
  placement = "bottom-start",
  offset: offsetValue = 8,
  canOpenByHover = false,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Custom setIsOpen handler um onOpenChange zu triggern
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({ padding: 5 }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const hover = useHover(context, {
    enabled: canOpenByHover,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
    hover,
  ]);

  const contextValue: PopUpContextType = {
    isOpen,
    setIsOpen: handleOpenChange,
    refs,
    floatingStyles,
    getFloatingProps,
    getReferenceProps,
    context,
  };

  return (
    <PopUpContext.Provider value={contextValue}>
      {children}
    </PopUpContext.Provider>
  );
};

// Trigger Komponente
interface PopUpTriggerProps {
  children: ReactNode;
  className?: string;
}

const PopUpTrigger: React.FC<PopUpTriggerProps> = ({ children, className }) => {
  const { refs, getReferenceProps } = usePopUp();

  return (
    <div
      ref={refs.setReference}
      className={`${styles.trigger} ${className || ""}`}
      {...getReferenceProps()}
    >
      {children}
    </div>
  );
};

// Container Komponente
interface PopUpContainerProps {
  children: ReactNode;
  className?: string;
}

const PopUpContainer: React.FC<PopUpContainerProps> = ({
  children,
  className,
}) => {
  const { isOpen, refs, floatingStyles, getFloatingProps, context } =
    usePopUp();

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          className={`${styles.container} ${className || ""}`}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

// Property Komponente
interface PopUpPropertyProps {
  value?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const PopUpProperty: React.FC<PopUpPropertyProps> = ({
  value,
  children,
  className,
  onClick,
}) => {
  const { setIsOpen } = usePopUp();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setIsOpen(false);
  };

  return (
    <div
      data-value={value || ""}
      className={`${styles.property} ${className || ""}`}
      onClick={handleClick}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </div>
  );
};

// Compound Component Pattern
PopUp.Trigger = PopUpTrigger;
PopUp.Container = PopUpContainer;
PopUp.Property = PopUpProperty;

export default PopUp;
export { PopUpTrigger, PopUpContainer, PopUpProperty };
export type {
  PopUpProps,
  PopUpTriggerProps,
  PopUpContainerProps,
  PopUpPropertyProps,
};
