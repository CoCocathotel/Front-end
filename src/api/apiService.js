// apiService.js
import axios from "axios";

function production_check() {
    const isDevelopment =
        window.location.origin.includes("localhost") ||
        window.location.origin.includes("127.0.0.1");

    return isDevelopment
        ? "https://cococatbackend.vercel.app"
        : "https://cococatbackend.vercel.app";
}

const api = async (pathname) => {
    try {
        const response = await axios.get(production_check() + pathname);
        console.log(response.data.body)
        return response.data.body;
    } catch (error) {
        throw error;
    }
};



// eslint-disable-next-line import/no-anonymous-default-export
export default { api };
