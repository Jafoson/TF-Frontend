'use client'	

import React, { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { ALoadingCircleIcon, SadIcon } from '@/assets/icons'
import styles from '../MatchList.module.scss'
import { BulkSeriesParams, SeriesDTO } from '@/types/series'
import { GameDTO } from '@/types/game'
import SeriesCards from '@/components/layout/Cards/SeriesCards/SeriesCards'
import { getSeries } from '@/actions/series'
import { ResponseError } from '@/types/response'

interface RenderListProps {
  series: SeriesDTO[]
  filters: BulkSeriesParams
  games: GameDTO[]
  isLoadingGames: boolean
  onLoadGameDetails: (seriesData: SeriesDTO[], isAppend?: boolean) => void
}

function RenderList({ series: initialSeries, filters, games, onLoadGameDetails }: RenderListProps) {
  const [series, setSeries] = useState<SeriesDTO[]>(initialSeries || [])

  // Da SeriesDTO bereits gameName hat, verwenden wir das direkt
  // Die Games werden nur für zusätzliche Informationen geladen
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  const loadMoreSeries = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = currentPage + 1
      const params: BulkSeriesParams = {
        ...filters,
        page: nextPage,
        size: filters.size || 20,
      }

      const result = await getSeries(params)

      if (result.success && result.data) {
        // result.data ist jetzt PaginationResponseDTO<SeriesDTO[]>
        const newSeries = result.data.data || []
        setSeries(prev => [...prev, ...newSeries])
        setHasMore(newSeries.length === (filters.size || 20))
        setCurrentPage(nextPage)
        
        // Lade Game-Details für die neuen Series (append = true)
        onLoadGameDetails(newSeries, true)
      } else {
        setError((result as ResponseError).errors?.[0]?.code || 'Error loading series')
        setHasMore(false)
      }
    } catch (err) {
      setError('Fehler beim Laden der Series')
      setHasMore(false)
      console.error('Error loading more series:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters, currentPage, isLoading, hasMore])

  // Load more when intersection observer triggers
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreSeries()
    }
  }, [inView, hasMore, isLoading, loadMoreSeries])

  // Reset when filters change
  useEffect(() => {
    setSeries(initialSeries || [])
    setCurrentPage(0)
    setHasMore((initialSeries || []).length === (filters.size || 20))
    setError(null)
  }, [JSON.stringify(filters), initialSeries])

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <SadIcon className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    )
  }

  if (series.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <p>Keine Series gefunden</p>
      </div>
    )
  }

  return (
    <>
        {series.map((series) => (
          <SeriesCards 
            key={series.id} 
            series={series} 
            games={games}
          />
        ))}
      
      {hasMore && (
        <div ref={ref} className={styles.loadingTrigger}>
          {isLoading && (
            <div className={styles.loadingContainer}>
              <ALoadingCircleIcon className={styles.loadingIcon} />
              <p>Weitere Series werden geladen...</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RenderList