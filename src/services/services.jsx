import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set up Axios with a base URL if needed
const axiosInstance = axios.create({
  baseURL: 'http://ac99c7f6dfac8444bb96c5f59fae927d-15dd478b86e9eeed.elb.ap-south-1.amazonaws.com:8080/api',
});

// Reusable GET request function
export const get = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    return error?.response;
  }
};

export const fetchData = async (url, headers) => {
  try {
    const response = await axiosInstance.get(url, headers);
    return response.data;
  } catch (error) {
    return error?.response;
  }
};


// Reusable POST request function
export const post = async (url, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    if(error?.response?.data?.status == '500'){
      toast.error('Error code 500 :- Something went wrong!')    
    }
    else{
      toast.error(error?.response?.data?.message);
    }
    throw new Error(error);
  }
};

// Reusable PATCH request function
export const patch = async (url, data = {}) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error) {
    throw new Error(`PATCH request error: ${error.message}`);
  }
};

// Reusable DELETE request function
export const del = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(`DELETE request error: ${error.message}`);
  }
};


