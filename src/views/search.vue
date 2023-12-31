<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <!-- 热门搜索标签 -->
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
            <span>{{item.key}}</span>
          </li>
        </ul>
      </div>
    </div >
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-song="selectSong" @select-singer="selectSinger"></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import { ref } from 'vue'
import { getHotKeys } from '@/service/search'
import Suggest from '@/components/search/suggest.vue'
import { useStore } from 'vuex'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import router from '@/router'

export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const store = useStore()
    const selectedSinger = ref(null)

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })

    function addQuery(content) {
      query.value = content
    }
    function selectSong(song) {
      // 操作 store 中的内容
      store.dispatch('addSong', song)
    }
    function selectSinger(singer) {
      selectedSinger.value = singer
      cacheSinger(singer)
      // 将歌手列表挂在到搜索路由下
      router.push({
        path: `/search/${singer.mid}`
      })
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
