import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY,PLAY_KEYS } from "@/assets/js/constant";
import { load } from "@/assets/js/array-store";

const state = {
  // 歌手列表
  singers: null,
  // 顺序播放列表
  sequenceList: [],
  // 随机播放列表
  randomList: [],
  // 是否在播放
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 当前播放的歌
  currentIndex: 0,
  // 播放器的状态
  fullScreen: false,
  // 收藏歌单列表
  favoriteList: load(FAVORITE_KEY),
  // 搜索历史
  searchHistory: load(SEARCH_KEY),
  playHistory:load(PLAY_KEYS),
  // 当前播放的歌曲
  currentSong: {},
  // 上一首播放歌曲的index
  lastPreIndex: -1,
  // 后一首播放歌曲的index
  lastNextIndex: -1,
};

export default state;
