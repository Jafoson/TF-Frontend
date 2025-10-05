import React from 'react'
import styles from './page.module.scss'
import MatchFilters from '@/components/layout/FiltersWrapper/MatchFilters/MatchFilters'
import MatchList from '@/components/layout/Lists/MatchList/MatchList';
import NowChip from '@/components/layout/Chip/NowChip/NowChip';


export default async function MatchOverviewPage() {

  return (
    <div className={styles.container}>
      <MatchFilters />
      <div className={styles.matchesContainer}>
        <MatchList isHomePage={false} />
        <NowChip></NowChip>
      </div>
    </div>
  );
}
