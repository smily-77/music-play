<template>
  <div class="singer-detail">
    <music-list></music-list>
  </div>
</template>

<script>
import { ref } from "vue";
import router from "@/router/index.js";
import MusicList from "@/components/music-list/music-list";
import { provide } from "vue";
import { useStore } from "vuex";
export default {
  name: "singer-detail",
  components: {
    MusicList,
  },
  setup() {

    const store = useStore();
    const songs = ref();
    const pic = ref();
    const title = ref("");
    const loading = ref(false);
    const finished = ref(false);
    provide("title", title);
    provide("pic", pic);
    provide("songs", songs);
    provide("loading", loading);
    provide("finished", finished);
    provide("rank", false);

    // 获取歌手详情图片和姓名
    const getDetail = async () => {
      let params = {
        id: router.currentRoute.value.params.id,
      };
      const res = await global.api.getSingerDetail(params);
      if (res.code === 200) {
        pic.value = res.data.artist.cover;
        title.value = res.data.artist.name;
      }
    };
    // 获取歌手歌曲
    const getSongs = async () => {
      let params = {
        id: router.currentRoute.value.params.id,
      };
      const res = await global.api.getHotSongs(params);
      if (res.code === 200) {
        songs.value = res.songs;

      }
      // 加载状态结束
      loading.value = false;
      finished.value = true;
      store.dispatch("saveAllMusics", {
        songs: songs,
      });
    };
    getSongs();
    getDetail();
    return {
      songs,
      pic,
    };
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  //   background: $color-background;
}
</style>
