import { Link, usePathname } from "@/i18n/navigation";
import React from "react";
import styles from "./Tab.module.scss";

interface TabProps {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
  isOpen: boolean;
  isExpanded: boolean;
}

function Tab({
  title,
  icon: Icon,
  activeIcon: ActiveIcon,
  href,
  isOpen,
  isExpanded,
}: TabProps) {
  const pathname = usePathname();
  return (
    <Link
      data-active={pathname === href}
      href={href}
      className={styles.tab}
      data-expanded={isExpanded}
      data-open={isOpen}
    >
      {pathname === href ? (
        <ActiveIcon height={28} width={28} />
      ) : (
        <Icon height={28} width={28} />
      )}
      <span>{title}</span>
    </Link>
  );
}

export default Tab;
