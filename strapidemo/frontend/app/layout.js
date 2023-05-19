import '@/styles/globals.css'
import Header from './Header'

export default function RootLayout({ children }) {
  return (
    <html>
      <head></head>
      <body suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  )
}
