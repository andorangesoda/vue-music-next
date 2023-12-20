import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric() {
  const currentLyric = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    const lyric = await getLyric(newSong)
    // 需要通过 mutation，添加歌词
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    if (currentSong.value.lyric !== lyric) {
      // 当一下切换多次，则切换掉的歌曲的歌词就不用处理了，处理当前歌曲的歌词即可
      return
    }
    // 通过第三方库解析歌词
    currentLyric.value = new Lyric(lyric, handleLyric())
  })

  function handleLyric() {
  }

  return {
    currentLyric
  }
}
