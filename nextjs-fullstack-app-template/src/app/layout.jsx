import '@styles/app.scss'

export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts',
}

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <main className="container">{children}</main>
    </body>
  </html>
)

export default RootLayout
