"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTitle } from "@/context/TitleContext";
import styles from "./page.module.scss";
import ScrollContainer from "@/components/utils/ScrollContainer/ScrollContainer";

function HomePage() {
  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle("Current Matches");
  }, []);

  return (
    <div className={styles.homePage}>
      <ScrollContainer className={styles.scrollContainer}>
        <h1>Hier kommen die Matches</h1>
      </ScrollContainer>
    </div>
  );
}

export default HomePage;
