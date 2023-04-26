import { useState } from "react";
import useMarketData from "./utils/useMarketData";
import useNewsApi from "./utils/useNewsApi";

const App = () => {
    const [finalData, setFinalData] = useState(null);
    const newsData = useNewsApi();
    let marketData = useMarketData();
    console.log(newsData);
    marketData = marketData?.filter(item => ((item.open - item.close) / item.open * 100) >= 3);
    console.log(marketData);
    if(newsData && marketData){
        
    }
    return (
        <>
            {/* {
                data.map((item) => {
                    return <div key={item.uri}>
                        <div>{item.date}</div>
                        <hr />
                    </div>
                })
            } */}
        </>
    );
}

export default App;
