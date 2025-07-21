import api from "../api";

const about = async () => {
     try {
        const response = await api.get('/contact');
        return response.data.data;
     } catch (error) {

        throw error;
     }
}

export default about;