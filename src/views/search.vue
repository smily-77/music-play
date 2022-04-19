<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="(item, index) in hotKeys"
              :key="index"
              @click="addQuery(item.first)"
            >
              <span>{{ item.first }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史 </span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch, nextTick } from "vue";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
import SearchInput from "@/components/search/search-input";
import Suggest from "@/components/search/suggest";
import Scroll from "@/components/wrap-scroll";
import Confirm from "@/components/base/confirm/confirm";
import SearchList from "@/components/base/search-list/search-list";
import router from "@/router/index.js";
import { useStore } from "vuex";
import { processSongWords } from "@/assets/js/util.js";
import useSearchHistory from "@/components/search/use-search-history";

export default {
  name: "search",
  components: {
    Confirm,
    Scroll,
    SearchList,
    SearchInput,
    Suggest,
  },
  setup() {
    const query = ref("");
    const hotKeys = ref([]);
    const store = useStore();
    const scrollRef = ref(null);
    const confirmRef = ref(null);

    const searchHistory = computed(() => store.state.searchHistory);
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();
    //  clearSearch
    // 获取热门标签·
    const getHotKeys = async () => {
      let params = {};
      const res = await global.api.getHotSearch(params);
      if (res.code === 200) {
        hotKeys.value = res.result.hots;
      
      }
    };
    getHotKeys();

    //点击热门标签
    const addQuery = (s) => {
      query.value = s;
    };
    // 播放歌曲
    const selectSong = async (song) => {
      saveSearch(query.value);
      let playList = store.getters.actualPlayList;
      let exist = playList.findIndex((item) => {
        return song.id === item.id;
      });
      let actualSong = null;
      console.log(exist)
      if (exist == -1) {
        let { songs } = await global.api.getSongDetail({ ids: song.id });
        actualSong = songs[0];
      }
      else 
        actualSong = playList[exist];
      let { index, isNew } = store.getters.getNewSongIndex(actualSong);
      await selectItem(actualSong, index, isNew);
    };

    // 添加歌曲属性
    const addAttr = (song, {url, duration, lyric}) => {
      let newSong = {...song, url, duration, lyric}
      return newSong
    }

    // 点击歌曲
    const selectItem = async (song, index, isNew) => {
      let params = {
        id: song.id,
      };
      let res = await global.api.getSongUrl(params);
   
      let songWords = await global.api.getSongWords(params);
      let { songWordMap, duration } = processSongWords(songWords);
      store.dispatch("addSong", { song, isNew });
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
      addAttr(song, {url, duration, lyric})
      console.log(1, index, song);
      store.dispatch("selectPlay", {
        song,
        index,
      });
    };
    // 展示歌手详情页面
    const selectSinger = (singer) => {
      saveSearch(query.value);
      // selectedSinger.value = singer;
      cacheSinger(singer);
      router.push({
        path: `/artist/detail/${singer.id}`,
      });
    };
    //缓存点击的歌手信息
    const cacheSinger = (singer) => {
      storage.session.set(SINGER_KEY, singer);
    };

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick();
        refreshScroll();
      }
    });

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }
    // 点击请空按钮
    function showConfirm() {
      confirmRef.value.show();
    }

    return {
      query,
      hotKeys,
      scrollRef,
      addQuery,
      selectSong,
      selectSinger,
      searchHistory,
      deleteSearch,
      clearSearch,
      showConfirm,
      confirmRef,
    };
  },
};
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
    margin: 20px 10px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 10px 20px 10px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium-x;
        font-weight: bolder;
        color: $color-text-5;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: rgb(236, 224, 246);
        font-size: $font-size-medium;
        color: rgb(144, 43, 242);
      }
    }
    .search-history {
      position: relative;
      left: 0;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        .text {
          flex: 1;
          font-size: $font-size-medium-x;
          font-weight: bolder;
          color: $color-text-5;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-5;
          }
        }
      }
    }
  }
  .search-result {
    margin-top:-20px ;
    flex: 1;
    overflow: hidden;
  }
}
</style>
