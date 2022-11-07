import axios from 'axios';
import { env } from '../config';

const vote = {
  post: (data) =>
    axios.post(`${env.serverUrl}/vote`, { ...data }).then((res) => res.data),
};

export default vote;
