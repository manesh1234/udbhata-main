import { useState } from 'react';
import imgNotFound from '../imgNotFound.png';

const NewsData = ({ newsData1, newsData2 }) => {
    const [renderingData, setRenderingData] = useState(newsData1);
    const [dropDown, setDropDown] = useState('1');
 
    return (
        <>
            <div className="dropdown-div">
                <select value={dropDown} onChange={(e) => {
                    setDropDown(e.target.value);
                    setRenderingData(e.target.value === '1' ? newsData1 : newsData2);
                }} className="dropdown-btn">
                    <option value="1">Cipla</option>
                    <option value="2">Dr Reddy's</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <td>DATE</td>
                        <td>SENTIMENT</td>
                        <td>IMAGE</td>
                        <td>TITLE</td>
                        <td>LINK</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        renderingData?.map((item, index) => {
                            return item.sentiment<0 && <tr key={index}>
                                <td>{item.date}</td>
                                <td style={{ backgroundColor: item.sentiment < -0.5 ? "rgb(211, 137, 137)" : "rgb(106, 193, 106)" }}>{item.sentiment}</td>
                                <td><div className="newsData_img"><img src={item.image} alt="NewsImage" onError={(e) => { e.target.onerror = null; e.target.src = { imgNotFound } }} /></div></td>
                                <td>{item.title}</td>
                                <td><a target="__blank" rel="noreferrer" href={item.url}>{item.url.substring(0, 8)}......</a></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default NewsData;