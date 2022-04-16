// 随机洗牌算法
export function shuffle(source) {
  const arr = source.slice();
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i);
    swap(arr, i, j);
  }
  return arr;
}

// 取随机数
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

// 交换函数
function swap(arr, i, j) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

// 时间格式化 秒-》x分x秒
export function formatTime(interval) {
  interval = interval | 0;
  const minute = (((interval / 60) | 0) + "").padStart(2, "0");
  const second = ((interval % 60) + "").padStart(2, "0");
  return `${minute}:${second}`;
}

// 时间格式化 x分x秒=>秒

export function getSecond(interval) {
  var parts = interval.toString().split(":"),
    minutes = +parts[0],
    seconds = +parts[1];
  return (minutes * 60 + seconds).toFixed(3);
}

// 处理歌词, string -> map
export const processSongWords = (songWords) => {
  let regex = new RegExp('\\[(.*)\\](.*)');
  let lyric = songWords?.lrc?.lyric ? songWords?.lrc?.lyric : '[00:00:00]该歌曲暂无歌词\n';
  let lyricList = lyric.split('\n');
  let lyricMap = {};
  let duration = {};
  let lens = lyricList.length - 1;
  for (let i = 0; i < lens; i++) {
    let regexRes = regex.exec(lyricList[i]);
    if (regexRes) {
      let timeKey = regexRes[1];
      let wordsValue = regexRes[2];
      lyricMap[timeKey] = wordsValue;
      if (i == lens - 1)
        duration = timeKey.split('.')[0];
    }
  }
  console.log(lyricMap, 999999);
  return {
    songWordMap: lyricMap,
    duration
  }
} 
