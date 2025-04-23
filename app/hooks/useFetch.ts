import { useEffect, useState } from "react";


const useFetch = <T>(fetchFuntion: () => Promise<T>, autofetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchFuntion();

            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occured'))
        } finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    useEffect(() => {
        if(autofetch) {
            fetchData();
        }
    }, [])

    return { data, loading, error, refetch: fetchData, reset}
}

export default useFetch;