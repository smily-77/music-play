import { PLAY_MODE } from '@/assets/js/constant'
// import { load } from '@/assets/js/array-store'

const state = {
  // 歌手列表
  singers: null,
  // 顺序播放列表
  sequenceList: [],
  // 真正的播放列表
  playlist: [],
  // 是否在播放
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 当前播放的歌
  currentIndex: 0,
  // 播放器的状态
  fullScreen: false,
  favoriteList: [],
  // searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
