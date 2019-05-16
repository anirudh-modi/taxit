import axios from 'axios';

function get(url) {
    return axios.get(url)
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            else {
                return Promise.reject(response.data);
            }
        })
        .catch(function (err) {
            return Promise.reject(err.data);
        })
}

function post(url) {
    return axios.post(url)
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            else {
                return Promise.reject(response.data);
            }
        })
        .catch(function (err) {
            return Promise.reject(err.response.data);
        })
}

export default {
    get,
    post
}