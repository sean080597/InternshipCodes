import '@styles/app.scss'
import Provider from '@layouts/Provider'
import Header from '@layouts/Header'

export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts',
}

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Provider>
        <div className="main">
          <div className="gradient"></div>
        </div>
        <main className="container">
          <Header />
          {children}
        </main>
      </Provider>
    </body>
  </html>
)

export default RootLayout
