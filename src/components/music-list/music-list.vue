<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <i class="icon-back"></i>
    </div>

    <h1 class="title"> {{title}} </h1>

    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <!-- 蒙板 -->
      <div class="filter"></div>
      <!-- 随机播放 -->
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="onRandomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>

    <scroll class="list" :style="scrollStyle" :probe-type="3" @scroll="onScroll">
      <!-- 歌曲列表 -->
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="onSelectSong" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list'
import { mapActions, mapState } from 'vuex'

// 歌曲列表到顶部之间保留40px
const RESERVED_HEIGHT = 40

export default {
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    rank: Boolean
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      // 歌曲列表最大可以滚动的高度
      maxTranslateY: 0
    }
  },
  computed: {
    bgImageStyle() {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      // 兼容移动端问题
      let translateZ = 0

      if (scrollY > this.maxTranslateY) {
        // 数值越大，元素就越靠前。目的是不要让歌曲列表遮盖了顶部保留的背景图
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // 当下滑时设置缩放比例
      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        backgroundImage: `url(${this.pic})`,
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    scrollStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    playBtnStyle() {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return { display }
    },
    ...mapState([
      'playList'
    ])
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  methods: {
    onScroll(pos) {
      // 获取当前滚动位置，为了方便计算，取负值，即往下滑为负数，往上滑为正数
      this.scrollY = -pos.y
    },
    onSelectSong({ song, index }) {
      // 选择歌曲后，触发子组件中自定义事件，然后父组件监听并响应
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    onRandomPlay() {
      this.randomPlay(this.songs)
    },
    // 使用到 actions 中的方法
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    // 元素沿正z轴方向平移2像素
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    // 指定元素变换的原点在顶部
    transform-origin: top;
    background-size: cover;
    // 动态处理
    // padding-bottom: 70%;
    // height: 0;
    .filter {
      position: absolute;
      // 水平、垂直居中
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    .play-btn-wrapper{
      position: absolute;
      width: 100%;
      bottom: 20px;
      z-index: 10;
      .play-btn{
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        font-size: 0;
        color: $color-theme;
        border: 1px solid $color-theme;
        border-radius: 100px;
        box-sizing: border-box;
      }
      .icon-play{
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text{
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
