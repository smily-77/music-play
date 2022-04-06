<template>
  <div class="tab">
    <router-link
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
      <span class="tab-link">
        {{tab.name}}
      </span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    data() {
      return {
        tabs: [
          {
            name: '推荐',
            path: '/recommend'
          },
          {
            name: '歌手',
            path: '/singer'
          },
          {
            name: '排行',
            path: '/top-list'
          },
          {
            name: '搜索',
            path: '/search'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;
    background:  $color-theme;
    .tab-item {
      flex: 1;
      text-align: center;

      .tab-link {
        padding-bottom: 5px;
        color: $color-text-2
      }

      &.router-link-active {
        .tab-link {
          font-size:$font-size-medium-x;
          color:  $color-background;
          border-bottom: 2px solid $color-background;
        }
      }
    }
  }
</style>
