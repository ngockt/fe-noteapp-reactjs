import AxiosInstance from 'AxiosInstance'; // Import axios instance

const FetchData = async (url) => {
    try {
        const accessToken = localStorage.getItem("accessToken");

        console.log("Get data from", url);
        const response = await AxiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}` // Include the access token
            }
        }
        ); // API endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching graph data:', error)
    }
}

export default FetchData