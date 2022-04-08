<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <div class="play-btn-wrapper">
        <div class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- <div class="filter"></div> -->
    </div>

    <div class="music-content" >
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
            <img class="icon" width="60" height="60" v-lazy="item.al.picUrl" />

            <div class="text">
              <h2 class="name">
                {{ item.name }}
              </h2>
              <p class="desc">{{ getDesc(item) }}</p>
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

    // 点击歌曲
    const selectItem = async (song, index) => {
      store.dispatch("selectPlay", {
        list: song,
        index,
      });
      console.log(song.al.id, "song");

      let params = {
        id: song.id,
      };
      const res = await global.api.getSongUrl(params);
      console.log(res, "urllllll");
      console.log(res.data[0].url, "23456");
    };
    // 随机播放
    const random = () => {
      store.dispatch("randomPlay", {
        list: songs.value,
      });
    };

    // 返回上一页
    const goBack = () => {
      router.back();
    };


    return {
   
      title,
      pic,
      songs,
      loading,
      finished,
      bgImageStyle,
      goBack,
      getDesc,
      selectItem,
      random,
     
     
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
      .icon {
        flex: 0 0 60px;
        border-radius: 5px;
        width: 60px;
        padding-right: 20px;
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        font-size: $font-size-medium;
        overflow: hidden;
        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $color-text-3;
        }
        .desc {
          @include no-wrap();
          margin-top: 4px;
          color: #c8c9cc;
        }
      }
    }
  }
}
</style>
