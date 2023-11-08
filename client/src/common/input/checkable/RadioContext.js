import { createContext } from "react"

export const RadioContext = createContext(null)

RadioContext.displayName = "RadioContext"

export const RadioProvider = RadioContext.Provider
