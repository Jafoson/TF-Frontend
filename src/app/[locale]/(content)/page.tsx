import React from "react";
import { getSeries } from "@/actions/series";
import { getGamesBatch } from "@/actions/game";
import styles from "./page.module.scss";
import { Metadata } from "next";
import HomePageMatchList from "@/components/layout/Lists/HomePageMatchList/HomePageMatchList";
import { GameDTO } from "@/types/game";

// Diese Funktion wird serverseitig ausgeführt
async function getData() {
  const seriesResponse = await getSeries(0, 10);
  const series = seriesResponse.data?.data || [];

  // Extrahiere alle einzigartigen gameIds aus den Series
  const gameIds = [...new Set(series.map((s) => s.gameName))].filter(Boolean);

  // Lade Game-Daten wenn gameIds vorhanden sind
  let games: GameDTO[] = [];
  if (gameIds.length > 0) {
    const gamesResponse = await getGamesBatch(gameIds);
    games = gamesResponse.success ? gamesResponse.data || [] : [];
  }

  return { series, games };
}

export const metadata: Metadata = {
  title: "Current Matches | TournamentFox",
  description: "Aktuelle Matches auf TournamentFox",
};

export default async function HomePage() {
  // Serverseitige Datenabfrage
  const { series, games } = await getData();

  return (
    <div className={styles.homePage}>
      <HomePageMatchList
        initialData={series}
        initialGames={games}
        initialPage={0}
        pageSize={10}
      />
    </div>
  );
}
