import React from "react";
import { getSeries } from "@/actions/series";
import styles from "./page.module.scss";
import { Metadata } from "next";
import MatchList from "@/components/layout/Lists/MatchList/MatchList";
import { StatusEnum } from "@/enum/statusEnum";
import { formatDateForApi } from "@/utils/formatingDate";
import { SortMatchEnum } from "@/enum/sortMatchEnum";
import { SortDirectionEnum } from "@/enum/sortDirectionEnum";

// Diese Funktion wird serverseitig ausgeführt
async function getData() {
  const seriesResponse = await getSeries({ page: 0, size: 10, from: formatDateForApi(new Date(Date.now()+ 30 * 60 * 1000)), duration: 'past', sort: SortMatchEnum.START_DATE, order: SortDirectionEnum.DESC, status: [StatusEnum.PENDING, StatusEnum.RUNNING, StatusEnum.FINISHED] });
  const series = seriesResponse.data?.data || [];

  return { series };
}

export const metadata: Metadata = {
  title: "Current Matches | TournamentFox",
  description: "Aktuelle Matches auf TournamentFox",
};

export default async function HomePage() {
  // Serverseitige Datenabfrage
  const { series } = await getData();

  return (
    <div className={styles.homePage}>
      <MatchList
        initialData={series}
        initialPage={0}
        pageSize={10}
        filters={{
          from: formatDateForApi(new Date(Date.now()+ 30 * 60 * 1000)),
          duration: 'past',
          sort: SortMatchEnum.START_DATE,
          order: SortDirectionEnum.DESC,
          status: [StatusEnum.PENDING, StatusEnum.RUNNING, StatusEnum.FINISHED]
        }}
      />
    </div>
  );
}
