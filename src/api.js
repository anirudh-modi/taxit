import axios from 'axios';

function get(url) {
    return axios.get(url)
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            else {
                return Promise.reject(response);
            }
        });
}

function post(url) {
    return axios.post(url)
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            else {
                return Promise.reject(response);
            }
        });
}

export default {
    get,
    post
}