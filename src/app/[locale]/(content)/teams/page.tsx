import styles from "./page.module.scss";
import TeamList from "@/components/layout/Lists/TeamList";
import TeamFilters from "@/components/layout/FiltersWrapper/TeamFilters/TeamFilters";
// Server Component
export default async function TeamPage() {
  return (
    <div className={styles.container}>
      <TeamFilters />
      <div className={styles.teamContainer}>
        <TeamList />
      </div>
    </div>
  );
}
