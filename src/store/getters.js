// 当前播放歌曲
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const getSingers=(state)=>{
  return state.singers;
}

