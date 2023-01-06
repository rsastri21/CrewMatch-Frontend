import './globals.css';
import NavBar from '../components/NavBar.jsx';

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        <NavBar />
        {children}
        </body>
    </html>
  )
}
