"use client"

import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Sidebar } from '@/components/sidebar'
import { CalendarGrid } from '@/components/calendar-grid'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/utils/authContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { parseISO } from 'date-fns'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (dateParam) {
      try {
        const parsedDate = parseISO(dateParam)
        if (!isNaN(parsedDate.getTime())) {
          setCurrentDate(parsedDate)
        }
      } catch (error) {
        console.error('Invalid date parameter:', error)
      }
    }
  }, [searchParams])

  if (!user) {
    return null
  }

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
        <div className="flex-1 overflow-hidden w-full">
          <CalendarGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>
      </motion.div>
    </Layout>
  )
}

