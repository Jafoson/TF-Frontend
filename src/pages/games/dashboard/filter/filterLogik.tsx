"use client";

import { useState, useEffect } from "react";
import FilterChips from "@/components/atoms/Chips/FilterChips/FilterChips";
import FilterChipsWrapper from "@/components/layout/Wrapper/FilterChipsWrapper/FilterChipsWrapper";
import PopUp from "@/components/layout/PopUp/PopUp";
import {
  getAllGenres,
  getAllAgeRatings,
  getAllPlatforms,
  getAllPublishYears,
} from "@/actions/game";
import type {
  GenreDTO,
  AgeRatingDTO,
  PlatformDTO,
  BulkGamesParams,
} from "@/types/game";

type GameFiltersProps = {
  onFiltersChange: (filters: BulkGamesParams) => void;
};

const GameFilters: React.FC<GameFiltersProps> = ({ onFiltersChange }) => {
  // Genre State
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [isGenrePopUpOpen, setIsGenrePopUpOpen] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);

  // Age Rating State
  const [ageRatings, setAgeRatings] = useState<AgeRatingDTO[]>([]);
  const [isAgeRatingPopUpOpen, setIsAgeRatingPopUpOpen] = useState(false);
  const [isLoadingAgeRatings, setIsLoadingAgeRatings] = useState(false);

  // Platform State
  const [platforms, setPlatforms] = useState<PlatformDTO[]>([]);
  const [isPlatformPopUpOpen, setIsPlatformPopUpOpen] = useState(false);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);

  // Publishing Year State
  const [publishYears, setPublishYears] = useState<number[]>([]);
  const [isPublishYearPopUpOpen, setIsPublishYearPopUpOpen] = useState(false);
  const [isLoadingPublishYears, setIsLoadingPublishYears] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPublishYear, setSelectedPublishYear] = useState<
    number | undefined
  >();

  const [sortBy, setSortBy] = useState<BulkGamesParams["sortBy"]>();
  const [sortDirection, setSortDirection] =
    useState<BulkGamesParams["sortDirection"]>("asc");

  // Genre-Daten laden wenn PopUp geöffnet wird
  useEffect(() => {
    if (isGenrePopUpOpen && genres.length === 0 && !isLoadingGenres) {
      loadGenres();
    }
  }, [isGenrePopUpOpen, genres.length, isLoadingGenres]);

  // Age Rating-Daten laden wenn PopUp geöffnet wird
  useEffect(() => {
    if (
      isAgeRatingPopUpOpen &&
      ageRatings.length === 0 &&
      !isLoadingAgeRatings
    ) {
      loadAgeRatings();
    }
  }, [isAgeRatingPopUpOpen, ageRatings.length, isLoadingAgeRatings]);

  // Platform-Daten laden wenn PopUp geöffnet wird
  useEffect(() => {
    if (isPlatformPopUpOpen && platforms.length === 0 && !isLoadingPlatforms) {
      loadPlatforms();
    }
  }, [isPlatformPopUpOpen, platforms.length, isLoadingPlatforms]);

  // Publishing Year-Daten laden wenn PopUp geöffnet wird
  useEffect(() => {
    if (
      isPublishYearPopUpOpen &&
      publishYears.length === 0 &&
      !isLoadingPublishYears
    ) {
      loadPublishYears();
    }
  }, [isPublishYearPopUpOpen, publishYears.length, isLoadingPublishYears]);

  // Filter aktualisieren und Parent benachrichtigen
  useEffect(() => {
    const newFilters: BulkGamesParams = {
      genreIds: selectedGenres.length > 0 ? selectedGenres : undefined,
      ageIds: selectedAgeRatings.length > 0 ? selectedAgeRatings : undefined,
      platformIds: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
      publishingYear: selectedPublishYear,
      sortBy,
      sortDirection,
    };

    // Entferne undefined Werte
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, value]) => value !== undefined)
    ) as BulkGamesParams;

    onFiltersChange(cleanedFilters);
  }, [
    selectedGenres,
    selectedAgeRatings,
    selectedPlatforms,
    selectedPublishYear,
    sortBy,
    sortDirection,
  ]);

  const loadGenres = async () => {
    setIsLoadingGenres(true);
    try {
      const result = await getAllGenres();
      if (result.success && result.data) {
        setGenres(result.data);
      } else {
        console.error("Fehler beim Laden der Genres:", result.code);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Genres:", error);
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const loadAgeRatings = async () => {
    setIsLoadingAgeRatings(true);
    try {
      const result = await getAllAgeRatings();
      if (result.success && result.data) {
        setAgeRatings(result.data);
      } else {
        console.error("Fehler beim Laden der Altersfreigaben:", result.code);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Altersfreigaben:", error);
    } finally {
      setIsLoadingAgeRatings(false);
    }
  };

  const loadPlatforms = async () => {
    setIsLoadingPlatforms(true);
    try {
      const result = await getAllPlatforms();
      if (result.success && result.data) {
        setPlatforms(result.data);
      } else {
        console.error("Fehler beim Laden der Plattformen:", result.code);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Plattformen:", error);
    } finally {
      setIsLoadingPlatforms(false);
    }
  };

  const loadPublishYears = async () => {
    setIsLoadingPublishYears(true);
    try {
      const result = await getAllPublishYears();
      if (result.success && result.data) {
        setPublishYears(result.data);
      } else {
        console.error(
          "Fehler beim Laden der Veröffentlichungsjahre:",
          result.code
        );
      }
    } catch (error) {
      console.error("Fehler beim Laden der Veröffentlichungsjahre:", error);
    } finally {
      setIsLoadingPublishYears(false);
    }
  };

  const handleGenreSelect = (genreId: string, genreName: string) => {
    console.log("Genre ausgewählt:", { id: genreId, name: genreName });

    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        // Genre entfernen wenn bereits ausgewählt
        return prev.filter((id) => id !== genreId);
      } else {
        // Genre hinzufügen
        return [...prev, genreId];
      }
    });
  };

  const handleAgeRatingSelect = (
    ageRatingId: string,
    ageRatingDescription: string
  ) => {
    console.log("Altersfreigabe ausgewählt:", {
      id: ageRatingId,
      description: ageRatingDescription,
    });

    setSelectedAgeRatings((prev) => {
      if (prev.includes(ageRatingId)) {
        // Age Rating entfernen wenn bereits ausgewählt
        return prev.filter((id) => id !== ageRatingId);
      } else {
        // Age Rating hinzufügen
        return [...prev, ageRatingId];
      }
    });
  };

  const handlePlatformSelect = (platformId: string, platformName: string) => {
    console.log("Plattform ausgewählt:", {
      id: platformId,
      name: platformName,
    });

    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        // Platform entfernen wenn bereits ausgewählt
        return prev.filter((id) => id !== platformId);
      } else {
        // Platform hinzufügen
        return [...prev, platformId];
      }
    });
  };

  const handlePublishYearSelect = (year: number) => {
    console.log("Veröffentlichungsjahr ausgewählt:", year);

    if (selectedPublishYear === year) {
      // Jahr entfernen wenn bereits ausgewählt
      setSelectedPublishYear(undefined);
    } else {
      // Jahr setzen
      setSelectedPublishYear(year);
    }
  };

  const handleSortSelect = (sortField: BulkGamesParams["sortBy"]) => {
    if (sortBy === sortField) {
      // Toggle sort direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Set new sort field with ascending direction
      setSortBy(sortField);
      setSortDirection("asc");
    }
  };

  return (
    <FilterChipsWrapper>
      {/* Age Rating Filter */}
      <PopUp onOpenChange={(open) => setIsAgeRatingPopUpOpen(open)}>
        <PopUp.Trigger>
          <FilterChips
            label={
              selectedAgeRatings.length > 0
                ? `Age Rating (${selectedAgeRatings.length})`
                : "Age Rating"
            }
            hasTrailingIcon
            variant="elevated"
          />
        </PopUp.Trigger>
        <PopUp.Container>
          {isLoadingAgeRatings ? (
            <PopUp.Property>Lade Altersfreigaben...</PopUp.Property>
          ) : (
            ageRatings.map((ageRating) => (
              <PopUp.Property
                key={ageRating.uid}
                value={ageRating.uid}
                onClick={() =>
                  handleAgeRatingSelect(ageRating.uid, ageRating.description)
                }
              >
                {selectedAgeRatings.includes(ageRating.uid)
                  ? `✓ ${ageRating.description}`
                  : ageRating.description}
              </PopUp.Property>
            ))
          )}
        </PopUp.Container>
      </PopUp>

      {/* Genre Filter */}
      <PopUp onOpenChange={(open) => setIsGenrePopUpOpen(open)}>
        <PopUp.Trigger>
          <FilterChips
            label={
              selectedGenres.length > 0
                ? `Genre (${selectedGenres.length})`
                : "Genre"
            }
            hasTrailingIcon
            variant="elevated"
          />
        </PopUp.Trigger>
        <PopUp.Container>
          {isLoadingGenres ? (
            <PopUp.Property>Lade Genres...</PopUp.Property>
          ) : (
            genres.map((genre) => (
              <PopUp.Property
                key={genre.uid}
                value={genre.uid}
                onClick={() => handleGenreSelect(genre.uid, genre.name)}
              >
                {selectedGenres.includes(genre.uid)
                  ? `✓ ${genre.name}`
                  : genre.name}
              </PopUp.Property>
            ))
          )}
        </PopUp.Container>
      </PopUp>

      {/* Platform Filter */}
      <PopUp onOpenChange={(open) => setIsPlatformPopUpOpen(open)}>
        <PopUp.Trigger>
          <FilterChips
            label={
              selectedPlatforms.length > 0
                ? `Platform (${selectedPlatforms.length})`
                : "Platform"
            }
            hasTrailingIcon
            variant="elevated"
          />
        </PopUp.Trigger>
        <PopUp.Container>
          {isLoadingPlatforms ? (
            <PopUp.Property>Lade Plattformen...</PopUp.Property>
          ) : (
            platforms.map((platform) => (
              <PopUp.Property
                key={platform.uid}
                value={platform.uid}
                onClick={() =>
                  handlePlatformSelect(platform.uid, platform.name)
                }
              >
                {selectedPlatforms.includes(platform.uid)
                  ? `✓ ${platform.name}`
                  : platform.name}
              </PopUp.Property>
            ))
          )}
        </PopUp.Container>
      </PopUp>

      {/* Publishing Year Filter */}
      <PopUp onOpenChange={(open) => setIsPublishYearPopUpOpen(open)}>
        <PopUp.Trigger>
          <FilterChips
            label={
              selectedPublishYear
                ? `Release Date (${selectedPublishYear})`
                : "Release Date"
            }
            hasTrailingIcon
            variant="elevated"
          />
        </PopUp.Trigger>
        <PopUp.Container>
          {isLoadingPublishYears ? (
            <PopUp.Property>Lade Veröffentlichungsjahre...</PopUp.Property>
          ) : (
            publishYears.map((year) => (
              <PopUp.Property
                key={year}
                value={year.toString()}
                onClick={() => handlePublishYearSelect(year)}
              >
                {selectedPublishYear === year ? `✓ ${year}` : year}
              </PopUp.Property>
            ))
          )}
        </PopUp.Container>
      </PopUp>

      {/* Sort Filter */}
      <FilterChipsWrapper.Actions>
        <PopUp>
          <PopUp.Trigger>
            <FilterChips
              label={
                sortBy ? `Sort by ${sortBy} (${sortDirection})` : "Sort by"
              }
              hasTrailingIcon
              variant="outlined"
            />
          </PopUp.Trigger>
          <PopUp.Container>
            <PopUp.Property onClick={() => handleSortSelect("gameName")}>
              {sortBy === "gameName"
                ? `✓ Game Name (${sortDirection})`
                : "Game Name"}
            </PopUp.Property>
            <PopUp.Property onClick={() => handleSortSelect("publishingYear")}>
              {sortBy === "publishingYear"
                ? `✓ Publishing Year (${sortDirection})`
                : "Publishing Year"}
            </PopUp.Property>
            <PopUp.Property onClick={() => handleSortSelect("genre")}>
              {sortBy === "genre" ? `✓ Genre (${sortDirection})` : "Genre"}
            </PopUp.Property>
            <PopUp.Property onClick={() => handleSortSelect("developer")}>
              {sortBy === "developer"
                ? `✓ Developer (${sortDirection})`
                : "Developer"}
            </PopUp.Property>
            <PopUp.Property onClick={() => handleSortSelect("age")}>
              {sortBy === "age"
                ? `✓ Age Rating (${sortDirection})`
                : "Age Rating"}
            </PopUp.Property>
            <PopUp.Property onClick={() => handleSortSelect("platform")}>
              {sortBy === "platform"
                ? `✓ Platform (${sortDirection})`
                : "Platform"}
            </PopUp.Property>
          </PopUp.Container>
        </PopUp>
      </FilterChipsWrapper.Actions>
    </FilterChipsWrapper>
  );
};

export default GameFilters;
