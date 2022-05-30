<template>
  <div class="user-center">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches
        :items="['我喜欢的', '最近播放']"
        v-model="currentIndex"
      ></switches>
    </div>
    <div class="play-btn" v-if="currentList.length" @click="random">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <scroll class="list-scroll" v-if="currentIndex === 0">
        <div class="list-inner">
          <song-list :songs="favoriteList" showImg @select="selectSong">
          </song-list>
        </div>
      </scroll>
      <scroll class="list-scroll" v-if="currentIndex === 1">
        <div class="list-inner">
          <song-list :songs="playHistory" showImg @select="selectSong">
          </song-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import Switches from "@/components/base/switches/switches";
import Scroll from "@/components/wrap-scroll";
import SongList from "@/components/base/song-list/song-list";
import { mapState } from "vuex";
import { processSongWords } from "@/assets/js/util";
export default {
  name: "user-center",
  components: {
    Switches,
    Scroll,
    SongList,
  },
  data() {
    return {
      currentIndex: 0,
      // showImg:true
    };
  },
  created() {
  },
  computed: {
    currentList() {
      return this.currentIndex === 0 ? this.favoriteList : this.playHistory;
    },
    ...mapState(["favoriteList", "playHistory"]),
  },
  methods: {
    back() {
      this.$router.back();
    },

    // 添加歌曲属性
    addAttr (song, {url, duration, lyric}) {
      let newSong = {...song, url, duration, lyric}
      return newSong
    },

    // 点击歌曲
    async selectItem(song, index, isNew) {
      let params = {
        id: song.id,
      };
      let res = await global.api.getSongUrl(params);
      let songWords = await global.api.getSongWords(params);
      let { songWordMap, duration } = processSongWords(songWords);
      this.$store.dispatch("addSong", { song, isNew });
      let lyric = songWords?.lrc?.lyric
          ? songWords?.lrc?.lyric
          : "[00:00:00]该歌曲暂无歌词\n";
      let url = res.data[0].url;
      this.$store.dispatch("addSongAttr", {
        index,
        url,
        words: songWordMap,
        duration,
        lyric
      });
      this.addAttr(song, {url, duration, lyric})
      console.log(1, index, song);
      this.$store.dispatch("selectPlay", {
        song,
        index,
      });
    },

    async selectSong({ song }) {
      let playList = this.$store.getters.actualPlayList;
      let exist = playList.findIndex((item) => {
        return song.id === item.id;
      });
      let actualSong = null;
      if (exist == -1) {
        let { songs } = await global.api.getSongDetail({ ids: song.id });
        actualSong = songs[0];
      } else actualSong = playList[exist];
      let { index, isNew } = this.$store.getters.getNewSongIndex(actualSong);
      await this.selectItem(actualSong, index, isNew);
    },

   
// 随机播放歌曲
    random() {    
      this.$store.dispatch("cpListToSeq", {mode: this.currentIndex});
      this.$store.dispatch("randomMusic");
      let randomFirst = this.$store.getters.firstMusic;
      this.selectItem(randomFirst, 0);
    },
  },
};
</script>

<style scoped lang="scss">
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background-a;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme-t;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-theme-t;
    color: $color-theme-t;
    border-radius: 100px;
    font-size: 0;
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
  .list-wrapper {
    background: $color-background-2;
    position: absolute;
    margin: 10px 10px 0 10px;
    border-radius: 10px;
    top: 110px;
    bottom: 0;
    width: 95%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        color: $color-background;
        padding: 20px 30px;
      }
    }
  }
}
</style>
