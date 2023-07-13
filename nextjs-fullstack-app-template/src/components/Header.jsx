'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Nav, Navbar } from 'react-bootstrap'

const Header = () => {
  const isLoggedIn = true
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
        <div className="d-none d-sm-flex gap-3">
          {isLoggedIn ? (
            <Link href="/create-prompt" className="btn btn-dark rounded-pill">
              Create Post
            </Link>
          ) : (
            <></>
          )}
        </div>
      </Container>
    </Navbar>
  )
}

export default Header
