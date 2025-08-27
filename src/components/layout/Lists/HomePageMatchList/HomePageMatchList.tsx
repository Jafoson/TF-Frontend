"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./HomePageMatchList.module.scss";
import { SeriesDTO } from "@/types/series";
import SeriesCards from "../../Cards/SeriesCards/SeriesCards";
import { getSeries } from "@/actions/series";
import { useInView } from "react-intersection-observer";
import { SadIcon, ALoadingCircleIcon } from "@/assets/icons";

type HomePageMatchListProps = {
  initialData: SeriesDTO[];
  initialPage: number;
  pageSize: number;
};

function HomePageMatchList({
  initialData,
  initialPage,
  pageSize,
}: HomePageMatchListProps) {
  const [series, setSeries] = useState<SeriesDTO[]>(initialData);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrollTrigger, isInView] = useInView({
    rootMargin: "600px 0px",
    threshold: 0,
  });

  const loadMoreSeries = useCallback(async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const seriesResponse = await getSeries(nextPage, pageSize);
      const series: SeriesDTO[] = seriesResponse.data?.data || [];

      if (series.length < pageSize) {
        setHasMoreData(false);
      }

      setSeries((prevSeries) => [...prevSeries, ...series]);
    } catch (error) {
      console.error("Error loading more series:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, hasMoreData, isLoading]);

  useEffect(() => {
    if (isInView && hasMoreData && !isLoading) {
      loadMoreSeries();
    }
  }, [isInView, hasMoreData, isLoading]);

  return (
    <div className={styles.scrollContainer}>
      {series.length > 0 ? (
        series.map((seriesItem) => (
          <SeriesCards key={seriesItem.id} series={seriesItem} />
        ))
      ) : (
        <div className={styles.noMatches}>
          <SadIcon />
          <p>Keine aktuellen Matches gefunden</p>
        </div>
      )}
      {hasMoreData ? (
        <div ref={scrollTrigger} className={styles.loading}>
          <ALoadingCircleIcon />
          <p>Lade weitere Matches...</p>
        </div>
      ) : (
        <div className={styles.noMatches}>
          <SadIcon />
          <p>Keine weiteren Matches verfügbar</p>
        </div>
      )}
    </div>
  );
}

export default HomePageMatchList;
