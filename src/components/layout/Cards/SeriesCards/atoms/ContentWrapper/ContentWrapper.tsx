import { StatusEnum } from "@/enum/statusEnum";
import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import styles from "./ContentWrapper.module.scss";

interface ContentWrapperProps {
  startDateTime: string;
  status: StatusEnum;
  formatName: string;
  gameName: string ;
  maxRounds: number;
  tournamentName: string;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  team1Id: string;
  team2Id: string;
  t: ReturnType<typeof useTranslations>;
}

function ContentWrapper({
  startDateTime,
  status,
  formatName,
  gameName,
  maxRounds,
  tournamentName,
  score1,
  score2,
  winnerId,
  team1Id,
  team2Id,
  t,
}: ContentWrapperProps) {
  const format = useFormatter();
  function TimeContainer() {
    return (
      <div className={styles.timeContainer}>
        <h5>
          {format.dateTime(new Date(startDateTime), { dateStyle: "short" })}
        </h5>
        <h5>
          <b>
            {format.dateTime(new Date(startDateTime), {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {t("clock")}
          </b>
        </h5>
      </div>
    );
  }

  function LiveContainer() {
    return (
      <div className={styles.liveContainer}>
        <h4>
          <b>⏺︎ {t("live")}</b>
        </h4>
      </div>
    );
  }

  function ScoreContainer() {
    return (
      <div className={styles.scoreContainer}>
        {status !== StatusEnum.ABORTED && status !== StatusEnum.CANCELLED && (
          <h2
            className={
              status === StatusEnum.FINISHED && winnerId == team1Id
                ? styles.winner
                : ""
            }
          >
            {score1 ? score1 : "0"}
          </h2>
        )}
        <h3 className={maxRounds === 1 ? styles.game : ""}>
          {maxRounds > 1 ? `Bo${maxRounds}` : ":"}
        </h3>
        {status !== StatusEnum.ABORTED && status !== StatusEnum.CANCELLED && (
          <h2
            className={
              status === StatusEnum.FINISHED && winnerId == team2Id
                ? styles.winner
                : ""
            }
          >
            {score2 ? score2 : "0"}
          </h2>
        )}
      </div>
    );
  }

  function InfoContainer() {
    return (
      <div className={styles.timeContainer}>
        <h5>
          <b className={styles.format}>{formatName}</b>
        </h5>
        <h5>{gameName}</h5>
        {tournamentName && <h5>{tournamentName}</h5>}
      </div>
    );
  }

  return (
    <div className={styles.contentWrapper}>
      {status === StatusEnum.PENDING ? <LiveContainer /> : <TimeContainer />}
      <ScoreContainer />
      <InfoContainer />
    </div>
  );
}

export default ContentWrapper;
