import { useState } from "react";

const Markerdata = ({ marketData1, marketData2 }) => {
    const [renderingData, setRenderingData] = useState(marketData1);
    const [dropDown, setDropDown] = useState('1');

    return (
        <>
            <div className="dropdown-div">
                <select value={dropDown} onChange={(e) => {
                    setDropDown(e.target.value);
                    setRenderingData(e.target.value === '1' ? marketData1 : marketData2);
                }} className="dropdown-btn">
                    <option value="1">Cipla</option>
                    <option value="2">Dr Reddy's</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <td>OPEN</td>
                        <td>HIGH</td>
                        <td>LOW</td>
                        <td>CLOSE</td>
                        <td>DROP%</td>
                        <td>EXCHANGE</td>
                        <td>DATE</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        renderingData?.map((item, index) => {
                            return <tr key={index}>
                                <td>{item.open}</td>
                                <td>{item.high}</td>
                                <td>{item.low}</td>
                                <td>{item.close}</td>
                                <td>{item.drop}</td>
                                <td>{item.exchange === "XBOM" ? "BSE" : "NSE"}</td>
                                <td>{item.date}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default Markerdata;