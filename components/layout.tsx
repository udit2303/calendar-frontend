import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/utils/authContext'
import { Button } from '@/components/ui/button'
import { AuthPopup } from './AuthPopup'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between bg-background p-4 shadow">
      <Link href="/" className="text-foreground hover:text-primary">
        <h1 className="text-2xl font-bold">Calendar</h1>
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            
            {user && (
              <li>
                <Link href="/calendar" className="text-foreground hover:text-primary">
                  Calendar
                </Link>
              </li>
            )}
            {user && (
               <li>
               <Link href="/events" className="text-foreground hover:text-primary">
                 Events
               </Link>
             </li>
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
          </ul>
        </nav>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
      <AuthPopup isOpen={isAuthPopupOpen} onClose={() => setIsAuthPopupOpen(false)} />
    </div>
  )
}

