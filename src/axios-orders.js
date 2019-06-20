import axios from 'axios';

const instance = axios.create ({
    baseURL: 'https://react-course-2ba20.firebaseio.com/'
})

export default instance;