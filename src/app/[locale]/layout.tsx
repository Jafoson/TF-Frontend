import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import "@/style/dark.scss";
import "@/style/light.scss";
import { getMessages } from 'next-intl/server';
import ClientProviders from "@/components/providers/ClientProviders";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <ClientProviders messages={messages} locale={locale}>
        {children}
      </ClientProviders>
    </html>
  );
}
