import React from 'react'
import styles from './page.module.scss'
import MatchFilters from '@/components/layout/FiltersWrapper/MatchFilters/MatchFilters'
import MatchList from '@/components/layout/Lists/MatchList/MatchList';


export default async function MatchOverviewPage() {

  return (
    <div className={styles.matchesContainer}>
      <MatchFilters />
      <div className={styles.matchesContainer}>
        <MatchList isHomePage={false} />
      </div>
    </div>
  );
}
