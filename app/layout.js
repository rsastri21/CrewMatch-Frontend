import './globals.css';
import NavBar from '../components/NavBar.jsx';

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        <SessionProvider>
          <NavBar />
          {children}
        </SessionProvider>
        </body>
    </html>
  )
}
