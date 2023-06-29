import { useState } from 'react';
import imgNotFound from '../imgNotFound.png';
import { RxCross1 } from 'react-icons/rx';
const URL = 'https://www.newsapi.ai/api/v1/article/getArticles';
const API_KEY = "138ab06c-5efd-4a74-8880-dc99f5bbad20";

const NewsData = ({ newsData1, newsData2 }) => {
    const [renderingData, setRenderingData] = useState(newsData1);
    const [dropDown, setDropDown] = useState('1');
    const [searchTxt, setSearchTxt] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [selected, setSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChangleHandler = (e) => {
        setLoading(true);
        setSearchTxt(e.target.value);
        const timer = setTimeout(async () => {
            const response = await fetch(`https://www.newsapi.ai/api/v1/suggestConceptsFast?prefix=${e.target.value}&lang=eng&apiKey=${API_KEY}`);
            const data = await response.json();
            setSuggestions(data);
            setLoading(false);
        }, 400)
        return () => {
            clearTimeout(timer);
        }
    }
    const fetchNewsData = async (wikiURL) => {
        const query = {
            $query: {
                $and: [
                    { conceptUri: wikiURL },
                    { lang: "eng" }
                ]
            },
            $filter: {
                forceMaxDataTimeWindow: "31"
            }
        };
        const body = {
            query: JSON.stringify(query),
            resultType: "articles",
            articlesSortBy: "date",
            articlesCount: 100,
            articleBodyLen: -1,
            apiKey: API_KEY
        };
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();
        const articlePromises = [];
        for (let i = 1; i <= json.articles.pages; i++) {
            const articleBody = {
                query: JSON.stringify(query),
                resultType: "articles",
                articlesSortBy: "date",
                articlesCount: 100,
                articlesPage: i,
                articleBodyLen: -1,
                apiKey: API_KEY
            };
            articlePromises.push(fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleBody)
            }));
        }
        const articleResponses = await Promise.all(articlePromises);
        const articleJsons = await Promise.all(articleResponses.map(response => response.json()));
        const allArticles = articleJsons.flatMap(json => json.articles.results);
        setRenderingData(allArticles)
    }
    const handleResultClick = (result) => {
        setSearchTxt(result.label.eng);
        fetchNewsData(result.uri);
        setSelected(true);
    }
    const resetHandler = () => {
        setRenderingData(newsData1);
        setSearchTxt('');
        setSelected(false);
    }

    return (
        <>
            <div className="dropdown-div">
                {!selected && <select value={dropDown} onChange={(e) => {
                    setDropDown(e.target.value);
                    setRenderingData(e.target.value === '1' ? newsData1 : newsData2);
                }} className="dropdown-btn">
                    <option value="1">Cipla</option>
                    <option value="2">Dr Reddy's</option>
                </select>}
                <div style={{ marginLeft: '20px' }}>
                    <input type="text" value={searchTxt} disabled={selected} onChange={e => onChangleHandler(e)} placeholder='Search for Companies'/>
                    {loading ? <div className="loader">
                        <div className="spinner"></div>
                    </div> : suggestions.length > 0 && searchTxt.length > 0 && !selected &&
                    <ul>
                        {suggestions.map((result, indx) => (
                            <li key={indx} onClick={() => handleResultClick(result)}>
                                {result.label.eng}
                            </li>
                        ))}
                    </ul>}
                    {
                        selected && <span className='unselect' onClick={() => resetHandler()}><RxCross1 /></span>
                    }
                </div>
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
                            return item.sentiment < 0 && <tr key={index}>
                                <td>{item.date}</td>
                                <td style={{ backgroundColor: item.sentiment > -0.2 ? "rgb(211, 137, 137)" : "rgb(106, 193, 106)" }}>{item.sentiment}</td>
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