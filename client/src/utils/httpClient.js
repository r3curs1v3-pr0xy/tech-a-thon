import axios from "axios";

const httpClientWithOutToken = async (url, method, body={}) => {
  return await axios({
    method: method,
    url: url,
    data: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const httpClient = async (url, method, body={}) => {
  return await axios({
    method: method,
    url: url,
    data: body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export { httpClient, httpClientWithOutToken };
