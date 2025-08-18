import React from "react";
import styles from "./ScrollContainer.module.scss";

type ScrollContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

function ScrollContainer({
  children,
  className,
  ...props
}: ScrollContainerProps) {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default ScrollContainer;
