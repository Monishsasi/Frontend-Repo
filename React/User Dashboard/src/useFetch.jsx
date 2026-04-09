import React from 'react'
import { useEffect, useState } from 'react';

function useFetch(url) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(url).then((res) => {
            if (!res.ok) {
                throw new Error("Couldn't retrieve the data")
            }
            return res.json()
        }).then((res) => setData(res)).catch((err) => setError(err.message))
    }, [])

    return [data, error]

}

export default useFetch