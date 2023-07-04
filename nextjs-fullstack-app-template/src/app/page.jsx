import styles from './page.module.scss'

const Home = () => {
  return (
    <section>
      <h1 className="display-1 fw-bold text-center">
        Discover & Share
        <br className="d-md-none" />
        <span className={`${styles['orange-gradient']} text-center`}> AI-Powered Prompts</span>
      </h1>
      <p className="small text-center">
        Promptopia is an open-source AI prompting tool for modern world to
        discover, create and share creative prompts
      </p>
    </section>
  )
}

export default Home
