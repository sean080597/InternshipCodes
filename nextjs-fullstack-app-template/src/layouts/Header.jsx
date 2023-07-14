'use client'
import { useEffect, useState } from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import { getProviders, useSession, signIn, signOut } from 'next-auth/react'

const Header = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState(null)

  useEffect(() => {
    const initProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }

    initProviders()
  }, [])

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">
          <Image src="/assets/images/logo.svg" alt="React Bootstrap logo" width={30} height={30} /> Promptopia
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>

        {/* Desktop Nav */}
        <div className="d-none d-sm-flex gap-3">
          {session?.user ? (
            <div className="d-flex gap-3 gap-md-4">
              <Link href="/create-prompt" className="btn btn-dark rounded-pill">
                Create Post
              </Link>
              <button type="button" className="btn btn-outline-dark" onClick={signOut}>
                Sign Out
              </button>
              <Link href="/profile">
                <Image className="rounded-5" src={session?.user.image} width={35} height={35} alt="profile" />
              </Link>
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((p) => (
                  <button key={p.id} type="button" className="btn btn-dark" onClick={() => signIn(p.id)}>
                    Sign In
                  </button>
                ))}
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="d-flex d-sm-none">
          {session?.user ? (
            <NavDropdown
              id="nav-dropdown"
              className="no-arrow"
              align="end"
              title={<Image className='rounded-5' src={session?.user.image} width={35} height={35} alt="profile" />}
            >
              <NavDropdown.Item eventKey="4.1" href="/profile" className='text-end'>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="4.2" href="/create-prompt" className='text-end'>
                Create Prompt
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="4.3" href="#" className='bg-transparent'>
                <button type="button" className="w-100 btn btn-dark rounded-pill" onClick={signOut}>
                  Sign Out
                </button>
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((p) => (
                  <button key={p.id} type="button" className="btn btn-dark" onClick={() => signIn(p.id)}>
                    Sign In
                  </button>
                ))}
            </>
          )}
        </div>
      </Container>
    </Navbar>
  )
}

export default Header
