
const removeTimeFromDate = date => date.split('T')[0];
const Markerdata = ({ marketData }) => {
    marketData = marketData?.map(item => {
        return {
            ...item,
            date: removeTimeFromDate(item?.date),
            drop: ((item?.open - item?.close) / item?.open * 100).toFixed(2)
        }
    })
    return (
        <table>
            <thead>
                <tr>
                    <td>OPEN</td>
                    <td>HIGH</td>
                    <td>LOW</td>
                    <td>CLOSE</td>
                    <td>DROP%</td>
                    <td>EXHANGE</td>
                    <td>DATE</td>
                </tr>
            </thead>
            <tbody>
                {
                    marketData?.map((item, index) => {
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
    )
}

export default Markerdata;