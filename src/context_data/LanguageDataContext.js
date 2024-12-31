import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRequest } from 'apis/services';

// Create a context
const LanguageDataContext = createContext();

// Create a provider component
export const LanguageDataProvider = ({ children }) => {
    const [languagesData, setLanguagesData] = useState(null);

    useEffect(() => {
        if (!languagesData) {
            getRequest('/languages/graph')
                .then((data) => setLanguagesData(data))
                .catch((error) => {
                    console.error('Error fetching languages data:', error);
                    setLanguagesData([]); // Gracefully handle errors by setting an empty default value
                });
        }
    }, [languagesData]);

    // If still loading, don't render children
    if (languagesData === null) return null;

    return (
        <LanguageDataContext.Provider value={languagesData}>
            {children}
        </LanguageDataContext.Provider>
    );
};

// Custom hook to use the context
export const useLanguagesData = () => {
    return useContext(LanguageDataContext);
};
