import StudySetOverview from 'components/study-set/StudySetOverview';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from 'components/apis/FetchData';

const StudySetPage = () => {
    console.log('Init MyFeed')
    const [studySets, setStudySets] = useState([]);
    useEffect(() => {
        const setData = async () => {
            const data = await FetchData('/study-sets')
            console.log(data)
            setStudySets(data)
        }
        setData();
    }, []);

    return (
        <div>
            <h2>Study Sets</h2>
            <div className='container'>
                <div className="row">
                    {studySets.map((s) => (
                        <div className="col-md-4 mb-3" key={s.title}>
                            <StudySetOverview id={s.id} title={s.title} category={s.category} tag={s.tag} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudySetPage;
