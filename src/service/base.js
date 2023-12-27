import axios from 'axios'

const ERR_OK = 0
// 部署到线上需要将 xxx.com 替换真实域名地址
const baseURL = process.env.NODE_ENV === 'production' ? 'http://xxx.com/music-next/' : '/'

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
