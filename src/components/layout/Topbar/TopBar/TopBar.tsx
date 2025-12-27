import React from "react";
import styles from "./TopBar.module.scss";
import TrailingWrapper from "../../Wrapper/TrailingWrapper/TrailingWrapper";

function TopBar() {

  return (
    <div className={styles.topBar}>
        <TrailingWrapper />
    </div>
  );
}

export default TopBar;
