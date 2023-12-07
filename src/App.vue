<template>
  <m-header></m-header>
  <router-view></router-view>
</template>

<script>
import Header from '@/components/header/header'

export default {
  components: {
    MHeader: Header
  }
}
</script>

<style lang="scss">
</style>
