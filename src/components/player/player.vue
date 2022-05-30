<template>
  <div class="player" v-show="showPlayView">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.al.picUrl" />
        </div>
        <!-- 顶部歌曲名和歌手名 -->
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.ar[0]?.name }}</h2>
        </div>
        <!-- 中间旋转图片 -->
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.al.picUrl"
                />
              </div>
            </div>
            <!-- 当前播放歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部进度条和按钮 -->
        <div class="bottom">
          <!-- 歌词和图片页面切换 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <!-- 播放进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ currentSong.duration }}</span>
          </div>
          <!-- 底部按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>

    <audio
      :src="songUrl"
      autoplay
      ref="audioRef"
      @canplay="ready"
      @error="error"
      @pause="pause"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, ref, watch, nextTick } from "vue";

import { PLAY_MODE } from "@/assets/js/constant.js";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCd from "./use-cd";
import useLyric from "./use-lyric";
import useMiddleInteractive from "./use-middle-interactive";
import useAnimation from "./use-animation";
import usePlayHistory from "./use-play-history";
import ProgressBar from "./progress-bar";
import Scroll from "@/components/base/scroll/scroll";
import MiniPlayer from "./mini-player";
import { formatTime, processSongWords, getSecond } from "@/assets/js/util";

export default {
  name: "player",
  components: {
    MiniPlayer,
    ProgressBar,
    Scroll,
  },
  setup() {
    // data
    const audioRef = ref(null);
    const barRef = ref(null);
    const songReady = ref(false);
    const currentTime = ref(0);
    let progressChanging = false;

    // vuex
    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const songUrl = computed(() => store.state.currentSong?.url);

    const playing = computed(() => store.state.playing);
    const currentIndex = computed(() => store.state.currentIndex);
    const sequenceList = computed(() => store.state.sequenceList);
    const randomList = computed(() => store.state.randomList);
    const playMode = computed(() => store.state.playMode);

    // hooks
    const { modeIcon } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdCls, cdRef, cdImageRef } = useCd();
    const {
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      lyricScrollRef,
      lyricListRef,
      playLyric,
      stopLyric,
    } = useLyric({
      songReady,
      currentTime,
    });
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useMiddleInteractive();
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } =
      useAnimation();
    const { savePlay } = usePlayHistory();
    // computed
    //设置播放和暂停按钮
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });
    //
    const showPlayView = computed(() => {
      if (randomList.value.length || sequenceList.value.length) {
        return true;
      } else {
        return false;
      }
    });

    // 进度条显示
    const progress = computed(() => {
      let timeone = currentSong.value.duration;
      var parts = timeone.split(":"),
        minutes = +parts[0],
        seconds = +parts[1];
      let durationTime = (minutes * 60 + seconds).toFixed(3);
      return currentTime.value / durationTime;
    });

    const disableCls = computed(() => {
      return songReady.value ? "" : "disable";
    });

    onMounted(() => {
      const audioEl = audioRef.value;
      if (audioEl) {
        audioEl.src = currentSong.value.url;
        audioEl.play();
      }
    });

    // watch
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0;
      songReady.value = false;
      const audioEl = audioRef.value;
      if (audioEl) {
        audioEl.src = newSong.url;
        audioEl.play();
      }
      currentLineNum.value = 0;
      store.commit("setPlayingState", true);
    });

    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (audioEl) {
        if (newPlaying) {
          audioEl.play();
          playLyric();
        } else {
          audioEl.pause();
          stopLyric();
        }
      }
    });

    watch(fullScreen, async (newFullScreen) => {
      // 重新设置进度条宽度
      if (newFullScreen) {
        await nextTick();
        barRef.value.setOffset(progress.value);
      }
    });

    // methods
    // 返回方法
    function goBack() {
      // router.back();
      store.commit("setFullScreen", false);
    }
    // ni
    // 播放按钮
    function togglePlay() {
      if (!songReady.value) {
        return;
      }
      store.commit("setPlayingState", !playing.value);
    }

    // 暂停音乐
    function pause() {
      store.commit("setPlayingState", false);
    }

    // 切换音乐播放模式
    function changeMode() {
      let currentMode = store.state.playMode;
      let newMode = (currentMode + 1) % Object.keys(PLAY_MODE).length;
      store.dispatch("changeMode", newMode);
    }

    // 当切换歌曲时, 为歌曲追加url属性, 同时缓存
    async function setUrl(id, index) {
      let existUrl = store.getters.existSongUrl(index);
      if (!existUrl) {
        let params = {
          id,
        };
        let res = await global.api.getSongUrl(params);
        let songWords = await global.api.getSongWords(params);
        let { songWordMap, duration } = processSongWords(songWords);
        store.dispatch("addSongAttr", {
          index,
          url: res.data[0].url,
          words: songWordMap,
          duration: duration,
          lyric: songWords?.lrc?.lyric
            ? songWords?.lrc?.lyric
            : "[00:00:00]该歌曲暂无歌词\n",
        });
      }
    }

    // 根据播放次序模式选择下一首 或 前一首歌曲
    function chooseSong(index, lens) {
      if (index > lens - 1) return 0;
      else if (index < 0) return lens - 1;
      else {
        return index;
      }
    }

    // 上一首歌
    async function prev() {
      let list = [];
      if (store.state.playMode == PLAY_MODE.random) list = randomList.value;
      else list = sequenceList.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = chooseSong(currentIndex.value - 1, list.length);

        if (index >= 0) {
          currentTime.value = 0;
          await setUrl(list[index]?.id, index);
          store.commit("setCurrentIndex", index);
          store.commit("setCurrentSong", list[index]);
          store.commit("setPlayingState", true);
        }
      }
      currentLineNum.value = 0;
    }

    // 下一首歌
    async function next() {
      let list = [];
      if (store.state.playMode == PLAY_MODE.random) list = randomList.value;
      else list = sequenceList.value;

      if (list.length === 1) {
        loop();
      } else {
        currentTime.value = 0;
        let index = chooseSong(currentIndex.value + 1, list.length);
        if (index >= 0) {
          await setUrl(list[index]?.id, index);
          store.commit("setCurrentIndex", index);
          store.commit("setCurrentSong", list[index]);
          store.commit("setPlayingState", true);
        }
      }
      currentLineNum.value = 0;
    }

    // 循环播放当前歌曲
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }

    function ready() {
      console.log("resdy1");
      if (songReady.value) {
        console.log("resdy2");
        return;
      }
      console.log("resdy3");
      songReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }

    function error() {
      songReady.value = true;
    }

    // 更新进度条时间
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime;
      }
    }

    // 左侧当前时间时事改变
    function onProgressChanging(progress) {
      progressChanging = true;
      let tTime = getSecond(currentSong.value.duration);
      currentTime.value = tTime * progress;
      stopLyric();
      playLyric();
    }

    function onProgressChanged(progress) {
      progressChanging = false;

      let tTime = getSecond(currentSong.value.duration);

      audioRef.value.currentTime = currentTime.value = tTime * progress;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }

    // 监听歌曲是否播放完毕
    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }

    return {
      audioRef,
      barRef,
      songUrl,
      fullScreen,
      currentTime,
      currentSong,
      sequenceList,
      // playlist,
      playIcon,
      showPlayView,
      disableCls,
      progress,
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      formatTime,
      getSecond,
      onProgressChanging,
      onProgressChanged,
      end,
      // // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // // cd
      cdCls,
      cdRef,
      cdImageRef,
      // // lyric
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      lyricScrollRef,
      lyricListRef,
      // // middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // // animation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background-1;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-text-4;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        // display:none;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text-4;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-text-4;
          &.disable {
            color: $color-text-4;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
