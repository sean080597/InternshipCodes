import Header from '@components/Header'
import '@styles/app.scss'

export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts',
}

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <div className="main">
        <div className="gradient"></div>
      </div>
      <main className="container">
        <Header />
        {children}
      </main>
    </body>
  </html>
)

export default RootLayout
