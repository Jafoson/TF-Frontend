import { BulkGameDTO } from "@/types/game";
import React from "react";
import Image from "next/image";
import styles from "./BulkGameCards.module.scss";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface BulkGameCardsProps {
  game: BulkGameDTO;
}

function BulkGameCards({ game }: BulkGameCardsProps) {
  const t = useTranslations("bulkGameCards");
  return (
    <Link className={styles.container} href={`/games/${game.slug}`}>
      <Image
        src={"/" + game.imgUrl}
        alt={game.name + " Logo"}
        width={128}
        height={128}
        className={styles.image}
      />
      <div className={styles.content}>
        <h1>{game.name}</h1>
        <p>
          <b>
            {t("developer")}:{" "}
            {game.developers.map((developer) => developer.name).join(", ")}
          </b>
        </p>

        <p>
          {t("age")}: {game.ages.map((age) => age.age).join(", ")}
        </p>
        <p>
          {t("publishingYear")}: {game.publishingYear}
        </p>
        <p>
          {t("genre")}: {game.genres.map((genre) => genre.name).join(", ")}
        </p>

        <p>
          {t("platform")}:{" "}
          {game.platforms.map((platform) => platform.name).join(", ")}
        </p>
      </div>
    </Link>
  );
}

export default BulkGameCards;
