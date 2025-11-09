'use client'

import React from 'react'
import PopUp from '../../PopUp/PopUp';
import FilterChips from '@/components/atoms/Chips/FilterChips/FilterChips';
import { SortDirectionEnum } from '@/enum/sorting/sortDirectionEnum';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface SortMenuProps<T extends Record<string, string | number>> {
    variant: "elevated" | "outlined";
    items: T; 
    defaultSortDirection: SortDirectionEnum;
    defaultSelectedItem: T[keyof T];
    translationKey: string; // Statt t-Funktion, nur den Translation-Key
  }

export default function SortMenu<T extends Record<string, string | number>>({ variant, items, defaultSortDirection, defaultSelectedItem, translationKey }: SortMenuProps<T>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname()
    const t = useTranslations(translationKey);

    // Ausgewählte Werte aus URL lesen
    const selectedItem = (searchParams.get('sort') as T[keyof T]) || defaultSelectedItem;
    const selectedSortDirection = (searchParams.get('direction') as SortDirectionEnum) || defaultSortDirection;

    // URL aktualisieren
    const updateURL = React.useCallback((item: T[keyof T], direction: SortDirectionEnum) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', item.toString())
        params.set('direction', direction)
  
        const newUrl = `${pathname}?${params.toString()}`
        console.log('SortMenu: Updating URL to:', newUrl)
        // Client-seitige Navigation → löst SSR-Neurendern aus
        router.push(newUrl)
      },
      [pathname, router, searchParams]);

    const handleItemClick = (item: T[keyof T], direction: SortDirectionEnum) => {
        updateURL(item, direction);
        // onItemSelected(item, direction);
      };

  const itemsArray = Object.values(items) as T[keyof T][];
  const sortDirections = Object.values(SortDirectionEnum);
  
  return (
    <PopUp placement='bottom-end'>
        <PopUp.Trigger>
            <FilterChips
                label={`${selectedItem !== null ? `${t(selectedItem.toString())}` : `${t("sort")}`}`}
                variant={variant}
                sortDirection={selectedSortDirection}
                // hasTrailingIcon
            />
        </PopUp.Trigger>
        <PopUp.Container>
            <PopUp.ScrollContainer>
                {itemsArray.map((item) => 
                    sortDirections.map((direction) => (
                        <PopUp.Property 
                            key={`${item.toString()}-${direction}`} 
                            value={`${item.toString()}-${direction}`} 
                            onClick={() => {
                                handleItemClick(item, direction);
                            }}
                            selected={selectedItem === item && selectedSortDirection === direction}
                        >
                            {`${t(item.toString())} (${t(direction.toString())})`}
                        </PopUp.Property>
                    ))
                )}
            </PopUp.ScrollContainer>
        </PopUp.Container>
    </PopUp>
  )
}
