<template>
  <div class="top-detail">
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
  name: "top-detail",
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
    provide("rank", true);

    // 获取榜单详情
    const getDetail = async () => {
      let params = {
        id: router.currentRoute.value.params.id,
      };
      const res = await global.api.getAlbumDetail(params);
      if (res.code === 200) {
        title.value = res.playlist.name;
      }
    };
    // 获取榜单歌曲
    const getSongs = async () => {
      let params = {
        id: router.currentRoute.value.params.id,
        limit :50,
        offset:0
      };
      const res = await global.api.getAlbumSong(params);
      if (res.code === 200) {
        songs.value = res.songs;
        pic.value = res.songs[0].al.picUrl
     
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
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  //   background: $color-background;
}
</style>
