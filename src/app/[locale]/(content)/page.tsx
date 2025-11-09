import React from "react";
import styles from "./page.module.scss";
import { Metadata } from "next";
import MatchList from "@/components/layout/Lists/MatchList/MatchList";


export const metadata: Metadata = {
  title: "Current Matches | TournamentFox",
  description: "Aktuelle Matches auf TournamentFox",
};

export default async function HomePage() {

  return (
    <div className={styles.homePage}>
      <MatchList isHomePage={true} />
    </div>
  );
}
