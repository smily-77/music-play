import { shuffle } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant';
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
  // setRandomList(state, list) {
  //   state.randomList = list;
  // },

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
  // 设置搜索历史
  setSearchHistory(state, searches) {
    state.searchHistory = searches;
  },

  setPlayHistory(state, songs) {
    state.playHistory = songs;
    console.log(songs,"ssssss")
    // state.playHistory=[]

  },

  // 存放当前歌曲
  setCurrentSong(state, song) {
    state.currentSong = song;
  },

  // 追加url数据
  addSongUrl(state, {index, url}) {
    if (state.playMode == PLAY_MODE.random)
        state.randomList[index].url = url;
    else {
        state.sequenceList[index].url = url;
    } 
  },

  // 追加歌曲歌词
  addSongWords(state, {index, words, lyric}) {
    if (state.playMode == PLAY_MODE.random) {
      state.randomList[index].words = words;
      state.randomList[index].lyric = lyric;
    }
    else {
      state.sequenceList[index].words = words;
      state.sequenceList[index].lyric = lyric;
    }
  },

  addSongDuration(state, {index, duration}) {
    if (state.playMode == PLAY_MODE.random) {
      state.randomList[index].duration = duration;
    }
    else {
      state.sequenceList[index].duration = duration;
    }
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
   
    state.randomList = shuffle(state.sequenceList);
   
  },

  // 将最爱歌曲cp到顺序列表
  cpListToSeq(state, mode) {
    if (mode == 0)
      state.sequenceList = state.favoriteList;
    else
      state.sequenceList = state.playHistory
  }
  

};

export default mutations;
