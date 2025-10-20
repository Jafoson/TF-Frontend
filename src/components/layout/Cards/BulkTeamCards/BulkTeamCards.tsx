import React from "react";
import Image from "next/image";
import styles from "./BulkTeamCards.module.scss";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { TeamBulkDTO } from "@/types/teams";

interface BulkTeamCardsProps {
  team: TeamBulkDTO;
}

function BulkTeamCards({ team }: BulkTeamCardsProps) {
  const t = useTranslations("bulkTeamCards");
  return (
    <Link className={styles.container} href={`/games/${team.uid}/${team.gameId}`}>
      <Image
        src={"/" + team.logoURL}
        alt={team.name + " Logo"}
        width={128}
        height={128}
        className={styles.image}
      />
      <div className={styles.content}>
        <h1>{team.name}</h1>
        <p>
          <b>
            {t("region")}:{" "}
            {team.regionId}
          </b>
        </p>

        <p>
          {t("foundingYear")}: {team.foundingDate}
        </p>
        <p>
          {t("game")}: {team.gameId}
        </p>
      </div>
    </Link>
  );
}

export default BulkTeamCards;
