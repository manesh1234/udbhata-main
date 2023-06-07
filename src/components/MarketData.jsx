import { useState } from "react";

const Markerdata = ({ ciplaNse, ciplaBse, drreddysNse, drreddysRdy }) => {
    const [renderingData, setRenderingData] = useState(ciplaNse);
    const [dropDown1, setDropDown1] = useState('1');
    const [dropDown2, setDropDown2] = useState('1');

    return (
        <>
            <div className="dropdown-div">
                <select value={dropDown1} onChange={(e) => {
                    setDropDown1(e.target.value);
                    if (dropDown2 === '1') {
                        setRenderingData(e.target.value === '1' ? ciplaNse : drreddysNse);
                    }
                    else setRenderingData(e.target.value === '1' ? ciplaBse : drreddysRdy);
                }} className="dropdown-btn" style={{ marginRight: '25px' }}>
                    <option value="1">Cipla</option>
                    <option value="2">Dr Reddy's</option>
                </select>
                <select value={dropDown2} onChange={(e) => {
                    setDropDown2(e.target.value);
                    if (dropDown1 === '1') {
                        setRenderingData(e.target.value === '1' ? ciplaNse : ciplaBse);
                    }
                    else setRenderingData(e.target.value === '1' ? drreddysNse : drreddysRdy);
                }} className="dropdown-btn">
                    <option value="1">NSE</option>
                    <option value="2">{dropDown1 === '1' ? 'BSE' : 'RDY'}</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <td>OPEN</td>
                        <td>HIGH</td>
                        <td>LOW</td>
                        <td>CLOSE</td>
                        <td>PREV_CLOSE</td>
                        <td>PC_O_DROP%</td>
                        <td>PC_C_DROP%</td>
                        <td>SYMBOL</td>
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
                                <td>{item.prevClose ? item.prevClose : "NULL"}</td>
                                <td>{item.prevClose_Open_Drop}</td>
                                <td>{item.prevClose_Close_Drop}</td>
                                <td>{item.symbol}</td>
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