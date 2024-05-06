import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import cx from 'classnames';
import { sfPro, inter } from './fonts';

export const metadata: Metadata = {
  title: 'Youtube University',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <meta
            name="viewport"
            content="width=device-width, user-scalable=no"
          />
          <link
            rel="icon"
            href="/icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
          <link
            rel="apple-touch-icon"
            href="/apple-icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
        </head>
        <body className={cx(sfPro.variable, inter.variable)}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
