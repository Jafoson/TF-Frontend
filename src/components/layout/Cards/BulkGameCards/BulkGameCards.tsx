import { BulkGameDTO } from "@/types/game";
import React from "react";
import Image from "next/image";
import styles from "./BulkGameCards.module.scss";
import { Link } from "@/i18n/navigation";

interface BulkGameCardsProps {
  game: BulkGameDTO;
}

function BulkGameCards({ game }: BulkGameCardsProps) {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  return (
    <Link className={styles.container} href={`/games/${game.uid}`}>
      <Image
        src={apiURL + "/" + game.imgUrl}
        alt={game.name + " Logo"}
        width={128}
        height={128}
        className={styles.image}
      />
      <div className={styles.content}>
        <h1>{game.name}</h1>
        <p>
          <b>
            Entwickler:{" "}
            {game.developers.map((developer) => developer.name).join(", ")}
          </b>
        </p>

        <p>Mindestalter: {game.ages.map((age) => age.age).join(", ")}</p>
        <p>Release Jahr: {game.publishingYear}</p>
        <p>Genre: {game.genres.map((genre) => genre.name).join(", ")}</p>

        <p>
          Plattformen:{" "}
          {game.platforms.map((platform) => platform.name).join(", ")}
        </p>
      </div>
    </Link>
  );
}

export default BulkGameCards;
