'use client';

import './globals.css';
import { SessionProvider } from './SessionContext';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

export default function RootLayout({ children }) {
  
  return (
    <html>
      <head />
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
