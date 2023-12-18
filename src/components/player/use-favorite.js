import { useStore } from 'vuex'
import { computed } from 'vue'
import { remove, save } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function isFavorite(song) {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }

  function toggleFavoriteSong(song) {
    const list = isFavorite(song)
      ? remove(FAVORITE_KEY, compare)
      : save(FAVORITE_KEY, song, compare, maxLen)

    store.commit('setFavoriteList', list)

    // 这个函数放到函数的内部，是需要使用到 song.id
    function compare(item) {
      return item.id === song.id
    }
  }

  return {
    getFavoriteIcon,
    toggleFavoriteSong
  }
}
