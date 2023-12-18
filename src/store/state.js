import { PLAY_MODE, FAVORITE_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  // 顺序列表
  sequenceList: [],
  // 播放列表
  playList: [],
  playingState: false,
  platMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: load(FAVORITE_KEY)
}

export default state
