import { useState } from "react";

const NotificationData = ({ notificationData1, notificationData2 }) => {
    const [renderingData, setRenderingData] = useState(notificationData1);
    const [dropDown, setDropDown] = useState('1');

    return (
        <>
            <div className="dropdown-div">
                <select value={dropDown} onChange={(e) => {
                    setDropDown(e.target.value);
                    setRenderingData(e.target.value === '1' ? notificationData1 : notificationData2);
                }} className="dropdown-btn">
                    <option value="1">Cipla</option>
                    <option value="2">Dr Reddy's</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <td>DATE</td>
                        <td>Attachment Text</td>
                        <td>Attachment File</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        renderingData?.map((item, index) => {
                            return <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.attchmntText}</td>
                                <td><a target="__blank" rel="noreferrer" href={item.attchmntFile}>{item.attchmntFile.substring(0, 8)}......</a></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default NotificationData;