import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// dispatch 可以用来触发 action
export function selectPlay({ commit }, { list, index }) {
  // commit 用于触发 Vuex 中的 mutation, 从而修改 state 中的状态。
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setPlayingState', true)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}

export function randomPlay({ commit }, list) {
  commit('setSequenceList', list)
  commit('setPlayList', shuffle(list))
  commit('setPlayingState', true)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
}
