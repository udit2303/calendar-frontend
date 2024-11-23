"use client";

import React, {useState} from 'react'
import { Layout } from '../components/layout'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/utils/authContext'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthPopup } from '@/components/AuthPopup'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false)

  const features = [
    { icon: Calendar, title: 'Easy Scheduling', description: 'Create and manage events effortlessly' },
    { icon: Clock, title: 'Time Management', description: 'Optimize your daily routine' },
    { icon: Users, title: 'Collaboration', description: 'Share and coordinate with others' },
    { icon: CheckCircle, title: 'Task Tracking', description: 'Never miss a deadline again' },
  ]

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Calendar App
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Organize your life with our simple and effective calendar solution. Stay on top of your schedule and boost your productivity.
          </p>
          {user ? (
            <Button onClick={() => router.push('/calendar')} size="lg" className="animate-pulse">
              Go to Calendar
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-lg">Please log in or sign up to use the calendar.</p>
              <Button onClick={() => setIsAuthPopupOpen(true)} variant="outline" className="mr-4">
                Log In
              </Button>
              <Button onClick={() => setIsAuthPopupOpen(true)}>
                Sign Up
              </Button>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        >
          {features.map((feature, index) => (
            <Card key={index} className="bg-white hover:bg-gray-50 transition-colors duration-300 border border-gray-200">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
          <Button onClick={() => user ? router.push( '/calendar') : setIsAuthPopupOpen(true)} size="lg">
            {user ? 'Open Calendar' : 'Create Your Account'}
          </Button>
        </motion.div>
      </div>
      <AuthPopup isOpen={isAuthPopupOpen} onClose={() => setIsAuthPopupOpen(false)} />

    </Layout>
  )
}

