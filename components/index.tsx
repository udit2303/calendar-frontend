import React, { useState } from 'react'
import { Layout } from '../components/layout'
import { Sidebar } from '../components/sidebar'
import { CalendarGrid } from '../components/calendar-grid'
import { motion } from 'framer-motion'

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())

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

