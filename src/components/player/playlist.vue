<template>
  <teleport to="body">
    <!-- transition 来实现过渡效果 -->
    <transition name="list-fade">
      <!-- 播放列表 -->
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <!-- 列表头部操作栏 -->
          <div class="list-header">
            <h1 class="title">
              <i class="icon"></i>
              <span class="text"> 播放列表 </span>
            </h1>
          </div>
          <!-- 中间列表滚动栏 -->
          <scroll class="list-content" ref="scrollRef">
            <!-- 为了删除歌曲时，让列表也有个过渡效果-->
            <transition-group ref="listRef" name="list" tag="ul">
              <li class="item" v-for="song in sequenceList" :key="song.id" @click="selectItem(song)">
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavoriteSong(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" @click.stop="removeSong(song)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <!-- 列表底部操作栏 -->
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import { computed, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import useFavorite from '@/components/player/use-favorite'

export default {
  name: 'playlist',
  components: {
    Scroll
  },
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)

    const store = useStore()
    const playList = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    // hooks
    const { getFavoriteIcon, toggleFavoriteSong } = useFavorite()

    // 监听歌曲变化，更新播放列表
    show(currentSong, async (newSong) => {
      if (!visible.value) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    async function show() {
      visible.value = true
      // 在播放列表显示时，更新 DOM 后，刷新 scroll 组件
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }
    function hide() {
      visible.value = false
    }
    function getCurrentIcon(song) {
      if (currentSong.value.id === song.id) {
        return 'icon-play'
      }
    }
    function refreshScroll() {
      // scroll 组件又是滚动不了，是刷新时机不对
      scrollRef.value.scroll.refresh()
    }
    function scrollToCurrent() {
      // 获取当前歌曲在播放列表中的索引，滚到到此即可
      const idx = sequenceList.value.findIndex((song) => currentSong.value.id === song.id)
      if (idx === -1) {
        return
      }
      const target = listRef.value.children[idx]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    function selectItem(song) {
      const index = playList.value.findIndex((item) => {
        return song.id === item.id
      })
      // 选择当前歌曲后，更新播放状态
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }
    function removeSong(song) {
      store.dispatch('removeSong', song)
    }

    return {
      visible,
      playList,
      sequenceList,
      getFavoriteIcon,
      toggleFavoriteSong,
      show,
      hide,
      getCurrentIcon,
      scrollRef,
      selectItem,
      listRef,
      removeSong
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;
    .list-wrapper {
      transition: all .3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>