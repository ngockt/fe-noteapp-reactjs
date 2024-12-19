import React, { useState, useEffect } from 'react';
import CardList from 'components/contents/CardList'; // Import the Page component
import FetchData from "components/apis/FetchData"


const DashBoardPage = () => {
    console.log('Init DashBoardPage')
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const setData = async () => {
            const data = await FetchData('/content')
            console.log(data)
            setNotes(data)
        }
        setData();
    }, []);


    return (
        <div>
            <h2>My Notes</h2>
            <CardList notes={notes} />
        </div>
    );
};

export default DashBoardPage;