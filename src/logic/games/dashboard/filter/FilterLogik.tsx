"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useTranslations } from "next-intl";
import styles from "./filterLogik.module.scss";
import { FilterIcon } from "@/assets/icons";

type GameFiltersProps = {
  onFiltersChange: (filters: BulkGamesParams) => void;
};

const GameFilters: React.FC<GameFiltersProps> = ({ onFiltersChange }) => {
  const t = useTranslations("gameFilters");

  const [expanded, setExpanded] = useState(false);

  // Memoize onFiltersChange um useEffect Dependencies zu stabilisieren
  const memoizedOnFiltersChange = useCallback(onFiltersChange, [
    onFiltersChange,
  ]);

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

    memoizedOnFiltersChange(cleanedFilters);
  }, [
    selectedGenres,
    selectedAgeRatings,
    selectedPlatforms,
    selectedPublishYear,
    sortBy,
    sortDirection,
    memoizedOnFiltersChange,
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

  const sortingFilter = () => {
    return (
      <PopUp>
        <PopUp.Trigger>
          <FilterChips
            label={
              sortBy
                ? `${t("sortBy")} ${t(`${sortBy}`)} (${t(`${sortDirection}`)})`
                : t("sortBy")
            }
            hasTrailingIcon
            variant="outlined"
          />
        </PopUp.Trigger>
        <PopUp.Container>
          <PopUp.Property onClick={() => handleSortSelect("gameName")}>
            {sortBy === "gameName"
              ? `✓ ${t("gameName")} (${t(`${sortDirection}`)})`
              : t("gameName")}
          </PopUp.Property>
          <PopUp.Property onClick={() => handleSortSelect("publishingYear")}>
            {sortBy === "publishingYear"
              ? `✓ ${t("publishingYear")} (${t(`${sortDirection}`)})`
              : t("publishingYear")}
          </PopUp.Property>
          <PopUp.Property onClick={() => handleSortSelect("genre")}>
            {sortBy === "genre"
              ? `✓ ${t("genre")} (${t(`${sortDirection}`)})`
              : t("genre")}
          </PopUp.Property>
          <PopUp.Property onClick={() => handleSortSelect("developer")}>
            {sortBy === "developer"
              ? `✓ ${t("developer")} (${t(`${sortDirection}`)})`
              : t("developer")}
          </PopUp.Property>
          <PopUp.Property onClick={() => handleSortSelect("age")}>
            {sortBy === "age"
              ? `✓ ${t("ageRating")} (${t(`${sortDirection}`)})`
              : t("ageRating")}
          </PopUp.Property>
          <PopUp.Property onClick={() => handleSortSelect("platform")}>
            {sortBy === "platform"
              ? `✓ ${t("platform")} (${t(`${sortDirection}`)})`
              : t("platform")}
          </PopUp.Property>
        </PopUp.Container>
      </PopUp>
    );
  };

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.filterHeader} data-expanded={expanded}>
        <FilterChips
          label={t("filter")}
          hasTrailingIcon
          variant="elevated"
          icon={FilterIcon}
          onClick={() => setExpanded(!expanded)}
        />
        {sortingFilter()}
      </div>
      <div className={styles.filterContainer} data-expanded={expanded}>
        <FilterChipsWrapper>
          {/* Age Rating Filter */}
          <PopUp onOpenChange={(open) => setIsAgeRatingPopUpOpen(open)}>
            <PopUp.Trigger>
              <FilterChips
                label={
                  selectedAgeRatings.length > 0
                    ? `${t("ageRating")} (${selectedAgeRatings.length})`
                    : t("ageRating")
                }
                hasTrailingIcon
                variant="elevated"
              />
            </PopUp.Trigger>
            <PopUp.Container>
              {isLoadingAgeRatings ? (
                <PopUp.Property>{t("loadingAgeRatings")}</PopUp.Property>
              ) : (
                ageRatings.map((ageRating) => (
                  <PopUp.Property
                    key={ageRating.uid}
                    value={ageRating.uid}
                    onClick={() =>
                      handleAgeRatingSelect(
                        ageRating.uid,
                        ageRating.description
                      )
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
                    ? `${t("genre")} (${selectedGenres.length})`
                    : t("genre")
                }
                hasTrailingIcon
                variant="elevated"
              />
            </PopUp.Trigger>
            <PopUp.Container>
              {isLoadingGenres ? (
                <PopUp.Property>{t("loadingGenres")}</PopUp.Property>
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
                    ? `${t("platform")} (${selectedPlatforms.length})`
                    : t("platform")
                }
                hasTrailingIcon
                variant="elevated"
              />
            </PopUp.Trigger>
            <PopUp.Container>
              {isLoadingPlatforms ? (
                <PopUp.Property>{t("loadingPlatforms")}</PopUp.Property>
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
                    ? `${t("releaseDate")} (${selectedPublishYear})`
                    : t("releaseDate")
                }
                hasTrailingIcon
                variant="elevated"
              />
            </PopUp.Trigger>
            <PopUp.Container>
              {isLoadingPublishYears ? (
                <PopUp.Property>{t("loadingPublishYears")}</PopUp.Property>
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
          <div className={styles.sortFilter}>
            <FilterChipsWrapper.Actions>
              {sortingFilter()}
            </FilterChipsWrapper.Actions>
          </div>
        </FilterChipsWrapper>
      </div>
    </div>
  );
};

export default GameFilters;
