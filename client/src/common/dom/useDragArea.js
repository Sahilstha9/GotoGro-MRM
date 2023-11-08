import { useEffect } from "react"

const clamp = (number, ...range) =>
    Math.max(Math.min(number, Math.max(...range)), Math.min(...range))

/**
* @param {RefObject<HTMLElement>} ref T
* @param {(x: number, y: number) => void} fn T
 */
export const useDragArea = (ref, fn) => {
    useEffect(() => {
        const { current: element } = ref
        if (!element) return

        /**
        * @param {MouseEvent} event
        */
        const handleDrag = event  => {
            const { left, top, width, height } = element.getBoundingClientRect()

            const x = clamp((event.clientX - left) / width, 0, 1)
            const y = clamp((event.clientY - top) / height, 0, 1)

            fn(x, y)
        }
        /**
         * @param {MouseEvent} event
         */
        const handleDragStart = event => {
            event.preventDefault()

            handleDrag(event)

            const handleDragEnd = () => {
                removeEventListener("mouseup", handleDragEnd)
                removeEventListener("mousemove", handleDrag)
            }

            addEventListener("mousemove", handleDrag)
            addEventListener("mouseup", handleDragEnd)
        }

        element.addEventListener("mousedown", handleDragStart)
        return () => element.removeEventListener("mousedown", handleDragStart)
    }, [fn, ref])
}
