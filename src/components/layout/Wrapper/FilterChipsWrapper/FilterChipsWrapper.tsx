import React from "react";
import styles from "./FilterChipsWrapper.module.scss";

function FilterChipsWrapper({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}

const Actions = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.actions}>{children}</div>;
};

FilterChipsWrapper.Actions = Actions;

export default FilterChipsWrapper;
