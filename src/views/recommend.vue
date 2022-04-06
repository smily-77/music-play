<template>
  <div class="recommend-content">
    <!-- 轮播图· -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="items in banners" :key="items.encodeId">
        <img :src="items.imageUrl" alt="" />
      </van-swipe-item>
    </van-swipe>
    <!-- 歌单列表 -->
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ul>
          <li
            v-for="item in lists"
            class="item"
            :key="item.id"
            @click="selectItem(item)"
          >
            <img class="icon" width="60" height="60" :src="item.picUrl" />

            <div class="text">
              <h2 class="name">
                {{ item.name }}
              </h2>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import storage from "good-storage";
import { ALBUM_KEY } from "@/assets/js/constant";
import router from "@/router/index.js";
export default {
  name: "Recommend",
  setup() {
    // 轮播图数据
    const banners = ref("");
    // 歌单列表数据
    const lists = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    // 获取点击的歌单数据
    const selectedAlbum = ref(null);

    // 获取轮播图数据
    const getSwipe = async () => {
      let params = {
        type: 0,
      };
      const res = await global.api.getBanner(params);
      if (res.code === 200) {
        banners.value = res.banners;
      }
    };
    getSwipe();

    const onLoad = async () => {
      let params = {
        limit: 30,
      };
      const res = await global.api.getPersonalized(params);
      if (res.code === 200) {
        lists.value = res.result;
      }
      // 加载状态结束
      loading.value = false;
      finished.value = true;
    };

    // 点击歌单跳转歌单详情页面
    const selectItem = (album) => {
      console.log(album.id, "dianji1");
      selectedAlbum.value = album;
      cacheAlbum(album);
      router.push({
        path: `/playlist/detail/${album.id}`,
      });
    };

    // 保存点击的歌单数据
    const cacheAlbum = (album) => {
      storage.session.set(ALBUM_KEY, album);
    };

    return {
      banners,
      lists,
      onLoad,
      loading,
      finished,
      selectItem,
      cacheAlbum,
    };
  },
};
</script>

<style lang="scss" scoped>
.recommend-content {
  position: fixed;
  width: 100%;
  top: 94px;
  bottom: 0;
  overflow: scroll;
  .my-swipe .van-swipe-item {
    height: 110px;
    width: 100%;
    background: $color-theme;
    padding: 6px 0 8px 0;
    border-radius: 0 0 10px 10px;
    img {
      width: 98%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .recommend-list {
    .list-title {
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-large;
      color: $color-background;
      background: $color-theme;
      border-radius: 10px;
      margin-top: 16px;
    }
    .item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 0 20px 12px 20px;
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
        }
      }
    }
  }
}
</style>
