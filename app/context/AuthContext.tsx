// context/AuthContext.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed. User:", user ? user.uid : "null");
      if (user) {
        console.log("User email:", user.email);
        console.log("User display name:", user.displayName);
        // Be cautious about logging sensitive information
      } else {
        console.log("No user is signed in.");
      }
      setUser(user)
      setLoading(false)
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false)
    });

    return () => {
      console.log("Unsubscribing from auth state listener");
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)