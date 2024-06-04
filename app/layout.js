'use client';

import './globals.css';
import { SessionProvider } from './SessionContext';
import { CSPostHogProvider } from './providers';
import React from 'react';

export default function RootLayout({ children }) {
  
  return (
    <html>
      <head />
      <CSPostHogProvider>
        <body>
          <SessionProvider>
            {children}
          </SessionProvider>
        </body>
      </CSPostHogProvider>
    </html>
  )
}
