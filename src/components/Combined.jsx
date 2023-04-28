import { useState, useEffect } from "react";

const removeTimeFromDate = date => date.split('T')[0];
const notificationDateFilter = (inputDate) => {
    const parts = inputDate.split(/[\s:-]/);
    const dateObj = new Date(`${parts[1]} ${parts[0]}, ${parts[2]} ${parts[3]}:${parts[4]}:${parts[5]}`);
    return dateObj.toLocaleDateString('en-CA');
}
const nextAndPrevDate = (inputDate, nextOrPrev) => {
    const dateObj = new Date(inputDate);
    const nextDateObj = new Date(dateObj.getTime() + 24 * 60 * 60 * 1000);
    const prevDateObj = new Date(dateObj.getTime() - 24 * 60 * 60 * 1000);
    return nextOrPrev === "next" ? nextDateObj.toISOString().slice(0, 10) : prevDateObj.toISOString().slice(0, 10);
}

const filterFunction = (marketData, newsData, notificationData) => {
    let obj = {};
    let tempArr = [];
    marketData?.forEach(market => {
        newsData?.forEach(news => {
            tempArr = [];
            if (market.date === news.date) {
                if (obj.hasOwnProperty(market.date)) {
                    tempArr = [...obj[market.date].news_data];
                    tempArr.push({
                        sentiment: news.sentiment,
                        url: news.url
                    });
                    obj[market.date] = {
                        ...market,
                        news_data: [...tempArr],
                    }
                } else {
                    obj[market.date] = {
                        ...market,
                        news_data: [{
                            sentiment: news.sentiment,
                            url: news.url
                        }],
                    }
                }
            } else {
                if (!obj.hasOwnProperty(market.date)) {
                    obj[market.date] = {
                        ...market,
                        news_data: [],
                    }
                }
            }
        })
    })
    let marketNewsData = Object.values(obj);
    obj = {};
    marketNewsData?.forEach(market => {
        notificationData?.forEach(notification => {
            tempArr = [];
            if (market.date === notification.date || market.date === notification.prevDate || market.date === notification.nextDate) {
                if (obj.hasOwnProperty(market.date)) {
                    tempArr = [...obj[market.date].attachment];
                    tempArr.push({
                        attchmntFile: notification.attchmntFile,

                    });
                    obj[market.date] = {
                        ...market,
                        attachment: [...tempArr],
                    }
                } else {
                    obj[market.date] = {
                        ...market,
                        attachment: [{
                            attchmntFile: notification.attchmntFile,
                        }],
                    }
                }
            } else {
                if (!obj.hasOwnProperty(market.date)) {
                    obj[market.date] = {
                        ...market,
                        attachment: [],
                    }
                }
            }
        })
    })
    return Object.values(obj);
}

const Combined = ({ marketData, newsData, notificationData }) => {
    const [finalData, setFinalData] = useState(null);
    notificationData = notificationData?.map(notification => {
        return {
            ...notification,
            date: notificationDateFilter(notification.an_dt),
            prevDate: nextAndPrevDate(notificationDateFilter(notification.an_dt)),
            nextDate: nextAndPrevDate(notificationDateFilter(notification.an_dt), "next")
        }
    })
    marketData = marketData?.filter(item => ((item?.open - item?.close) / item?.open * 100) >= 3);
    marketData = marketData?.map(item => {
        return {
            ...item,
            date: removeTimeFromDate(item?.date),
            drop: ((item?.open - item?.close) / item?.open * 100).toFixed(2)
        }
    })
    console.log("Markerdata", marketData, notificationData)
    console.log(newsData);
    useEffect(() => {
        setFinalData(filterFunction(marketData, newsData, notificationData));
    }, [])
    console.log(finalData);
    return (
        <table>
            <thead>
                <tr>
                    <td>OPEN</td>
                    <td>CLOSE</td>
                    <td>DATE</td>
                    <td>DROP%</td>
                    <td>News Links</td>
                    <td>NSE Notification</td>
                </tr>
            </thead>
            <tbody>
                {
                    finalData?.map((item, index) => {
                        return <tr key={index}>
                            <td>{item.open}</td>
                            <td>{item.close}</td>
                            <td>{item.date}</td>
                            <td>{item.drop}</td>
                            <td>{item.news_data.length === 0 ? "-------" : item.news_data.map((item, index) => <a target="__blank" rel="noreferrer" href={item.url} key={index}>LINK , sentiment : {item.sentiment}</a>)}</td>
                            <td>{item.attachment.length === 0 ? "------" : item.attachment.map((item, index) => <a target="__blank" rel="noreferrer" href={item.attchmntFile} key={index}>{item.attchmntFile.substring(0, 15)}....</a>)}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    )
}

export default Combined;