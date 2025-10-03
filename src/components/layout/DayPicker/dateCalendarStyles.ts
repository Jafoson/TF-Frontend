import { SxProps, Theme } from '@mui/material';

export const dateCalendarSlotProps = {
  calendarHeader: {
    sx: {
      color: 'rgb(var(--on-surface))',
    } as SxProps<Theme>,
  },
  weekNumber: {
    sx: {
      color: 'rgb(var(--on-surface)) !important',
      backgroundColor: 'rgb(var(--surface)) !important',
      fontSize: '0.75rem !important',
      fontWeight: '500 !important',
      minWidth: '24px !important',
      height: '24px !important',
      display: 'flex !important',
      alignItems: 'center !important',
      justifyContent: 'center !important',
    } as SxProps<Theme>,
  },
  weekNumberLabel: {
    sx: {
      color: 'rgb(var(--on-surface)) !important',
      fontSize: '0.75rem !important',
      fontWeight: '600 !important',
      padding: '8px 4px !important',
    } as SxProps<Theme>,
  },
  weekDayLabel: {
    sx: {
      color: 'rgb(var(--on-surface))',
      fontSize: '0.875rem',
      fontWeight: '500',
    } as SxProps<Theme>,
  },
  day: {
    sx: {
      borderRadius: '6px',
      color: 'rgb(var(--on-surface))',
      "&:hover": {
        backgroundColor: 'rgba(var(--on-surface), 0.12)',
        color: 'rgb(var(--on-surface))',
      },
      "&:active": {
        backgroundColor: 'rgba(var(--on-surface), 0.2)',
        color: 'rgb(var(--on-surface))',
      },
      "&.Mui-selected": {
        backgroundColor: 'rgb(var(--primary))',
        color: 'rgb(var(--on-primary))',
        "&.Mui-selected:hover": {
          backgroundColor: 'rgb(var(--primary))',
          color: 'rgb(var(--on-primary))',
          filter: 'brightness(0.9)',
        },
        "&.Mui-selected:active": {
          backgroundColor: 'rgb(var(--primary))',
          color: 'rgb(var(--on-primary))',
          filter: 'brightness(0.8)',
        },
        "&.Mui-selected:focus": {
          backgroundColor: 'rgb(var(--primary))',
          color: 'rgb(var(--on-primary))',
          filter: 'brightness(0.9)',
        },
        "&.Mui-selected:focus-visible": {
          backgroundColor: 'rgb(var(--primary))',
          color: 'rgb(var(--on-primary))',
          filter: 'brightness(0.9)',
        },
        "&.Mui-selected:disabled": {
          backgroundColor: 'rgb(var(--primary))',
          color: 'rgb(var(--on-primary))',
          filter: 'brightness(0.9)',
        },
      },
    } as SxProps<Theme>,
  },
};
