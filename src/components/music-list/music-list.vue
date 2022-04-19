<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper">
        <div class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- <div class="filter"></div> -->
    </div>
    <div class="music-content">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <ul>
          <li
            v-for="(item, index) in songs"
            class="item"
            :key="item.id"
            @click="selectItem(item, index)"
          >
            <div class="rank" v-if="rank">
              <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
            </div>

            <img class="icon3" width="60" height="60" v-lazy="item.al.picUrl" />

            <div class="text1">
              <h2 class="name1">
                {{ item.name }}
              </h2>
              <p class="desc1">{{ getDesc(item) }}</p>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import router from "@/router/index.js";
import { processSongWords } from "@/assets/js/util.js";

// import { mapActions } from "vuex";
import { useStore } from "vuex";
export default {
  name: "music-list",
  setup() {
    const store = useStore();
    const title = inject("title");
    const pic = inject("pic");
    const songs = inject("songs");
    const loading = inject("loading");
    const finished = inject("finished");
    const rank = inject("rank");

    // 设置背景图片
    const bgImageStyle = computed(() => {
      return {
        backgroundImage: `url(${pic.value})`,
      };
    });
    // 获取歌曲描述
    const getDesc = (song) => {
      return `${song.al.name}·${song.alia}`;
    };

    // 添加歌曲属性
    const addAttr = (song, {url, duration, lyric}) => {
      let newSong = {...song, url, duration, lyric}
      return newSong
    }

    // 点击歌曲
    const selectItem = async (song, index) => {
      let params = {
        id: song.id,
      };
      let res = await global.api.getSongUrl(params);
      let songWords = await global.api.getSongWords(params);
      let { songWordMap, duration } = processSongWords(songWords);
      let lyric = songWords?.lrc?.lyric
          ? songWords?.lrc?.lyric
          : "[00:00:00]该歌曲暂无歌词\n";
      let url = res.data[0].url;
      store.dispatch("addSongAttr", {
        index,
        url,
        words: songWordMap,
        duration,
        lyric
      });
      // let newSong = {...song, url: res.data[0].url}
      // song.url = res.data[0].url;
      addAttr(song, {url, duration, lyric})
      console.log(1, index, song);
      store.dispatch("selectPlay", {
        song,
        index,
      });
    };

    // 随机播放
    const random = () => {
      store.dispatch("randomMusic");
      let randomFirst = store.getters.firstMusic;
      selectItem(randomFirst, 0);
    };

    // 返回上一页
    const goBack = () => {
      router.back();
    };

    const getRankCls = (index) => {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    };
    const getRankText = (index) => {
      if (index > 2) {
        return index + 1;
      }
    };

    return {
      store,
      title,
      pic,
      songs,
      loading,
      finished,
      rank,
      bgImageStyle,
      goBack,
      getDesc,
      selectItem,
      random,
      getRankCls,
      getRankText,
    };
  },
};
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
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-text-4;
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
    color: $color-text-4;
  }

  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    height: 35%;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-text-4;
        color: $color-text-4;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .music-content {
    position: fixed;
    width: 100%;
    top: 35%;
    bottom: 0;
    overflow: scroll;
    // border-radius: 10px;
    .item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 10px 20px 0px 20px;
      background: $color-theme;
      .rank {
        flex: 0 0 15px;
        width: 15px;
        margin-right: 5px;
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
          color:rgb(239,41,118);
          font-size: $font-size-large;
        }
      }
      .icon3 {
        flex: 0 0 60px;
        border-radius: 5px;
        width: 60px;
        padding-right: 20px;
        padding-left: 20px;
      }
      .text1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        font-size: $font-size-medium;
        overflow: hidden;
        .name1 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $color-text-3;
        }
        .desc1 {
          @include no-wrap();
          margin-top: 4px;
          color: #c8c9cc;
        }
      }
    }
  }
}
</style>
