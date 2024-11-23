"use client"
import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Sidebar } from '@/components/sidebar'
import { CalendarGrid } from '@/components/calendar-grid'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/utils/authContext'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()  
  const router = useRouter()

  useEffect(() => {
    if (loading) return; 
      if (user === null) {
        router.push('/') 
      }
  }, [user, loading, router])

  if (!user) {
          <Layout>
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>  }

  return (
    <Layout>
      <motion.div 
        className="flex h-full bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Sidebar 
          onDateSelect={(date) => setCurrentDate(date)}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDate={currentDate}
        />
        <div className="flex-1 overflow-hidden p-6">
          <CalendarGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>
      </motion.div>
    </Layout>
  )
}

