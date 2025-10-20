import GameFilters from "@/components/layout/FiltersWrapper/GameFilters/GameFilters";
import styles from "./page.module.scss";
import TeamList from "@/components/layout/Lists/TeamList";
// Server Component
export default async function TeamPage() {
  return (
    <div className={styles.container}>
      <GameFilters />
      <div className={styles.teamContainer}>
        <TeamList />
      </div>
    </div>
  );
}
