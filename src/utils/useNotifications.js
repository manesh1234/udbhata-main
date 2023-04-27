import { useEffect, useState } from "react"

const URL = 'https://nse-india.onrender.com/api?limit=0';
const useNotifications = () => {
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const response = await fetch(URL);
        const json = await response.json();
        setData(json);
    }
    useEffect(() => {
        fetchData();
    }, [])
    return data;
}

export default useNotifications;