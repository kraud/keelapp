import {useEffect, useRef} from "react"

export const useIntervalFunction = (callback: () => void, delay: number | null, runCallbackOnStart?: boolean) => {

    const savedCallback = useRef()

    useEffect(() => {
        // @ts-ignore
        savedCallback.current = callback
    }, [callback])


    useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current()
        }
        if (delay !== null) {
            if(runCallbackOnStart!!){
                tick() // Call the function immediately
            }
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}