// mini播放器拖动切歌
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "vue";
import { useStore } from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { processSongWords } from "@/assets/js/util";

BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);

  const store = useStore();
  const fullScreen = computed(() => store.state.fullScreen);
  const playlist = computed(() => store.getters.actualPlayList);
  // const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex);

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value;
  });

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

  onMounted(() => {
    let sliderVal;
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });

          sliderVal.on("slidePageChanged", async ({ pageX }) => {
            let id = playlist.value[pageX].id;       
            await setUrl(id, pageX);
            store.commit("setCurrentIndex", pageX);
            store.commit("setCurrentSong", playlist.value[pageX]);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0);
      }
    });

    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });

  onActivated(() => {
    slider.value.enable();
    slider.value.refresh();
  });

  onDeactivated(() => {
    slider.value.disable();
  });

  return {
    // PlayList,
    slider,
    sliderWrapperRef,
  };
}
