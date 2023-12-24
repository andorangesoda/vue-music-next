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

export function removeSong({ commit, state }, song) {
  // 创建副本，对副本操作后，在 commit 提交更新
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playList.slice()

  // 获取待删除的歌曲在顺序列表和播放列表中的索引
  const delSequenceIndex = findIndex(sequenceList, song)
  const delPlayIndex = findIndex(playlist, song)
  if (delSequenceIndex < 0 || delPlayIndex < 0) {
    return
  }

  // 删除这首歌
  sequenceList.splice(delSequenceIndex, 1)
  playlist.splice(delPlayIndex, 1)

  // 当前播放歌曲的索引
  let currentIndex = state.currentIndex
  if (delPlayIndex < currentIndex || currentIndex === playlist.length) {
    // 如果删除的歌曲是：正在播放的这首歌前面的歌曲，或当这首播放的歌曲是列表最后一首歌，当前播放歌曲的索引要减少1
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playlist)
  commit('setCurrentIndex', currentIndex)
  if (!playlist.length) {
    commit('setPlayingState', false)
  }
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
