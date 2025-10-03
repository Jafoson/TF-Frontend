"use client";

import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';
import DoubleArrowBackIcon from '@/assets/icons/DoubleArrowBackIcon';
import IconButton from '@/components/atoms/IconButton/IconButton';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './DayPicker.module.scss';
import { useSearchParams, useRouter } from 'next/navigation';
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import PopUp, { PopUpContainer, PopUpTrigger } from '../PopUp/PopUp';
import { dateCalendarSlotProps } from './dateCalendarStyles';

dayjs.extend(isoWeek);

type DayPickerProps = {
  /** Name des Query-Parameters in der URL, z.B. "date" */
  urlKey: string;
};

export default function DayPicker({ urlKey }: DayPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentWeek, setCurrentWeek] = useState(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // ---- URL → State Synchronisierung ----
  useEffect(() => {
    const urlDate = searchParams.get(urlKey);

    if (urlDate) {
      const date = dayjs(urlDate);
      setSelectedDate(date);
      setCurrentWeek(date);
    } else {
      // Falls kein Datum in der URL: Heute setzen
      const params = new URLSearchParams(searchParams.toString());
      params.set(urlKey, today.format("YYYY-MM-DD"));
      router.push(`${window.location.pathname}?${params.toString()}`);
      setSelectedDate(today);
      setCurrentWeek(today);
    }
  }, [searchParams, urlKey, router]);

  // ---- Hilfsfunktion: URL aktualisieren ----
  const updateURL = useCallback((newDate: dayjs.Dayjs) => {
    const params = new URLSearchParams(window.location.search);
    params.set(urlKey, newDate.format("YYYY-MM-DD"));
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [urlKey, router]);

  // ---- Datum ändern ----
  const updateDate = useCallback((newDate: dayjs.Dayjs) => {
    setSelectedDate(newDate);
    updateURL(newDate);
  }, [updateURL]);

  // ---- Datum + Woche ändern ----
  const updateDateAndWeek = useCallback((newDate: dayjs.Dayjs) => {
    setSelectedDate(newDate);
    setCurrentWeek(newDate);
    updateURL(newDate);
  }, [updateURL]);

  // ---- Navigation Buttons ----
  const goToPreviousDay = () => updateDateAndWeek(selectedDate.subtract(1, "day"));
  const goToNextDay = () => updateDateAndWeek(selectedDate.add(1, "day"));
  const goToPreviousWeek = () => updateDateAndWeek(selectedDate.subtract(1, "week"));
  const goToNextWeek = () => updateDateAndWeek(selectedDate.add(1, "week"));

  // ---- Kalenderauswahl ----
  const handleCalendarDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      updateDate(newValue);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ---- Kalender Popup ---- */}
      <PopUp placement="bottom" isOpen={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopUpTrigger>
          <div className={styles.title}>
            <h3>{selectedDate.format("MMMM YYYY")}</h3>
            <ArrowBackIcon className={styles.arrowIcon} />
          </div>
        </PopUpTrigger>

        <PopUpContainer maxWidth={500}>
          <DateCalendar
            value={selectedDate}
            onChange={handleCalendarDateChange}
            openTo="day"
            showDaysOutsideCurrentMonth={false}
            displayWeekNumber
            slotProps={dateCalendarSlotProps}
            sx={{
              "& .MuiDayCalendar-weekNumberLabel, & .MuiDayCalendar-weekNumber": {
                color: "rgba(var(--on-surface-variant), 0.5)",
                fontWeight: 300,
              },
              "& .MuiPickersCalendarHeader-label": {
                color: "var(--on-surface)",
                fontSize: "1rem",
                fontWeight: 600,
              },
            }}
          />
        </PopUpContainer>
      </PopUp>

      {/* ---- Navigation und Tabs ---- */}
      <div className={styles.wrapperContainer}>
        <div className={styles.container}>
          <IconButton
            className={styles.iconButton}
            icon={DoubleArrowBackIcon}
            variant="text"
            iconSize={24}
            onClick={goToPreviousWeek}
          />
          <IconButton
            icon={ArrowBackIcon}
            variant="text"
            iconSize={24}
            onClick={goToPreviousDay}
          />
        </div>

        <DayPickerTabWrapper
          selectedDate={selectedDate}
          currentWeek={currentWeek}
          onDateChange={updateDate}
        />

        <div className={styles.container}>
          <IconButton
            rotate={180}
            icon={ArrowBackIcon}
            variant="text"
            iconSize={24}
            onClick={goToNextDay}
          />
          <IconButton
            className={styles.iconButton}
            rotate={180}
            icon={DoubleArrowBackIcon}
            variant="text"
            iconSize={24}
            onClick={goToNextWeek}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------- Tabs für die Wochentage ---------------------- */

interface DayPickerTabWrapperProps {
  selectedDate: dayjs.Dayjs;
  currentWeek: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs) => void;
}

function DayPickerTabWrapper({ selectedDate, currentWeek, onDateChange }: DayPickerTabWrapperProps) {
  const startOfWeek = currentWeek.startOf("isoWeek");
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

  return (
    <div className={styles.dayWrapper}>
      {weekDays.map((day) => (
        <DayPickerTab
          key={day.format("YYYY-MM-DD")}
          day={day}
          isToday={day.isSame(dayjs(), "day")}
          isSelected={day.isSame(selectedDate, "day")}
          onClick={() => onDateChange(day)}
        />
      ))}
    </div>
  );
}

interface DayPickerTabProps {
  day: dayjs.Dayjs;
  isToday?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function DayPickerTab({ day, isToday, isSelected, onClick }: DayPickerTabProps) {
  return (
    <div
      className={`${styles.dayTab} ${isToday ? styles.today : ""} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <h4>{day.format("DD")}</h4>
      <h6>{day.format("ddd")}</h6>
    </div>
  );
}
