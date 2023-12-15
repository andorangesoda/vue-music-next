import { PLAY_MODE } from '@/assets/js/constant'

export function selectPlay({ commit }, { list, index }) {
  // commit 用于触发 Vuex 中的 mutation, 从而修改 state 中的状态。
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setPlayingState', true)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}
