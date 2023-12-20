import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(0)
  const lyricListRef = ref(0)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    // 当前歌词在播放时，切换歌曲会导致歌词乱掉，所以需要清理
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0

    const lyric = await getLyric(newSong)
    // 需要通过 mutation，添加歌词
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })

    // 当一下切换多次，则切换掉的歌曲的歌词就不用处理了，处理当前歌曲的歌词即可
    if (currentSong.value.lyric !== lyric) {
      return
    }

    // 通过第三方库解析歌词
    currentLyric.value = new Lyric(lyric, handleLyric)

    // 在 player.vue 的 ready() 方法也调用 playLyric(), 这样无论歌词和歌曲哪个先执行都会触发播放歌词
    if (songReady.value) {
      playLyric()
    }
  })

  function playLyric() {
    const lyricVal = currentLyric.value
    if (lyricVal) {
      // 根据偏移量(毫秒)，更新歌词进度
      lyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const lyricVal = currentLyric.value
    if (lyricVal) {
      lyricVal.stop()
    }
  }

  /**
   * 解析歌词时能拿到歌词的行号
   * @param lineNum
   */
  function handleLyric({ lineNum }) {
    currentLineNum.value = lineNum
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    const scrollComp = lyricScrollRef.value
    if (lineNum > 5) {
      // 滚动时，顶部留5行的距离，这样当前歌词就一直显示在中间位置
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    lyricListRef,
    lyricScrollRef,
    stopLyric
  }
}
