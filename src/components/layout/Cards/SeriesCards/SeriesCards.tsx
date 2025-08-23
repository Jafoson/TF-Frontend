"use client";

import { SeriesDTO } from "@/types/series";
import React from "react";
import LogoWrapper from "./atoms/LogoWrapper/LogoWrapper";
import ContentWrapper from "./atoms/ContentWrapper/ContentWrapper";
import styles from "./SeriesCards.module.scss";
import { Link } from "@/i18n/navigation";

interface SeriesCardsProps {
  series: SeriesDTO;
}

function SeriesCards({ series }: SeriesCardsProps) {
  return (
    <Link className={styles.seriesCards} href={`/series/${series.id}`}>
      <LogoWrapper
        logoUrl={series.team1LogoUrl || ""}
        teamName={series.team1Name}
      />
      <ContentWrapper
        winnerId={series.winnerId}
        startDateTime={series.startDateTime}
        status={series.status}
        formatName={series.formatName}
        gameName={series.gameName}
        maxRounds={series.maxRounds}
        tournamentName={series.tournamentName}
        score1={series.score1}
        score2={series.score2}
        team1Id={series.team1Id}
        team2Id={series.team2Id}
      />
      <LogoWrapper
        logoUrl={series.team2LogoUrl || ""}
        teamName={series.team2Name}
      />
    </Link>
  );
}

export default SeriesCards;
