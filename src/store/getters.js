import { PLAY_MODE } from '@/assets/js/constant';
// 当前播放歌曲
export const currentSong = (state) => {
  return state.currentSong || {}
}

export const getSingers=(state)=>{
  return state.singers;
}

export const currentIndex = (state) => {
  return state.currentIndex;
}

export const getSequenceList = (state) => {
  return state.sequenceList;
}

// 歌曲数据是否存在url
export const existSongUrl = (state) => (index) => {
  return state.sequenceList[index]?.url ? true: false;
}

// 针对不同播放模式获取真实的歌曲播放列表
export const actualPlayList = (state) => {
  if (state.playMode == PLAY_MODE.random)
    return state.randomList;
  else
    return state.sequenceList;
}

// 获取待添加的新歌对应的index
export const getNewSongIndex = (state) => (song) => {
  let songList = [];
  let isNew = false;
  if (state.playMode == PLAY_MODE.random)
    songList = state.randomList;
  else
    songList = state.sequenceList;
  let currentIndex = state.currentIndex;
  const playIndex = findIndex(songList, song);
  if (playIndex > -1) {
    currentIndex = playIndex;
  } else {
    currentIndex = songList.length;
    isNew = true;
  }
  return {
    index: currentIndex,
    isNew
  }
}

export const firstMusic = (state) => {
  if (state.randomList.length == 0 && state.sequenceList.length == 0)
    return null;
  else if (state.playMode == PLAY_MODE.random)
    return state.randomList[0];
  else
    return state.sequenceList[0];
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
