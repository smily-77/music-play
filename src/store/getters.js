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

