<template>
  <div class="suggest" ref="rootRef">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{song.singer}}-{{song.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from '@/components/search/use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)

    const { rootRef } = usePullUpLoad(searchMore)
    // 直接 watch(props.query, (newQuery) => {}) 不行，因为 watch 的值要求是一个响应式对象，
    // 而 prop.query 最后的值是一个普通字符串，所以可以通过 watch 一个getter函数 ()=> prop.query
    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    async function searchFirst() {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
    }
    async function searchMore() {
      if (!hasMore.value) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      // 因为 processSongs 每次只能处理这页数据，所以还需要拼接原先页的数据
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
    }

    return {
      singer,
      songs,
      rootRef
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
