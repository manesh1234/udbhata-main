import { useState, useEffect } from "react";

const removeTimeFromDate = date => date.split('T')[0];
const filterFunction = (marketData, newsData) => {
    const arr = [];
    marketData?.forEach(market => {
        newsData?.forEach(news => {
            if (market.date === news.date) {
                console.log('heyy')
                arr.push({
                    ...market,
                    ...news
                })
            }
        })
    })
    return arr;
}

const Combined = ({ marketData, newsData, notificationData }) => {
    const [finalData, setFinalData] = useState(null);
    marketData = marketData?.filter(item => ((item?.open - item?.close) / item?.open * 100) >= 3);
    marketData = marketData?.map(item => {
        return {
            ...item,
            date: removeTimeFromDate(item?.date)
        }
    })
    console.log("Markerdata", marketData)
    console.log(newsData);
    useEffect(() => {
        setFinalData(filterFunction(marketData, newsData));
    }, [])
    console.log(finalData);
    return (
        <div>
            <div></div>
        </div>
    )
}

export default Combined;