"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialized = useRef(false)

  // Load from localStorage on mount - only once
  useEffect(() => {
    if (isInitialized.current) return

    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        if (item) {
          const parsedValue = JSON.parse(item)
          setStoredValue(parsedValue)
          console.log(`✅ Loaded ${key} from localStorage:`, parsedValue)
        } else {
          // If no item exists, save the initial value
          setStoredValue(initialValue)
          window.localStorage.setItem(key, JSON.stringify(initialValue))
          console.log(`💾 Saved initial ${key} to localStorage:`, initialValue)
        }
      } else {
        // If window is not available, use initial value
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.error(`❌ Error loading ${key} from localStorage:`, error)
      setStoredValue(initialValue)
    } finally {
      setIsLoaded(true)
      isInitialized.current = true
    }
  }, [key, initialValue]) // Add key and initialValue back as dependencies

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          console.log(`💾 Saved ${key} to localStorage:`, valueToStore)

          // Backup to a secondary key for safety
          window.localStorage.setItem(`${key}_backup`, JSON.stringify(valueToStore))

          // Add timestamp for debugging
          window.localStorage.setItem(`${key}_lastSaved`, new Date().toISOString())
        }
      } catch (error) {
        console.error(`❌ Error saving ${key} to localStorage:`, error)
      }
    },
    [key, storedValue],
  )

  // Recovery function to restore from backup
  const recoverFromBackup = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const backupItem = window.localStorage.getItem(`${key}_backup`)
        if (backupItem) {
          const parsedBackup = JSON.parse(backupItem)
          setStoredValue(parsedBackup)
          window.localStorage.setItem(key, JSON.stringify(parsedBackup))
          console.log(`🔄 Recovered ${key} from backup:`, parsedBackup)
          return true
        }
      }
    } catch (error) {
      console.error(`❌ Error recovering ${key} from backup:`, error)
    }
    return false
  }, [key])

  return [storedValue, setValue, { isLoaded, recoverFromBackup }] as const
}
