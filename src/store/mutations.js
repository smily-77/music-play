import { shuffle } from '@/assets/js/util'
const mutations = {
  // 修改歌手列表
  saveSingers(state, data) {
    state.singers = data;
  },

  // 修改播放状态
  setPlayingState(state, playing) {
    state.playing = playing;
  },
  // 设置顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list;
  },
  // 设置播放列表
  setPlaylist(state, list) {
    state.playlist = list;
  },
  setList(state, list) {
    state.randomList = list;
  },

  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode;
  },
  // 设置当前播放索引
  setCurrentIndex(state, index) {
    state.currentIndex = index;
  },
  // 设置播放器状态
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen;
  },
  // 设置收藏
  setFavoriteList(state, list) {
    state.favoriteList = list;
  },
  addSongLyric(state, { song, lyric }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric;
      }
      return item;
    });
  },
  setSearchHistory(state, searches) {
    state.searchHistory = searches;
  },
  setPlayHistory(state, songs) {
    state.playHistory = songs;
  },

  // 存放当前歌曲
  setCurrentSong(state, song) {
    state.currentSong = song;
  },

  // 追加url数据
  addSongUrl(state, {index, url}) {
    state.sequenceList[index].url = url;
  },

  // 追加歌曲歌词
  addSongWords(state, {index, words, lyric}) {
    state.sequenceList[index].words = words;
    state.sequenceList[index].lyric = lyric;
  },

  addSongDuration(state, {index, duration}) {
    state.sequenceList[index].duration = duration;
  },

  // 改变歌曲播放次序
  changeMode(state, mode) {
    state.playMode = mode;
  },

  //记录上一次前一首播放的歌曲index
  setLastPreIndex(state, index) {
    state.lastPreIndex = index;
  },

  //记录上一次后一首播放的歌曲index
  setLastNextIndex(state, index) {
    state.lastNextIndex = index;
  },

  // 初始化随机歌曲数组
  setRandomList(state) {
    console.log('old', state.sequenceList);
    state.randomList = shuffle(state.sequenceList);
    console.log('new', state.randomList);
  },
  

};

export default mutations;
