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
      <!-- 中间 CD 唱片    -->
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img class="image" :class="cdCls" ref="cdImageRef" :src="currentSong.pic">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="line.num">
                {{ line.txt }}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{pureMusicLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <!-- 底部播放菜单栏 -->
      <div class="bottom">
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <span class="time time-l"> {{ formatTime(currentTime) }} </span>
          <div class="progress-bar-wrapper">
            <progress-bar :progress="progress"
            @progress-changing="onProgressChanging"
            @progress-changed="onProgressChanged"></progress-bar>
          </div>
          <span class="time time-r"> {{ formatTime(currentSong.duration) }} </span>
        </div>
        <!-- 菜单栏 -->
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left" @click="prev" :class="disableCls">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center" @click="togglePlay" :class="disableCls">
            <i :class="playIcon"></i>
          </div>
          <div class="icon i-right" @click="next" :class="disableCls">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavoriteSong(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 通过ref 拿到这个audio -->
    <audio ref="audioRef" @pause="onPause" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import useFavorite from './use-favorite'
import useCd from '@/components/player/use-cd'
import Scroll from '@/components/base/scroll/scroll.vue'
import useLyric from '@/components/player/use-lyric'
import ProgressBar from '@/components/player/progress-bar.vue'
import { formatTime } from '@/assets/js/util'

export default {
  name: 'player',
  components: {
    ProgressBar,
    Scroll
  },
  setup() {
    const store = useStore()
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    let progressChanging = false

    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playingState = computed(() => store.state.playingState)
    const playIcon = computed(() => playingState.value ? 'icon-pause' : 'icon-play')
    const playList = computed(() => store.state.playList)
    const currentIdx = computed(() => store.state.currentIndex)
    const disableCls = computed(() => songReady.value ? '' : 'disable')
    const progress = computed(() => currentTime.value / currentSong.value.duration)

    // hooks
    const { getFavoriteIcon, toggleFavoriteSong } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { currentLyric, currentLineNum, playLyric, lyricListRef, lyricScrollRef, stopLyric, pureMusicLyric, playingLyric } = useLyric({ songReady, currentTime })

    // 初始化时会执行一次，然后当监听的数据发生变化(即当前歌曲切换)时，watch 的回调函数会触发
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      // 歌曲更新时，时间也需要更新
      currentTime.value = 0
      // 这里置为 false, 下方 play() 时会触发 @canplay, 从而在对于方法中将 songReady 置为 true
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      // 调用播放
      audioEl.play()
    })
    watch(playingState, (newPlayingState) => {
      if (!songReady.value) {
        // 歌曲没缓存好时，直接返回，不播放
        return
      }
      const audioEl = audioRef.value
      if (newPlayingState) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    function goBack() {
      store.commit('setFullScreen', false)
    }
    function togglePlay() {
      if (!songReady.value) {
        return
      }
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
      if (!songReady.value || !list) { return }
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
      if (!songReady.value || !list) { return }
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
    function ready() {
      if (songReady.value) { return }
      songReady.value = true
      // 在 use-lyric.js 中的 songReady的情况下，playLyric() 这样无论歌词和歌曲哪个先执行都会触发播放歌词
      playLyric()
    }
    function error() {
      // 发生错误时，置为 true 使得可以切换歌曲
      songReady.value = true
    }
    function updateTime(e) {
      // 进度条没有被拖动时，才触发，避免手动拖动进度条时，进度条自身监听到变化，也进行了更新，导致拖动进度失败的现象
      if (!progressChanging) {
        // 利用 audio 的原生事件，监听并更新当前时间
        currentTime.value = e.target.currentTime
      }
    }
    function onProgressChanging(progress) {
      // 拖动进度条时，该标识置为 true
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
    }
    function onProgressChanged(progress) {
      // 拖动进度动作完成后，该标识置为 false
      progressChanging = false
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      // 进度更新后，如果播放状态是停止的，则开启播放
      if (!playingState.value) {
        store.commit('setPlayingState', true)
      }
    }
    function end() {
      // 当歌曲播放完成，跳到下一首
      currentTime.value = 0
      next()
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      playIcon,
      disableCls,
      cdCls,
      cdRef,
      cdImageRef,
      currentLyric,
      currentLineNum,
      lyricListRef,
      lyricScrollRef,
      goBack,
      togglePlay,
      onPause,
      prev,
      next,
      ready,
      error,
      getFavoriteIcon,
      toggleFavoriteSong,
      playLyric,
      stopLyric,
      pureMusicLyric,
      playingLyric,
      currentTime,
      progress,
      formatTime,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      end
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            .image {
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        // 与父元素的顶部对齐
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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
