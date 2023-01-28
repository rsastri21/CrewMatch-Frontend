import './globals.css';
import { SessionProvider } from './SessionContext';
import React from 'react';

export default function RootLayout({ children }) {
  
  return (
    <html>
      <head />
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
        </body>
    </html>
  )
}
