import axios from 'axios'

const ERR_OK = 0
const baseURL = '/'

// 通用axios配置
axios.defaults.baseURL = baseURL
export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    if (res.data.code === ERR_OK) {
      return res.data.result
    }
  }).catch((err) => {
    console.log(err)
  })
}
