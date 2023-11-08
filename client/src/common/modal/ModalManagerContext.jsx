import { createContext } from "react"

export const ModalManagerContext = createContext(null)

ModalManagerContext.displayName = "ModalManagerContext"

export const ModalManagerProvider = ModalManagerContext.Provider
