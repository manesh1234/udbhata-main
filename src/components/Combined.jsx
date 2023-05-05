import { useState, useEffect } from "react";

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

const Combined = ({ marketData1, marketData2, newsData1, newsData2, notificationData1, notificationData2 }) => {
    const [finalData1, setFinalData1] = useState(null);
    const [finalData2, setFinalData2] = useState(null);
    const [drop, setDrop] = useState('3');
    
    marketData1 = marketData1?.filter(item => ((item?.open - item?.close) / item?.open * 100) >= parseInt(drop));
    marketData2 = marketData2?.filter(item => ((item?.open - item?.close) / item?.open * 100) >= parseInt(drop));

    useEffect(() => {
        setFinalData1(filterFunction(marketData1, newsData1, notificationData1));
        setFinalData2(filterFunction(marketData2, newsData2, notificationData2));
    }, [drop])

    return (
        <>
            <div className="dropdown-div">
                <select value={drop} onChange={(e) => {
                    setDrop(e.target.value);
                }} className="dropdown-btn">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <h1>For Cipla</h1>
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
                        finalData1?.map((item, index) => {
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
            <h1>For DrReddy's</h1>
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
                        finalData2?.map((item, index) => {
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
        </>
    )
}

export default Combined;