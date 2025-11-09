import React from "react";
import Image from "next/image";
import styles from "./BulkTeamCards.module.scss";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { TeamBulkDTO } from "@/types/teams";
import { GameDTO } from "@/types/game";
import dayjs from "dayjs";

interface BulkTeamCardsProps {
  team: TeamBulkDTO;
  games?: GameDTO[];
  isLoadingGames?: boolean;
}

function BulkTeamCards({ team, games = [], isLoadingGames = false }: BulkTeamCardsProps) {
  const t = useTranslations("bulkTeamCards");
  
  // Finde das entsprechende Game für dieses Team
  const game = games.find(g => g.gameId === team.gameId);
  
  return (
    <Link className={styles.container} href={`/teams/${team.slug}/${games.find(g => g.gameId === team.gameId)?.slug}`}>
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
          {t("foundingYear")}: {dayjs(team.foundingDate).year()}
        </p>
        <p>
          {t("game")}: {isLoadingGames ? "Lädt..." : (game?.gameName || team.gameId)}
        </p>
      </div>
    </Link>
  );
}

export default BulkTeamCards;
