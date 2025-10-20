'use client'	

import React, { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { ALoadingCircleIcon, SadIcon } from '@/assets/icons'
import styles from '../TeamList.module.scss'
import { BulkTeamsParams, TeamBulkDTO } from '@/types/teams'
import { getTeams } from '@/actions/teams'
import BulkTeamCards from '@/components/layout/Cards/BulkTeamCards/BulkTeamCards'

interface RenderListProps {
  teams: TeamBulkDTO[]
  filters: BulkTeamsParams
}

function RenderList({ teams: initialTeams, filters }: RenderListProps) {
  const [teams, setTeams] = useState<TeamBulkDTO[]>(initialTeams || [])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  const loadMoreTeams = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = currentPage + 1
      const params: BulkTeamsParams = {
        ...filters,
        page: nextPage,
        size: filters.size || 20,
      }

      const result = await getTeams(params)
      
      if (result.success && result.data) {
        const newTeams = result.data.data
        setTeams(prev => [...prev, ...newTeams])
        setHasMore(newTeams.length === (filters.size || 20))
        setCurrentPage(nextPage)
      } else {
        setError(result.error || 'Fehler beim Laden der Spiele')
        setHasMore(false)
      }
    } catch (err) {
      setError('Fehler beim Laden der Spiele')
      setHasMore(false)
      console.error('Error loading more games:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters, currentPage, isLoading, hasMore])

  // Load more when intersection observer triggers
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreTeams()
    }
  }, [inView, hasMore, isLoading, loadMoreTeams])

  // Reset when filters change
  useEffect(() => {
    setTeams(initialTeams || [])
    setCurrentPage(0)
    setHasMore((initialTeams || []).length === (filters.size || 20))
    setError(null)
  }, [JSON.stringify(filters), initialTeams])

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <SadIcon className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    )
  }

  if (teams.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <p>Keine Spiele gefunden</p>
      </div>
    )
  }

  return (
    <>
        {teams.map((team) => (
          <BulkTeamCards key={team.uid} team={team} />
        ))}
      
      {hasMore && (
        <div ref={ref} className={styles.loadingTrigger}>
          {isLoading && (
            <div className={styles.loadingContainer}>
              <ALoadingCircleIcon className={styles.loadingIcon} />
              <p>Weitere Teams‚ werden geladen...</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RenderList