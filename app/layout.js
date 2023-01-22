import './globals.css';
import { SessionProvider } from './SessionContext';

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
