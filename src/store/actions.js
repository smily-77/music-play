import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'


// 向song数据中添加url
export function addSongAttr({ commit }, { index, url, words, duration, lyric }) {
  commit('addSongUrl', {index, url})
  commit('addSongWords', {index, words, lyric})
  commit('addSongDuration', {index, duration})
}

// 存储歌单所有音乐列表
export function saveAllMusics({ commit }, { songs }) {
  commit('setSequenceList', songs);
}

// 选择列表中的播放
export function selectPlay({ commit }, { song, index } ) {
  console.log('actions', commit, song, index);
  // 播放歌曲
  commit('setPlayingState', true);
  // 播放器展开
  commit('setFullScreen', true);
  commit('setCurrentIndex', index);
  // 存放当前歌曲
  commit('setCurrentSong', song);
}

export function randomPlay({ commit }, list) {
  console.log('actions', list);
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0)
}

// 改变歌曲播放模式, 同时重定位歌曲的Index
export function changeMode({ commit, state, getters }, mode) {
  let currentId = getters.currentSong?.id;
  let list = []
  if (mode == PLAY_MODE.random) {
    list = state.randomList;
    commit('setRandomList')
  }
  else
    list = state.sequenceList;
  commit('changeMode', mode);
  let index = list.findIndex((song) => {
      return song.id === currentId
  })
  
  commit('setCurrentIndex', index)
}


// export function changeMode({ commit, state, getters }, mode) {
//   const currentId = getters.currentSong.id
//   if (mode === PLAY_MODE.random) {
//     commit('setPlaylist', shuffle(state.sequenceList))
//   } else {
//     commit('setPlaylist', state.sequenceList)
//   }
//   const index = state.playlist.findIndex((song) => {
//     return song.id === currentId
//   })

//   commit('setCurrentIndex', index)
//   commit('setPlayMode', mode)
// }

// export function removeSong({ commit, state }, song) {
//   const sequenceList = state.sequenceList.slice()
//   const playlist = state.playlist.slice()

//   const sequenceIndex = findIndex(sequenceList, song)
//   const playIndex = findIndex(playlist, song)
//   if (sequenceIndex < 0 || playIndex < 0) {
//     return
//   }

//   sequenceList.splice(sequenceIndex, 1)
//   playlist.splice(playIndex, 1)

//   let currentIndex = state.currentIndex
//   if (playIndex < currentIndex || currentIndex === playlist.length) {
//     currentIndex--
//   }

//   commit('setSequenceList', sequenceList)
//   commit('setPlaylist', playlist)
//   commit('setCurrentIndex', currentIndex)
//   if (!playlist.length) {
//     commit('setPlayingState', false)
//   }
// }

export function clearSongList({ commit }) {
  commit('setSequenceList', [])
  commit('setList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

// export function addSong({ commit, state }, song) {
//   const playlist = state.playlist.slice()
//   const sequenceList = state.sequenceList.slice()
//   let currentIndex = state.currentIndex
//   const playIndex = findIndex(playlist, song)

//   if (playIndex > -1) {
//     currentIndex = playIndex
//   } else {
//     playlist.push(song)
//     currentIndex = playlist.length - 1
//   }

//   const sequenceIndex = findIndex(sequenceList, song)
//   if (sequenceIndex === -1) {
//     sequenceList.push(song)
//   }

//   commit('setSequenceList', sequenceList)
//   commit('setPlaylist', playlist)
//   commit('setCurrentIndex', currentIndex)
//   commit('setPlayingState', true)
//   commit('setFullScreen', true)
// }

// function findIndex(list, song) {
//   return list.findIndex((item) => {
//     return item.id === song.id
//   })
// }
