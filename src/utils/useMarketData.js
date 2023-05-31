import { useState, useEffect } from "react";

const API_KEY = '08458a50b56cec860381f42c26d43125';
const URL1 = `https://nseindia.onrender.com/api/eod?access_key=${API_KEY}&symbols=CIPLA.XNSE,CIPLA.XBOM`;
const URL2 = `https://nseindia.onrender.com/api/eod?access_key=${API_KEY}&symbols=DRREDDY.XNSE,RDY`;

const useMarketData = () => {
    const [marketData1, setData1] = useState(null);
    const [marketData2, setData2] = useState(null);
    const fetchData = async () => {
        const [response1, response2] = await Promise.all([
            fetch(URL1),
            fetch(URL2)
        ])
        const [json1, json2] = await Promise.all([
            response1.json(),
            response2.json()
        ])
        setData1(json1?.data);
        setData2(json2?.data);
    }

    useEffect(() => {
        fetchData();
    }, [])
    return { marketData1, marketData2 };
}

export default useMarketData;