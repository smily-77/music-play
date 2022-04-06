<template>
  <div class="singer-content">
    <keep-alive>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        @load="getSingerList"
      >
        <van-index-bar>
          <div v-for="(value, key) in store.getters.getSingers" :key="key">
            <van-index-anchor :index="key" class="listItemElse" />
            <ul class="listItem">
              <li
                v-for="(t, index) in value"
                :key="index"
                class="item"
                @click="selectSinger(t)"
              >
                <img class="avatar" v-lazy="t.picUrl" />
                <span class="name">{{ t.name }}</span>
              </li>
            </ul>
          </div>
        </van-index-bar>
      </van-list>
    </keep-alive>
  </div>
</template>
<script>
import { ref } from "vue";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
import router from "@/router/index.js";
import { useStore } from "vuex";
export default {
  name: "Singer",
  setup() {
    //歌手表单数据
    const store = useStore();
    const singers = ref({});
    const loading = ref(false);
    const finished = ref(false);
    // 点击的歌手信息
    const oneSinger = ref();
    

    const getSingerList = async () => {
        console.log(store.getters.getSingers, 99)
        if (store.getters.getSingers == null) {
            getNewSingerList();
        }
    }


    // 请求获取全部歌手数据
    const getNewSingerList = async () => {
      let tempSinger = {}
      let urls = [];
      for (let i = 65; i < 91; i++) {
        let name = String.fromCharCode(i);
        let url = `/artist/list?type=-1&area=-1&initial=${name}`;
        urls.push(url);
      }
      let res = await global.api.getSinger(urls);
      let j = 65;
      for (let r = 0; r < res.length; r++) {
        let name = String.fromCharCode(j);
        tempSinger[name] = res[r].data?.artists;
        j++;
      }
    //   console.log(singers.value, "1");
      // 加载状态结束
      loading.value = false;
      finished.value = true;
      store.commit('saveSingers', tempSinger);
    };
    
    // 点击歌手获取歌手详情
    const selectSinger = (singer) => {
      oneSinger.value = singer;
      cacheSinger(singer);
      console.log(oneSinger.value, "111111");
      router.push({
        path: `/artist/detail/${singer.id}`,
      });
    };
    //缓存点击的歌手信息
    const cacheSinger = (singer) => {
      storage.session.set(SINGER_KEY, singer);
    };
    

    return {
      store,
      singers,
      getSingerList,
      loading,
      finished,
      oneSinger,
      cacheSinger,
      selectSinger,
    };
  },
};
</script>

<style lang="scss" scoped>
.singer-content {
  position: fixed;
  width: 100%;
  top: 93px;
  bottom: 0;
  overflow: scroll;
  .listItemElse{
      background: #ebedf0;
  }
  .listItem {
    background: $color-text;
    border-radius: 10px;
    .item {
      display: flex;
      align-items: center;
      height: 50px;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-3;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>
