import { useState } from "react";
// import useCiplaNewsApi from "./utils/useCiplaNewsApi";
// import useDrReddysNewsApi from "./utils/useDrReddysNewsApi";
// import useMarketData from "./utils/useMarketData";
// import useNotifications from "./utils/useNotifications";

import Combined from "./components/Combined";
import NewsData from "./components/NewsData";
import Markerdata from "./components/MarketData";
import NotificationData from "./components/NotificationData";

import market1 from './utils/market1.json';
import market2 from './utils/market2.json';
import notificationData from './utils/notifications.json';
import ciplaNews from './utils/newsData1.json';
import drReddysNews from './utils/newsData2.json';

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
const getPreviousDate = (dateString) => {
    const currentDate = new Date(dateString);
    currentDate.setDate(currentDate.getDate() - 1); // Go to the previous date

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const previousDate = `${year}-${month}-${day}`;
    return previousDate;
}


const StagesBar = ({ indx, changeStage }) => {
    const stagesNames = ['Combined Data', 'News Data', 'Market Data', 'Notifications Data'];
    return (
        <>
            <div className="bar">
                <div className="stages">
                    {
                        stagesNames.map((item, index) => {
                            return <div key={index} onClick={() => changeStage(index)} style={{ backgroundColor: indx === index && '#8ecae6' }}>{item}</div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

const App = () => {
    const [stage, setStage] = useState(0);
    // const newsData1 = useCiplaNewsApi();
    // const newsData2 = useDrReddysNewsApi();
    // let { marketData1, marketData2 } = useMarketData();
    // const notificationData = useNotifications();

    let newsData1 = ciplaNews.data;
    let newsData2 = drReddysNews.data;
    let marketData1 = market1.data;
    let marketData2 = market2.data;

    let notificationData1 = notificationData?.filter(item => item?.symbol === 'CIPLA');
    let notificationData2 = notificationData?.filter(item => item?.symbol === 'DRREDDY');

    const changeStage = (index) => {
        setStage(index);
    }
    // adding some data fields in every data types
    marketData1 = marketData1?.map(item => {
        return {
            ...item,
            date: removeTimeFromDate(item?.date),
            drop: ((item?.open - item?.close) / item?.open * 100).toFixed(2)
        }
    })
    marketData2 = marketData2?.map(item => {
        return {
            ...item,
            date: removeTimeFromDate(item?.date),
            drop: ((item?.open - item?.close) / item?.open * 100).toFixed(2)
        }
    })

    let ciplaNse = marketData1?.filter(item => item?.symbol === "CIPLA.XNSE");
    let ciplaBse = marketData1?.filter(item => item?.symbol === "CIPLA.XBOM");
    let drreddysNse = marketData2?.filter(item => item?.symbol === "DRREDDY.XNSE");
    let drreddysRdy = marketData2?.filter(item => item?.symbol === "RDY");

    const prevCloseHandler = (data) => {
        return data?.map(item => {
            let currentDate = getPreviousDate(item?.date);

            let prevDate = null;
            let daysDiff = 0;

            while (!prevDate && daysDiff <= 10) {
                prevDate = data.find(obj => obj?.date === currentDate);
                const previousDate = getPreviousDate(currentDate);
                currentDate = previousDate;
                daysDiff++;
            }
            const prevClose_Open_Drop = prevDate ? ((prevDate.close - item.open) / prevDate.close * 100).toFixed(2) : null;
            const prevClose_Close_Drop = prevDate ? ((prevDate.close - item.close) / prevDate.close * 100).toFixed(2) : null;
            const maxDrop = Math.max(parseFloat(prevClose_Open_Drop), parseFloat(prevClose_Close_Drop));

            return {
                ...item,
                prevClose: prevDate ? prevDate.close : null,
                prevClose_Open_Drop: prevClose_Open_Drop,
                prevClose_Close_Drop: prevClose_Close_Drop,
                maxDrop: maxDrop
            };
        });
    }

    ciplaNse = prevCloseHandler(ciplaNse);
    ciplaBse = prevCloseHandler(ciplaBse);
    drreddysNse = prevCloseHandler(drreddysNse);
    drreddysRdy = prevCloseHandler(drreddysRdy);

    marketData1 = marketData1?.map(item => {
        const matchingCiplaNse = ciplaNse.find(ciplaItem => ciplaItem.date === item.date);
        const matchingCiplaBse = ciplaBse.find(ciplaItem => ciplaItem.date === item.date);;
        const maxDrop = matchingCiplaNse ? matchingCiplaNse.maxDrop : matchingCiplaBse ? matchingCiplaBse.maxDrop : null;
        return {
            ...item,
            drop: maxDrop
        };
    })
    marketData2 = marketData2?.map(item => {
        const matchingDrreddysNse = drreddysNse.find(drreddysItem => drreddysItem.date === item.date);
        const matchingDrreddysRdy = drreddysRdy.find(drreddysItem => drreddysItem.date === item.date);;
        const maxDrop = matchingDrreddysNse ? matchingDrreddysNse.maxDrop : matchingDrreddysRdy ? matchingDrreddysRdy.maxDrop : null;
        return {
            ...item,
            drop: maxDrop
        };
    });

    notificationData1 = notificationData1?.map(notification => {
        return {
            ...notification,
            date: notificationDateFilter(notification?.an_dt),
            prevDate: nextAndPrevDate(notificationDateFilter(notification?.an_dt)),
            nextDate: nextAndPrevDate(notificationDateFilter(notification?.an_dt), "next")
        }
    })
    notificationData2 = notificationData2?.map(notification => {
        return {
            ...notification,
            date: notificationDateFilter(notification.an_dt),
            prevDate: nextAndPrevDate(notificationDateFilter(notification.an_dt)),
            nextDate: nextAndPrevDate(notificationDateFilter(notification.an_dt), "next")
        }
    })
    notificationData1 = notificationData1?.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    })
    notificationData2 = notificationData2?.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    })
    // End of adding some data fields in every data types

    if (!newsData1 || !newsData2 || !marketData1 || !marketData2 || !notificationData1 || !notificationData2) return (
        <>fetching</>
    )
    return stage === 0 ? (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <Combined marketData1={marketData1} marketData2={marketData2} newsData1={newsData1} newsData2={newsData2} notificationData1={notificationData1} notificationData2={notificationData2} />
        </>
    ) : stage === 1 ? (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <NewsData newsData1={newsData1} newsData2={newsData2} />
        </>
    ) : stage === 2 ? (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <Markerdata ciplaNse={ciplaNse} ciplaBse={ciplaBse} drreddysNse={drreddysNse} drreddysRdy={drreddysRdy} />
        </>
    ) : (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <NotificationData notificationData1={notificationData1} notificationData2={notificationData2} />
        </>
    )
}

export default App;
