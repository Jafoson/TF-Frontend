'use client'	

import { BulkGameDTO, BulkGamesParams } from '@/types/game'
import React, { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import BulkGameCards from '../../../Cards/BulkGameCards/BulkGameCards'
import { getBulkGames } from '@/actions/game'
import { ALoadingCircleIcon, SadIcon } from '@/assets/icons'
import styles from '../GamesList.module.scss'
import { ResponseError } from '@/types/response'

interface RenderListProps {
  games: BulkGameDTO[]
  filters: BulkGamesParams
}

function RenderList({ games: initialGames, filters }: RenderListProps) {
  const [games, setGames] = useState<BulkGameDTO[]>(initialGames || [])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  const loadMoreGames = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = currentPage + 1
      const params: BulkGamesParams = {
        ...filters,
        page: nextPage,
        size: filters.size || 20,
      }

      const result = await getBulkGames(params)
      
      if (result.success && result.data) {
        const newGames = result.data.data
        setGames(prev => [...prev, ...newGames])
        setHasMore(newGames.length === (filters.size || 20))
        setCurrentPage(nextPage)
      } else {
        setError((result as ResponseError).errors?.[0]?.code || 'Fehler beim Laden der Spiele')
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
      loadMoreGames()
    }
  }, [inView, hasMore, isLoading, loadMoreGames])

  // Reset when filters change
  useEffect(() => {
    setGames(initialGames || [])
    setCurrentPage(0)
    setHasMore((initialGames || []).length === (filters.size || 20))
    setError(null)
  }, [JSON.stringify(filters), initialGames])

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <SadIcon className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    )
  }

  if (games.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <p>Keine Spiele gefunden</p>
      </div>
    )
  }

  return (
    <>
        {games.map((game) => (
          <BulkGameCards key={game.uid} game={game} />
        ))}
      
      {hasMore && (
        <div ref={ref} className={styles.loadingTrigger}>
          {isLoading && (
            <div className={styles.loadingContainer}>
              <ALoadingCircleIcon className={styles.loadingIcon} />
              <p>Weitere Spiele werden geladen...</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RenderList