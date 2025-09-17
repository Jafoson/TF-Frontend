import React from 'react'
import PopUp from '../../PopUp/PopUp';
import FilterChips from '@/components/atoms/Chips/FilterChips/FilterChips';
import { SortDirectionEnum } from '@/enum/sortDirectionEnum';
interface SortMenuProps<T extends Record<string, string | number>> {
    variant: "elevated" | "outlined";
    items: T; // Ein Enum oder ein Objekt mit string/number-Werten
    onItemSelected: (item: T[keyof T], sortDirection: SortDirectionEnum) => void;
    defaultSortDirection: SortDirectionEnum;
    defaultSelectedItem: T[keyof T];
    t: (key: string) => string;
  }

export default function SortMenu<T extends Record<string, string | number>>({ variant, items, onItemSelected, defaultSortDirection, defaultSelectedItem, t }: SortMenuProps<T>) {
    const [selectedSortDirection, setSelectedSortDirection] = React.useState<SortDirectionEnum>(defaultSortDirection);
    const [selectedItem, setSelectedItem] = React.useState<T[keyof T] | null>(defaultSelectedItem);

    const handleItemClick = (item: T[keyof T], direction: SortDirectionEnum) => {
        setSelectedItem(item);
        setSelectedSortDirection(direction);
        onItemSelected(item, direction);
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
