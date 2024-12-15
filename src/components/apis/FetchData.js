import AxiosInstance from 'AxiosInstance'; // Import axios instance

const FetchData = async (url) => {
    try {
        console.log("Get data from", url);
        const response = await AxiosInstance.get(url); // API endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching graph data:', error)
    }
}

export default FetchData