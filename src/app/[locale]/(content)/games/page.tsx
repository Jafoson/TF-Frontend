import GameFilters from "@/components/layout/FiltersWrapper/GameFilters/GameFilters";
import styles from "./page.module.scss";
import GamesList from "@/components/layout/Lists/GamesList/GamesList";

// Server Component
export default async function GamesPage() {
  return (
    <div className={styles.container}>
      <GameFilters />
      <div className={styles.gamesContainer}>
        <GamesList />
      </div>
    </div>
  );
}
