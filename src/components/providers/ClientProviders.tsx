"use client";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ErrorBoundary from "./ErrorBoundary";

interface ClientProvidersProps {
  messages: any;
  locale: string;
  children: React.ReactNode;
}

export default function ClientProviders({ messages, locale, children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </LocalizationProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
