'use client'

import React, { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import PopUp from '../PopUp/PopUp'
import FilterChips from '@/components/atoms/Chips/FilterChips/FilterChips'
import TextInput from '@/components/atoms/inputs/TextInput/TextInput'
import { ALoadingCircleIcon, SearchIcon } from '@/assets/icons'
import styles from './FilterMenu.module.scss'

import { FilterItem, FilterRequestDTO } from '@/types/filter'
import { ActionResponse } from '@/types/response'
import { PaginationResponseDTO } from '@/types/pagination'

type FilterMenuProps = {
  className?: string
  serverAction: (params: FilterRequestDTO) => Promise<ActionResponse<PaginationResponseDTO<FilterItem[]>>>
  label: string
  variant: 'elevated' | 'outlined'
  multiple?: boolean
  urlKey: string
}

export default function FilterMenu({
  className,
  serverAction,
  label,
  variant,
  multiple = false,
  urlKey,
}: FilterMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()


  const [items, setItems] = useState<FilterItem[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isClientMode, setIsClientMode] = useState(false)
  const [allItems, setAllItems] = useState<FilterItem[]>([])
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const scrollRef = React.useRef<HTMLDivElement>(null)

  /** Auswahl aus URL lesen */
  const selectedItems = React.useMemo(() => {
    const value = searchParams.get(urlKey)
    if (!value) return []
    return multiple
      ? value.split(',').map(uid => ({ uid, name: '' }))
      : [{ uid: value, name: '' }]
  }, [searchParams, urlKey, multiple])

  /** URL aktualisieren → triggert SSR-Re-Render der Page */
  const updateURL = useCallback(
    (selected: FilterItem[]) => {
      const params = new URLSearchParams(searchParams.toString())

      if (selected.length === 0) {
        params.delete(urlKey)
      } else {
        params.set(
          urlKey,
          multiple ? selected.map(i => i.uid).join(',') : selected[0].uid
        )
      }

      const newUrl = `${pathname}?${params.toString()}`
      console.log('FilterMenu: Updating URL to:', newUrl)
      router.push(newUrl)
    },
    [router, pathname, searchParams, urlKey, multiple]
  )

  /** Serveritems laden */
  const fetchItems = useCallback(
    async (searchTerm = '', pageNum = 0, append = false) => {
      setLoading(true)

      try {
        const response = await serverAction({ page: pageNum, size: 20, search: searchTerm })
        if (response.success && response.data) {
          const newItems = response.data.data.flat()
          if (append) {
            setItems(prev => [...prev, ...newItems])
          } else {
            setItems(newItems)
          }

          // Bei nur einer Seite → Client-Suchmodus
          if (response.data.totalPages === 1) {
            setIsClientMode(true)
            setAllItems(newItems)
          }
          setHasMore(pageNum + 1 < (response.data.totalPages ?? 0))
        } else {
          console.error('FilterMenu fetchItems error:', response)
          setItems([])
        }
      } catch (error) {
        console.error('FilterMenu fetchItems exception:', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [serverAction]
  )

  /** Beim Öffnen initial laden */
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && items.length === 0) {
      fetchItems('', 0, false)
    }
  }

  /** Infinite Scroll Handler */
  const handleScrollToBottom = () => {
    if (hasMore && !isClientMode && !loading) {
      const next = page + 1
      setPage(next)
      fetchItems(search, next, true)
    }
  }

  /** Suche */
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(0)

    if (isClientMode) {
      // Clientseitig filtern
      if (!value) {
        setItems(allItems)
      } else {
        setItems(
          allItems.filter(i =>
            typeof i.name === 'string'
              ? i.name.toLowerCase().includes(value.toLowerCase())
              : i.name.toString().toLowerCase().includes(value.toLowerCase())
          )
        )
      }
    } else {
      // Serversuche mit Debounce
      cleanupSearchTimeout()
      const t = setTimeout(() => fetchItems(value, 0, false), 400)
      setSearchTimeout(t)
    }
  }

  /** Cleanup für Search Timeout */
  const cleanupSearchTimeout = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
      setSearchTimeout(null)
    }
  }

  return (
    <PopUp onOpenChange={handleOpenChange}>
      <PopUp.Trigger className={className}>
        <FilterChips
          label={`${label}${multiple && selectedItems.length ? ` (${selectedItems.length})` : ''}`}
          hasTrailingIcon
          variant={variant}
          isSelected={selectedItems.length > 0}
        />
      </PopUp.Trigger>

      <PopUp.Container>
        <div className={styles.itemsContainer}>
          <TextInput
            className={styles.searchInput}
            icon={SearchIcon}
            placeholder='Search'
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>

        <PopUp.ScrollContainer>
          {loading && items.length === 0 ? (
            <div className={styles.loading}>
              <ALoadingCircleIcon width={20} height={20} color='currentColor' />
            </div>
          ) : items.length === 0 ? (
            <div className={styles.noItems}>No items found</div>
          ) : (
            items.map(item => {
              const isSelected = !!selectedItems.find(i => i.uid === item.uid)
              return (
                <PopUp.Property
                  key={item.uid}
                  value={item.uid}
                  selected={isSelected}
                  closeOnClick={!multiple}
                  onClick={() => {
                    if (multiple) {
                      const newSelected = isSelected
                        ? selectedItems.filter(i => i.uid !== item.uid)
                        : [...selectedItems, item]
                      updateURL(newSelected)
                    } else {
                      updateURL(isSelected ? [] : [item])
                    }
                  }}
                >
                  {item.name}
                </PopUp.Property>
              )
            })
          )}

          {hasMore && !isClientMode && (
            <div 
              ref={scrollRef} 
              className={styles.loading}
              onMouseEnter={handleScrollToBottom}
            >
              {loading && items.length > 0 && (
                <ALoadingCircleIcon width={20} height={20} color='currentColor' />
              )}
            </div>
          )}
        </PopUp.ScrollContainer>
      </PopUp.Container>
    </PopUp>
  )
}