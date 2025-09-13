"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SVGProps,
} from "react";
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
  ScrollContainer: typeof PopUpScrollContainer;
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

interface PopUpScrollContainerProps {
  children: ReactNode;
}

const PopUpScrollContainer: React.FC<PopUpScrollContainerProps> = ({ children }) => {
  return <div className={`${styles.scrollContainer}`}>{children}</div>;
};

// Container Komponente
interface PopUpContainerProps {
  children: ReactNode;
  className?: string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
}

const PopUpContainer: React.FC<PopUpContainerProps> = ({
  children,
  className,
  width,
  minWidth,
  maxWidth,
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
          style={{
            ...floatingStyles,
            ...(width && {
              width: typeof width === "number" ? `${width}px` : width,
            }),
            ...(minWidth && {
              minWidth:
                typeof minWidth === "number" ? `${minWidth}px` : minWidth,
            }),
            ...(maxWidth && {
              maxWidth:
                typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }),
          }}
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
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  value?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  closeOnClick?: boolean; // Ob das PopUp beim Klick geschlossen werden soll
}

const PopUpProperty: React.FC<PopUpPropertyProps> = ({
  icon: Icon,
  value,
  children,
  className,
  onClick,
  selected = false,
  closeOnClick = true, // Standardmäßig schließen
}) => {
  const { setIsOpen } = usePopUp();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <div
      data-selected={selected}
      data-has-icon={!!Icon}
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
      {Icon && <Icon width={24} height={24} />}
      {children}
    </div>
  );
};

// Compound Component Pattern
PopUp.Trigger = PopUpTrigger;
PopUp.Container = PopUpContainer;
PopUp.Property = PopUpProperty;
PopUp.ScrollContainer = PopUpScrollContainer;

export default PopUp;
export { PopUpTrigger, PopUpContainer, PopUpProperty, PopUpScrollContainer };
export type {
  PopUpProps,
  PopUpTriggerProps,
  PopUpContainerProps,
  PopUpPropertyProps,
  PopUpScrollContainerProps,
};
