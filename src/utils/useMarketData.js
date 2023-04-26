import { useState, useEffect } from "react";

const API_KEY = '52591967c2fe98caf183096d627cd07e';
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