// 歌词相关
import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
// import { getLyric } from '@/service/song'
import Lyric from "lyric-parser";

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null);
  const currentLineNum = ref(0);
  // 纯音乐
  const pureMusicLyric = ref("");
  //当前播放的歌词
  const playingLyric = ref("");
  // 滚动组件实例
  const lyricScrollRef = ref(null);
  // list Dom实例
  const lyricListRef = ref(null);

  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);

  watch(currentSong, async (newSong) => {
    if (!newSong.id) {
      return;
    }
    stopLyric();
    currentLyric.value = null;
    currentLineNum.value = 0;
    pureMusicLyric.value = "";
    playingLyric.value = "";

    const lyric = currentSong.value.lyric;
    if (currentSong.value.lyric !== lyric) {
      return;
    }

    currentLyric.value = new Lyric(lyric, handleLyric);
    const hasLyric = currentLyric.value.lines.length;
    if (hasLyric) {
      if (songReady.value) {
        playLyric();
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(
        /\[(\d{2}):(\d{2}):(\d{2})\]/g,
        ""
      );
    }
  });

  function playLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000);
    }
  }

  // 停止滚动
  function stopLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.stop();
    }
  }

  // 歌词滚动
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    const scrollComp = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    if (!listEl) {
      return;
    }
    // 保持当前歌词居中
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5];
      scrollComp.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000);
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric,
  };
}
