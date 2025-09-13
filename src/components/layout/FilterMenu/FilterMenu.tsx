import React, {useEffect, useCallback} from "react";
import PopUp from "../PopUp/PopUp";
import FilterChips from "@/components/atoms/Chips/FilterChips/FilterChips";
import {FilterItem, FilterRequestDTO} from "@/types/filter";
import {ActionResponse} from "@/types/response";
import {PaginationResponseDTO} from "@/types/pagination";
import TextInput from "@/components/atoms/inputs/TextInput/TextInput";
import { ALoadingCircleIcon, ALoadingIcon, SearchIcon } from "@/assets/icons";
import styles from "./FilterMenu.module.scss";
import { useInView } from "react-intersection-observer";

type FilterMenuProps = {
    serverAction: (params: FilterRequestDTO) => Promise<ActionResponse<PaginationResponseDTO<FilterItem[]>>>;
    label: string;
    variant: "elevated" | "outlined";
    onLoading: (loading: boolean) => void;
    onItemSelected: (item: FilterItem[]) => void;
    multiple?: boolean; // Ob mehrere Items ausgewählt werden können
};

function FilterMenu({ label, variant, onItemSelected, onLoading, serverAction, multiple = false }: FilterMenuProps) {
    const [initialLoading, setInitialLoading] = React.useState(false);
    const [onOpenChange, setOpenChange] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<FilterItem[] | []>([]);
    const [search, setSearch] = React.useState("");
    const [items, setItems] = React.useState<FilterItem[]>([]);
    const [allItems, setAllItems] = React.useState<FilterItem[]>([]); // Alle geladenen Items für Client-Suche
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [isClientSearchMode, setIsClientSearchMode] = React.useState<boolean>(false); // Einmalig gesetzt
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = React.useState<boolean>(false); // Ob bereits initial geladen wurde
    const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout | null>(null);
    const [currentPage, setCurrentPage] = React.useState<number>(0); // Aktuelle Seite für Pagination
    const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false); // Loading für weitere Seiten
    const [hasMorePages, setHasMorePages] = React.useState<boolean>(true); // Ob noch weitere Seiten verfügbar sind
    const [scrollTrigger, isInView] = useInView({
      rootMargin: "150px 0px",
      threshold: 0,
    });

    const fetchItems = useCallback(async (searchTerm: string = "", isInitialLoad: boolean = false, page: number = 0, append: boolean = false) => {
        console.log("fetchItems called with searchTerm:", searchTerm, "isInitialLoad:", isInitialLoad, "page:", page, "append:", append);
        
        // Nur beim initialen Laden den Loading-Status anzeigen
        if (isInitialLoad) {
            setInitialLoading(true);
            onLoading(true);
        } else if (append) {
            // Loading für weitere Seiten
            setIsLoadingMore(true);
        }
        
        // Lösche die bisherige Liste sofort (nur bei Suche, nicht beim initialen Laden)
        if (!isInitialLoad && !append) {
            setItems([]);
        }
        
        const params: FilterRequestDTO = {
            page: page,
            size: 20,
            search: searchTerm
        };
        
        console.log("Calling serverAction with params:", params);
        const response = await serverAction(params);
        console.log("Server response:", response);
        
        if (response.success && response.data) {
            // response.data.data ist FilterItem[][] (Array von Arrays)
            // Wir brauchen aber FilterItem[] (ein flaches Array)
            const newItems = response.data.data.flat() || [];
            console.log("Setting items:", newItems);
            
            // Setze totalPages nur beim ersten Laden (wenn noch nicht gesetzt)
            if (totalPages === 0) {
                setTotalPages(response.data.totalPages || 0);
                
                // Wenn es nur eine Seite gibt, aktiviere Client-Suche Modus
                if (response.data.totalPages === 1) {
                    setIsClientSearchMode(true);
                    setAllItems(newItems);
                    console.log("Client search mode activated (totalPages = 1)");
                }
            }
            
            // Prüfe ob noch weitere Seiten verfügbar sind
            const nextPage = page + 1;
            setHasMorePages(nextPage < (response.data.totalPages || 0));
            
            if (append) {
                // Füge neue Items zu den bestehenden hinzu
                setItems(prevItems => [...prevItems, ...newItems]);
            } else {
                // Ersetze die Liste komplett mit den neuen Ergebnissen
                setItems(newItems);
            }
        }
        
        // Nur beim initialen Laden den Loading-Status zurücksetzen
        if (isInitialLoad) {
            onLoading(false);
            setInitialLoading(false);
            setHasInitiallyLoaded(true); // Markiere als initial geladen
        } else if (append) {
            setIsLoadingMore(false);
        }
    }, [serverAction, onLoading, totalPages]);

    // Client-seitige Suche Funktion
    const performClientSearch = useCallback((searchTerm: string) => {
        console.log("Performing client-side search with term:", searchTerm);
        
        if (!searchTerm.trim()) {
            // Leere Suche = alle Items anzeigen
            setItems(allItems);
        } else {
            // Filtere Items basierend auf dem Suchbegriff
            const filteredItems = allItems.filter(item => 
                item.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log("Client search results:", filteredItems);
            setItems(filteredItems);
        }
    }, [allItems]);

    // Initiale Daten laden nur beim ersten Öffnen des PopUps
    useEffect(() => {
        if (onOpenChange && !hasInitiallyLoaded) {
            // Reset search und lade initiale Daten nur beim ersten Mal
            setSearch("");
            setCurrentPage(0); // Reset page
            setHasMorePages(true); // Reset hasMorePages
            fetchItems("", true, 0, false); // true = initiales Laden
        }
        // Beim erneuten Öffnen wird search NICHT zurückgesetzt
    }, [onOpenChange, hasInitiallyLoaded, fetchItems]);

    // Infinite Scrolling: Lade nächste Seite wenn Scroll-Trigger sichtbar wird
    useEffect(() => {
        if (isInView && hasMorePages && !isLoadingMore && !isClientSearchMode && hasInitiallyLoaded) {
            console.log("Loading next page, current page:", currentPage);
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchItems(search, false, nextPage, true); // true = append to existing items
        }
    }, [isInView, hasMorePages, isLoadingMore, isClientSearchMode, hasInitiallyLoaded, currentPage, search, fetchItems]);

    // Suchfunktionalität mit Debounce
    const handleSearchChange = (value: string) => {
        setSearch(value);
        
        // Reset Pagination bei neuer Suche
        setCurrentPage(0);
        setHasMorePages(true);
        
        // Entscheide zwischen Server- und Client-Suche basierend auf einmalig gesetztem Modus
        if (isClientSearchMode && allItems.length > 0) {
            // Client-seitige Suche - sofort ohne Cooldown
            console.log("Using client-side search (client mode activated) - no cooldown");
            performClientSearch(value);
        } else {
            // Server-seitige Suche - mit Cooldown
            console.log("Using server-side search (server mode) - with cooldown");
            
            // Vorherigen Timeout löschen
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // Neuen Timeout setzen
            const newTimeout = setTimeout(() => {
                console.log("Timeout triggered, search term:", value);
                fetchItems(value, false, 0, false); // false = keine Suche, kein Loading, page 0, nicht append
            }, 500);
            
            setSearchTimeout(newTimeout);
        }
    };

    // Cleanup beim Unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

  return <PopUp onOpenChange={(open) =>{setOpenChange(open)}}>

    <PopUp.Trigger>
      <FilterChips
        label={`${label} ${selectedItem.length > 0 && multiple ? `(${selectedItem.length})` : ""}`}
        hasTrailingIcon
        variant={variant}
        isSelected={selectedItem.length > 0}
      />
    </PopUp.Trigger>
    <PopUp.Container>
      <div className={styles.itemsContainer}>
      <TextInput
        className={styles.searchInput}
        icon={SearchIcon}
        placeholder="Search"
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
      />
        </div>
        <PopUp.ScrollContainer>
        {initialLoading ? <div className={styles.loading}><ALoadingCircleIcon height={20} width={20} color="currentColor"/></div> : 
         items.length === 0 ? <div className={styles.noItems}>No items found</div> : items.map((item) => (
           <PopUp.Property 
             key={item.uid} 
             value={item.uid} 
             closeOnClick={!multiple} // Schließen nur bei Single-Select
             onClick={() =>{
               if (multiple) {
                   // Multi-Select: Item hinzufügen/entfernen, PopUp bleibt offen
                   setSelectedItem((prev) => {
                       const isSelected = prev.find((i) => i.uid === item.uid);
                       const newSelected = isSelected
                           ? prev.filter((i) => i.uid !== item.uid)
                           : [...prev, item];
                       onItemSelected(newSelected);
                       return newSelected;
                   });
               } else {
                   // Single-Select: Nur ein Item auswählen
                   setSelectedItem([item]);
                   onItemSelected([item]);
               }
           }}
           selected={!!selectedItem.find((i) => i.uid === item.uid)} >
          {item.name}
        </PopUp.Property>
      ))}
          {/* Infinite Scroll Trigger - nur anzeigen wenn noch weitere Seiten verfügbar sind */}
          {hasMorePages && !isClientSearchMode && (
            <div ref={scrollTrigger} className={styles.loading}>
              {isLoadingMore ? (
                <ALoadingCircleIcon width={20} height={20} color="currentColor"/>
              ) : (
                <div/>
              )}
            </div>
          )}
        </PopUp.ScrollContainer>
    </PopUp.Container>
  </PopUp>;
}

export default FilterMenu;