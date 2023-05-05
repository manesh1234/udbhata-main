import { useState } from "react";
import useCiplaNewsApi from "./utils/useCiplaNewsApi";
import useDrReddysNewsApi from "./utils/useDrReddysNewsApi";
import useMarketData from "./utils/useMarketData";
import useNotifications from "./utils/useNotifications";

import Combined from "./components/Combined";
import NewsData from "./components/NewsData";
import Markerdata from "./components/MarketData";
import NotificationData from "./components/NotificationData";

// import market1 from './utils/market1.json';
// import market2 from './utils/market2.json';
// import notifications from './utils/notifications.json';


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
    const newsData1 = useCiplaNewsApi();
    const newsData2 = useDrReddysNewsApi();
    let { marketData1, marketData2 } = useMarketData();
    const notificationData = useNotifications();

    // let marketData1 = market1.data;
    // let marketData2 = market2.data;
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
            <Markerdata marketData1={marketData1} marketData2={marketData2} />
        </>
    ) : (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <NotificationData notificationData1={notificationData1} notificationData2={notificationData2} />
        </>
    )
}

export default App;
