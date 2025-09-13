import React from 'react'
import FilterMenu from "@/components/layout/FilterMenu/FilterMenu";
import {getAllGenres, getAllPublishYears} from "@/actions/game";
import {FilterItem, FilterRequestDTO} from "@/types/filter";
import {ActionResponse} from "@/types/response";
import {PaginationResponseDTO} from "@/types/pagination";

// Fake Server Action für Testzwecke
const fakeServerAction = async (params: FilterRequestDTO): Promise<ActionResponse<PaginationResponseDTO<FilterItem[]>>> => {
    // Simuliere API-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fake Daten
    const fakeData: FilterItem[] = [
        { uid: "1", name: "Action" },
        { uid: "2", name: "Adventure" },
        { uid: "3", name: "RPG" },
        { uid: "4", name: "Strategy" },
        { uid: "5", name: "Simulation" },
        { uid: "6", name: "Sports" },
        { uid: "7", name: "Racing" },
        { uid: "8", name: "Fighting" },
        { uid: "9", name: "Puzzle" },
        { uid: "10", name: "Platformer" },
        { uid: "11", name: "Shooter" },
        { uid: "12", name: "Horror" },
        { uid: "13", name: "Fantasy" },
        { uid: "14", name: "Sci-Fi" },
        { uid: "15", name: "Indie" },
        { uid: "16", name: "2024" },
        { uid: "17", name: "2023" },
        { uid: "18", name: "2022" },
        { uid: "19", name: "2021" },
        { uid: "20", name: "2020" },
        { uid: "21", name: "2019" },
        { uid: "22", name: "2018" },
        { uid: "23", name: "2017" },
        { uid: "24", name: "2016" },
        { uid: "25", name: "2015" },
        { uid: "26", name: "2014" },
        { uid: "27", name: "2013" },
        { uid: "28", name: "2012" },
        { uid: "29", name: "2011" },
        { uid: "30", name: "2010" },
        { uid: "31", name: "2009" },
        { uid: "32", name: "2008" },
        { uid: "33", name: "2007" },
        { uid: "34", name: "2006" },
        { uid: "35", name: "2005" },
        { uid: "36", name: "2004" },
        { uid: "37", name: "2003" },
        { uid: "38", name: "2002" },
        { uid: "39", name: "2001" },
        { uid: "40", name: "2000" },
        { uid: "41", name: "1999" },
        { uid: "42", name: "1998" },
        { uid: "43", name: "1997" },
        { uid: "44", name: "1996" },
        { uid: "45", name: "1995" },
        { uid: "46", name: "1994" },
        { uid: "47", name: "1993" },
        { uid: "48", name: "1992" },
        { uid: "49", name: "1991" },
        { uid: "50", name: "1990" },
        { uid: "51", name: "1989" },
        { uid: "52", name: "1988" },
        { uid: "53", name: "Hallo" },
    ];
    
    // Filtere basierend auf Suchbegriff
    let filteredData = fakeData;
    if (params.search && params.search.trim() !== "") {
        filteredData = fakeData.filter(item => 
            item.name.toString().toLowerCase().includes(params.search!.toLowerCase())
        );
    }
    
    // Simuliere Pagination
    const page = params.page || 0;
    const size = params.size || 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
        success: true,
        data: {
            data: [paginatedData], // Als Array von Arrays für PaginationResponseDTO
            page: page,
            size: size,
            totalElements: filteredData.length,
            totalPages: Math.ceil(filteredData.length / size)
        }
    };
};

const FilterLogik = () => {
    const [loading, setLoading] = React.useState(false);
    const [selectedGenres, setSelectedGenres] = React.useState<FilterItem[]>([]);
    const [selectedPublishYears, setSelectedPublishYears] = React.useState<FilterItem[]>([]);
    const [selectedFakeItems, setSelectedFakeItems] = React.useState<FilterItem[]>([]);
    return (
    <div>
        <FilterMenu 
            serverAction={getAllGenres} 
            label="Genre" 
            variant={"elevated"} 
            onLoading={setLoading} 
            onItemSelected={setSelectedGenres}
            multiple={true} // Mehrere Genres können ausgewählt werden
        />
        <FilterMenu 
            serverAction={getAllPublishYears} 
            label="Publish Year" 
            variant={"elevated"} 
            onLoading={setLoading} 
            onItemSelected={setSelectedPublishYears}
            multiple={false} // Single-Select für Jahre
        />
        <FilterMenu 
            serverAction={fakeServerAction} 
            label="Fake Categories" 
            variant={"elevated"} 
            onLoading={setLoading} 
            onItemSelected={setSelectedFakeItems}
            multiple={true} // Multi-Select für Fake Items
        />
    </div>
  )
}

export default FilterLogik