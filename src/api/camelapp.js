import axios from 'axios';

export default axios.create({
  baseURL: 'http://tasdeer.a2zcreatorz.com/public/api/a2z110',
  // baseURL: "http://www.tasdeertech.com/api/a2z110",
  //   headers: {
  //   "Accept": "application/json",
  //   "Content-Type": 'application/json; charset=utf-8; ',
  // },
});
