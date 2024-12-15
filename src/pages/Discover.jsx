import React, { useState, useEffect } from 'react';
import Page from '../components/contents/Page'; // Import the Page component
import FetchData from "components/apis/FetchData"

const Discover = () => {
    console.log('Init MyFeed')
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const setData = async () => {
            const data =  await FetchData('/content/discover')
            setNotes(data)
        }
        setData();
    }, []);

    return (
        <div>
            <h1>My Notes</h1>
            <Page notes={notes}/>
        </div>
    );
};

export default Discover;