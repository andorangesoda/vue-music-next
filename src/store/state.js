import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  // 顺序列表
  sequenceList: [],
  // 播放列表
  playList: [],
  playingState: false,
  platMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false
}

export default state
