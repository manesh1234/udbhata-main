import { useEffect, useState } from "react";

const URL = 'https://www.newsapi.ai/api/v1/article/getArticles';
const body = {
    "query": "{\"$query\":{\"$and\":[{\"conceptUri\":\"http://en.wikipedia.org/wiki/Cipla\"},{\"lang\":\"eng\"}]},\"$filter\":{\"forceMaxDataTimeWindow\":\"31\"}}",
    "resultType": "articles",
    "articlesSortBy": "date",
    "articlesCount": 100,
    "articleBodyLen": -1,
    "apiKey": "138ab06c-5efd-4a74-8880-dc99f5bbad20"
}

const useCiplaNewsApi = () => {
    const [data, setData] = useState(null);
    const fetchData = async () => {
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
            articlePromises.push(fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "query": "{\"$query\":{\"$and\":[{\"conceptUri\":\"http://en.wikipedia.org/wiki/Cipla\"},{\"lang\":\"eng\"}]},\"$filter\":{\"forceMaxDataTimeWindow\":\"31\"}}",
                    "resultType": "articles",
                    "articlesSortBy": "date",
                    "articlesCount": 100,
                    "articlesPage": i,
                    "articleBodyLen": -1,
                    "apiKey": "138ab06c-5efd-4a74-8880-dc99f5bbad20"
                })
            }))
        }
        const articleResponses = await Promise.all(articlePromises);
        const articleJsons = await Promise.all(articleResponses.map(response => response.json()));
        const allArticles = articleJsons.flatMap(json => json.articles.results);
        setData(allArticles);
    }

    useEffect(() => {
        fetchData();
    }, [])
    return data;
}

export default useCiplaNewsApi;

