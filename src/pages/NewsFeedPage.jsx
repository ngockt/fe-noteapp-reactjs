import React, { useState, useEffect } from 'react';
import Page from 'components/contents/Page'; // Import the Page component
import FetchData from "components/apis/FetchData"


const Feed = () => {
    console.log('Init Feed')
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const setData = async () => {
            const data = await FetchData('/content/myfeed')
            console.log(data)
            setNotes(data)
        }
        setData();
    }, []);


    return (
        <div>
            <h2>My Notes</h2>
            <Page notes={notes} />
        </div>
    );
};

export default Feed;