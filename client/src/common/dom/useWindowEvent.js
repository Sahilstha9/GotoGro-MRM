/**
 *  @fileOverview Uses a window event
 *
 *  @author       Ethan Engelander
 *
 *  @requires     NPM:react
 */

import { useEffect } from "react"

/**
* @exports {<K extends keyof WindowEventMap>} useWindowEvent
 * @memberof useWindowEvent
* @param {K} type
* @param {(event: WindowEventMap[K]) => void} listener
* @param {AddEventListenerOptions} options
 * @return {function}
 */
export const useWindowEvent = (type, listener, options) => {
    useEffect(() => {
        window.addEventListener(type, listener, options)

        return () => {
            window.removeEventListener(type, listener, options)
        }
    })
}
