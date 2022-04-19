<template>
  <div ref="rootRef" class="suggest" v-loading:[loadingText]="loading">
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="sing in singer"
        :key="sing.id"
        @click="selectSinger(sing)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ sing.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon" v-show="showIcon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from "vue";
// import { search } from "@/service/search";
// import { processSongs } from "@/service/song";
import usePullUpLoad from "./use-pull-up-load";
// import Scroll from "@/components/base/scroll/scroll";
export default {
  name: "suggest",
  // components: {
  //   Scroll,
  // },
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["select-song", "select-singer"],
  setup(props, { emit }) {
    const singer = ref([]);
    const songs = ref([]);
    const showIcon = ref(true);

    const loadingText = ref("");

    const loading = computed(() => {
      return !songs.value.length;
    });

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value;
    });

    const { isPullUpLoad, rootRef } = usePullUpLoad();

    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) {
          return;
        }
        await searchFirst();
      }
    );

    // 搜索
    async function searchFirst() {
      if (!props.query) {
        return;
      }
      songs.value = [];
      let params2 = {
        keywords: props.query,
        type: 100,
        limit: 3,
      };
      const resSinger = await global.api.getSearchSong(params2);
      if (resSinger.result.hasMore === true) {
        singer.value = resSinger.result.artists;
      } else {
        singer.value = [];
      }

      let params1 = {
        keywords: props.query,
        type: 1,
      };
      const resSong = await global.api.getSearchSong(params1);
      if (resSong.code === 200) {
        songs.value = resSong.result.songs;
        showIcon.value = true;
        if (resSong.result.songCount === 0 && singer.value.length===0) {
          songs.value = [{ id: 1, name: "抱歉，暂无搜索结果" }];
          showIcon.value = false;
        }
      }

      await nextTick();
    }
    // 点击歌曲
    const selectSong = (song) => {
      emit("select-song", song);
    };
    // 点击歌手
    const selectSinger = (singer) => {
      emit("select-singer", singer);
    };

    return {
      singer,
      songs,
      loadingText,
      // noResultText,
      loading,
      showIcon,
      // showList
      // noResult,
      pullUpLoading,
      selectSong,
      selectSinger,
      // pullUpLoad
      rootRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  background: $color-background-2;
  margin:10px;
  padding-top:20px;
  border-radius: 10px;
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
          color: $color-text-6;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color:$color-text-6;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
