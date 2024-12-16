import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/utils/authContext'
import { Button } from '@/components/ui/button'
import { AuthPopup } from './AuthPopup'
import { Menu } from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between bg-background p-4 shadow">
        <h1 className="text-2xl font-bold">Calendar App</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-4 items-center">
            <NavItems user={user} setIsAuthPopupOpen={setIsAuthPopupOpen} logout={logout} />
          </ul>
        </nav>
        <Button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu />
        </Button>
      </header>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-background p-4 shadow">
          <ul className="flex flex-col space-y-2">
            <NavItems user={user} setIsAuthPopupOpen={setIsAuthPopupOpen} logout={logout} />
          </ul>
        </nav>
      )}
      <main className="flex-1 overflow-hidden">{children}</main>
      <AuthPopup isOpen={isAuthPopupOpen} onClose={() => setIsAuthPopupOpen(false)} />
      <Toaster />
    </div>
  )
}

function NavItems({ user, setIsAuthPopupOpen, logout }) {
  return (
    <>
      <li>
        <Link href="/" className="text-foreground hover:text-primary">
          Home
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/calendar" className="text-foreground hover:text-primary">
              Calendar
            </Link>
          </li>
          <li>
            <Link href="/events" className="text-foreground hover:text-primary">
              Events
            </Link>
          </li>
        </>
      )}
      {user ? (
        <li>
          <Button onClick={logout} variant="outline">
            Log Out
          </Button>
        </li>
      ) : (
        <li>
          <Button onClick={() => setIsAuthPopupOpen(true)}>
            Log In / Sign Up
          </Button>
        </li>
      )}
    </>
  )
}

