<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <!-- 背景图 -->
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <!-- 顶部导航 -->
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title"> {{currentSong.name}} </h1>
        <h2 class="subtitle"> {{currentSong.singer}} </h2>
      </div>
      <!-- 底部播放菜单栏 -->
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left" @click="prev">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center" @click="togglePlay">
            <i :class="playIcon"></i>
          </div>
          <div class="icon i-right" @click="next">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 通过ref 拿到这个audio -->
    <audio ref="audioRef" @pause="onPause"></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

export default {
  name: 'player',
  setup() {
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const audioRef = ref(null)
    const playingState = computed(() => store.state.playingState)
    const playIcon = computed(() => {
      return playingState.value ? 'icon-pause' : 'icon-play'
    })
    const playList = computed(() => store.state.playList)
    const currentIdx = computed(() => store.state.currentIndex)

    // 初始化时会执行一次，然后当监听的数据发生变化(即当前歌曲切换)时，watch 的回调函数会触发
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      // 调用播放
      audioEl.play()
    })
    watch(playingState, (newPlayingState) => {
      const audioEl = audioRef.value
      newPlayingState ? audioEl.play() : audioEl.pause()
    })

    function goBack() {
      store.commit('setFullScreen', false)
    }
    function togglePlay() {
      store.commit('setPlayingState', !playingState.value)
    }
    // 当电脑睡眠或其他情况导致播放停止时，同步播放状态为false
    function onPause() {
      store.commit('setPlayingState', false)
    }
    function loop () {
      const audieEl = audioRef.value
      audieEl.currentTime = 0
      audieEl.play()
    }
    function prev() {
      const list = playList.value
      if (!list) { return }
      if (list.length === 1) {
        loop()
      } else {
        // 修改索引和播放状态
        let idx = currentIdx.value - 1
        if (idx === -1) {
          idx = list.length - 1
        }
        store.commit('setCurrentIndex', idx)
        if (!playingState.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    function next() {
      const list = playList.value
      if (!list) { return }
      if (list.length === 1) {
        loop()
      } else {
        // 修改索引和播放状态
        let idx = currentIdx.value + 1
        if (idx === list.length) {
          idx = 0
        }
        store.commit('setCurrentIndex', idx)
        if (!playingState.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      playIcon,
      goBack,
      togglePlay,
      onPause,
      prev,
      next
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      // 置于底层
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
