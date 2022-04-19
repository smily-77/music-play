<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.coverImgUrl" />
          </div>
          <div class="text">
            <h2 class="name">
              {{ item.name }}
            </h2>
            <p class="desc" v-if="item.description">
              {{ item.description.substring(0, 26) + "..." }}
            </p>
          </div>
        </li>
      </ul>
    </scroll>
    <!-- <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop"/>
      </transition>
    </router-view> -->
  </div>
</template>

<script>
import Scroll from "@/components/wrap-scroll";
//   import { getTopList } from '@/service/top-list'
import { TOP_KEY } from "@/assets/js/constant";
import storage from "good-storage";

export default {
  name: "top-list",
  components: {
    Scroll,
  },
  data() {
    return {
      topList: [],
      loading: true,
      // selectedTop: null
    };
  },
  async created() {
    this.loading = false;
    let params = {};
    const res = await global.api.getToplist(params);
    if (res.code === 200) {
      this.topList = res.list;
    }
  },
  methods: {
    selectItem(top) {
      this.selectedTop = top;
      this.cacheTop(top);
      this.$router.push({
        path: `/top-list/${top.id}`,
      });
    },
    cacheTop(top) {
      storage.session.set(TOP_KEY, top);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 100px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 20px 10px;
      padding: 10px;
      height: 100px;
      background: rgb(225, 235, 234);
      border-radius: 10px;

      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .text {
        display: flex;
        flex-direction: column;
        // justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgb(21,159,136);
          height:20px;
          padding: 10px;
          font-weight: bolder;
          font-size: $font-size-large-x;
        }
        .desc {
          margin-top: 4px;
          color: rgb(132,141,140);
          font-size: $font-size-medium;
        }
      }
    }
  }
}
</style>
