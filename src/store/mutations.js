const mutations = {
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  setPlayList(state, list) {
    state.playList = list
  },
  setPlayingState(state, playingState) {
    state.playingState = playingState
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavoriteList(state, list) {
    state.favoriteList = list
  }
}

export default mutations
