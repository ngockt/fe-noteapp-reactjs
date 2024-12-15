import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudySet = ({ id, title, category, tag }) => {
    return (
        <Link
            to={`/study-sets/${id}`}
            className="text-decoration-none"
            style={{ cursor: 'pointer' }}
        >
            <div
                className="card shadow-sm"
                style={{ width: '18rem', margin: '10px' }}
            >
                <div className="card-body" style={{ padding: '15px' }}>
                    <h5 className="card-title mb-2">{title}</h5>
                    <p className="card-text mb-0">
                        <span style={{ fontWeight: 'bold' }}>{tag}</span>
                        <span style={{ margin: '0 5px', fontWeight: 'normal' }}>-</span>
                        <span style={{ fontStyle: 'italic' }}>{category}</span>
                    </p>
                </div>
            </div>
        </Link>
    );
};

StudySet.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
};

export default StudySet;
