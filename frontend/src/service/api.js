const get = async (endpoint) => {
    return await request('GET', endpoint);
}

const post = async (endpoint, data) => {
    return await request('POST', endpoint, data);
}

const put = async (endpoint, data) => {
    return await request('PUT', endpoint, data);
}

const request = async (method, endpoint, data={}) => {
    const baseURL = 'http://localhost:3000';
    const response = await fetch(baseURL + endpoint, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: method === 'GET' ? null : JSON.stringify(data)
    });

    if(response.status === 204) return;
    return response.json();
}

export default {
    post,
    get,
    put
}