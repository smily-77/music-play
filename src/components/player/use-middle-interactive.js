// 歌词页面和cd页面切换
import { ref } from "vue";

export default function useMiddleInteractive() {
  const currentShow = ref("cd");
  const middleLStyle = ref(null);
  const middleRStyle = ref(null);

  const touch = {};
  let currentView = "cd";

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX;
    touch.startY = e.touches[0].pageY;
    // 方向锁
    touch.directionLocked = "";
  }

  function onMiddleTouchMove(e) {
    // 手指拖动的位移
    const deltaX = e.touches[0].pageX - touch.startX;
    const deltaY = e.touches[0].pageY - touch.startY;
    // 绝对值
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // x>y有效的横向滚动
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? "h" : "v";
    }
    // 纵向偏移无效
    if (touch.directionLocked === "v") {
      return;
    }
    // 视图原本偏移量
    const left = currentView === "cd" ? 0 : -window.innerWidth;
    // 歌词视图偏移量（0-屏幕宽度）
    const offsetWidth = Math.min(
      0,
      Math.max(-window.innerWidth, left + deltaX)
    );
    // 偏移比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth);

    if (currentView === "cd") {
      // 如果偏移比例超过20%，显示歌词页面，否则cd页面
      if (touch.percent > 0.2) {
        currentShow.value = "lyric";
      } else {
        currentShow.value = "cd";
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = "cd";
      } else {
        currentShow.value = "lyric";
      }
    }

    // 修改左侧cd透明度
    middleLStyle.value = {
      opacity: 1 - touch.percent,
    };
    // 修改右侧样式
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
    };
  }
  // 拖动松开手指调用
  function onMiddleTouchEnd() {
    let offsetWidth;
    let opacity;
    if (currentShow.value === "cd") {
      currentView = "cd";
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = "lyric";
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }

    const duration = 300;
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    };

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`,
    };
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  };
}
