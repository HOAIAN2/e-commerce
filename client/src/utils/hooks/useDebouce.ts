import { useState, useEffect } from 'react'

function useDebounce(value: never | string, timeout: number) {
    const [debounce, setDebouce] = useState(value)
    useEffect(() => {
        const handleDelay = setTimeout(() => {
            setDebouce(value)
        }, timeout)
        return (() => {
            clearTimeout(handleDelay)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    return debounce
}

export default useDebounce