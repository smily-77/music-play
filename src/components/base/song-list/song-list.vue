<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <div class="rank" v-if="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <img
        v-if="showImg"
        class="icon3"
        width="60"
        height="60"
        v-lazy="getPicUrl(song)"
      />
      <div class="content">
        <h2 class="name">{{ song.name }}-{{ getDesc(song) }}</h2>
        <!-- <p class="desc">{{ getDesc(song) }}</p> -->
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "song-list",
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    rank: Boolean,
    showImg: Boolean,
  },
  emits: ["select"],
  methods: {
    getDesc(song) {
      if (song.al) {
        return `${song.al.name}`;
      }
    },
    selectItem(song, index) {
      this.$emit("select", { song, index });
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
    getPicUrl(song) {
      if (song.al) {
        return song.al.picUrl;
      } else {
        return "https://p2.music.126.net/IEAkeEbgwWHqj8toum0F9g==/109951163542956252.jpg";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.song-list {
  // background: red;
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    // border-bottom: 1px solid $color-text-6;
    height: 63px;
    margin: 10px 0;
    padding: 0 10px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image("first");
        }
        &.icon1 {
          @include bg-image("second");
        }
        &.icon2 {
          @include bg-image("third");
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .icon3 {
      margin-right: 10px;
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text-6;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-6;
      }
    }
  }
}
</style>
