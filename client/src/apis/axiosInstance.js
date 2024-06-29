import axios from "axios";

export const axiosInstance=axios.create({
    withCredentials:true,
    headers:{
        "authorization": `Bearer ${(localStorage.getItem('token'))}`
    }
})


