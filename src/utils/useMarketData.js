import { useState, useEffect } from "react";

const API_KEY = 'd331602daa481af08223120ce6bb4bdd';
const URL = `https://nseindia.onrender.com/api/eod?access_key=${API_KEY}&symbols=CIPLA.XNSE,CIPLA.XBOM`;

const useMarketData = () => {
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const response = await fetch(URL);
        const json = await response.json();
        setData(json.data);
    }

    useEffect(() => {
        fetchData();
    }, [])
    return data;
}

export default useMarketData;