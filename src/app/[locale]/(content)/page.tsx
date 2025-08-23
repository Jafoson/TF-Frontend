import React from "react";
import { getSeries } from "@/actions/series";
import SeriesCards from "@/components/layout/Cards/SeriesCards/SeriesCards";
import styles from "./page.module.scss";
import { Metadata } from "next";

// Diese Funktion wird serverseitig ausgeführt
async function getData() {
  const seriesResponse = await getSeries(0, 20);
  return seriesResponse.data?.data || [];
}

export const metadata: Metadata = {
  title: "Current Matches | TournamentFox",
  description: "Aktuelle Matches auf TournamentFox",
};

export default async function HomePage() {
  // Serverseitige Datenabfrage
  const series = await getData();

  return (
    <div className={styles.homePage}>
      <div className={styles.scrollContainer}>
        {series.length > 0 ? (
          series.map((seriesItem) => (
            <SeriesCards key={seriesItem.id} series={seriesItem} />
          ))
        ) : (
          <div>Keine aktuellen Matches gefunden</div>
        )}
      </div>
    </div>
  );
}
