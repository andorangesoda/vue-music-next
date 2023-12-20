import { get } from './base'

/**
 * 解析歌曲 URL
 * @param songs
 * @returns {Promise<Awaited<*>>|Promise<*>}
 */
export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  }).catch((err) => {
    console.log('获取歌曲url报错了！' + err)
  })
}

/**
 * 获取歌词
 * @type {{}}
 */
const lyricMap = {}
export function getLyric(song) {
  if (song.lyric) {
    // 有则直接返回歌词
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    // 获取到歌词缓存，直接返回
    return Promise.resolve(lyric)
  }
  // 获取服务端歌词
  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
