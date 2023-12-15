// 获取当前歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
