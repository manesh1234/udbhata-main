import { useState } from "react";
import useMarketData from "./utils/useMarketData";
import useNewsApi from "./utils/useNewsApi";
import Combined from "./components/Combined";
import useNotifications from "./utils/useNotifications";
import NewsData from "./components/NewsData";
import Markerdata from "./components/MarketData";
import NotificationData from "./components/NotificationData";

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
    const newsData = useNewsApi();
    const marketData = useMarketData();
    const notificationData = useNotifications();

    const changeStage = (index) => {
        setStage(index);
    }

    if (!newsData || !marketData || !notificationData) return (
        <>fetching</>
    )
    return stage === 0 ? (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <Combined marketData={marketData} newsData={newsData} notificationData={notificationData} />
        </>
    ) : stage === 1 ? (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <NewsData newsData={newsData} />
        </>
    ) : stage === 2 ? (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <Markerdata marketData={marketData} />
        </>
    ) : (
        <>
            <StagesBar indx={stage} changeStage={changeStage} />
            <NotificationData notificationData={notificationData} />
        </>
    )
}

export default App;
