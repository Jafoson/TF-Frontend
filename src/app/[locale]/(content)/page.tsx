import React from "react";
import { getSeries } from "@/actions/series";
import styles from "./page.module.scss";
import { Metadata } from "next";
import HomePageMatchList from "@/components/layout/Lists/HomePageMatchList/HomePageMatchList";
import { SeriesDTO } from "@/types/series";

// Diese Funktion wird serverseitig ausgeführt
async function getData() {
  const seriesResponse = await getSeries(0, 10);
  return seriesResponse.data?.data || [];
}

export const metadata: Metadata = {
  title: "Current Matches | TournamentFox",
  description: "Aktuelle Matches auf TournamentFox",
};

export default async function HomePage() {
  // Serverseitige Datenabfrage
  const series = (await getData()) as SeriesDTO[];

  return (
    <div className={styles.homePage}>
      <HomePageMatchList initialData={series} initialPage={0} pageSize={10} />
    </div>
  );
}
