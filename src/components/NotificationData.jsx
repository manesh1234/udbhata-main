
const NotificationData = ({ notificationData }) => {
    notificationData = notificationData.sort((a, b) => {
        const dateA = new Date(a.an_dt.replace(/-/g, '/').replace(/([A-Z]{1}[a-z]{2})/, '$1,'));
        const dateB = new Date(b.an_dt.replace(/-/g, '/').replace(/([A-Z]{1}[a-z]{2})/, '$1,'));
        return dateB - dateA;
    })
    return (
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
                    notificationData?.map((item, index) => {
                        return <tr key={index}>
                            <td>{item.an_dt}</td>
                            <td>{item.attchmntText}</td>
                            <td><a target="__blank" rel="noreferrer" href={item.attchmntFile}>{item.attchmntFile.substring(0, 8)}......</a></td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    )
}

export default NotificationData;