import { createContext } from "react"

export const ModalContext = createContext(null)

ModalContext.displayName = "ModalContext"

export const ModalProvider = ModalContext.Provider
