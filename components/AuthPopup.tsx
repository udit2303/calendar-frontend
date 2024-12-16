import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/utils/authContext'
import { motion } from 'framer-motion'
import { User, Lock } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface AuthPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const { login, signup } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (activeTab === 'login') {
        await login(email, password)
        toast({
          title: "Success",
          description: "Logged in successfully",
          variant: "default",
        })
      } else {
        await signup(email, password)
        toast({
          title: "Success",
          description: "Signed up successfully",
          variant: "default",
        })
      }
      onClose()
    } catch (error) {
      console.error(`${activeTab} failed:`, error)
      toast({
        title: "Error",
        description: error.message || `${activeTab === 'login' ? 'Login' : 'Signup'} failed`,
        variant: "destructive",
      })
    }
  }

  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <motion.form onSubmit={handleSubmit} className="space-y-4" initial="hidden" animate="visible">
              <motion.div variants={inputVariants} transition={{ delay: 0.1 }}>
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </motion.div>
              <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </motion.div>
              <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </motion.div>
            </motion.form>
          </TabsContent>
          <TabsContent value="signup">
            <motion.form onSubmit={handleSubmit} className="space-y-4" initial="hidden" animate="visible">
              <motion.div variants={inputVariants} transition={{ delay: 0.1 }}>
                <Label htmlFor="signup-email" className="text-right">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </motion.div>
              <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                <Label htmlFor="signup-password" className="text-right">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </motion.div>
              <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </motion.div>
            </motion.form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

