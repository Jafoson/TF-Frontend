import { Link } from "@/i18n/navigation";
import React from "react";
import styles from "./Tab.module.scss";

interface TabProps {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  href?: string;
  onClick?: () => void;
}

function Tab({
  title,
  icon: Icon,
  href,
  onClick,
}: TabProps) {

    const TabVariant = () => {
        if (href) {
            return <Link href={href} className={styles.tab}>
                <Icon height={28} width={28} />
                <span>{title}</span>
            </Link>
        }
        return <div className={styles.tab} onClick={onClick}>
            <Icon height={28} width={28} />
            <span>{title}</span>
        </div>
    }
  return (
    <TabVariant />
  );
}

export default Tab;
