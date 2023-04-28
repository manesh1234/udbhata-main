import imgNotFound from '../imgNotFound.png';

const NewsData = ({ newsData }) => {
    return (
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
                    newsData?.map((item, index) => {
                        return <tr key={index}>
                            <td>{item.date}</td>
                            <td style={{ backgroundColor: item.sentiment < -0.5 ? "rgb(211, 137, 137)" : "rgb(106, 193, 106)" }}>{item.sentiment}</td>
                            <td><div className="newsData_img"><img src={item.image} alt="image" onError={(e) => { e.target.onerror = null; e.target.src = { imgNotFound } }} /></div></td>
                            <td>{item.title}</td>
                            <td><a target="__blank" rel="noreferrer" href={item.url}>{item.url.substring(0, 8)}......</a></td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    )
}

export default NewsData;