// 搜索历史组件
import { save, remove, clear } from "@/assets/js/array-store";
import { SEARCH_KEY } from "@/assets/js/constant";
import { useStore } from "vuex";

export default function useSearchHistory() {
  const maxLen = 200;

  const store = useStore();
  // 保存搜索历史
  function saveSearch(query) {
    const searches = save(
      query,
      SEARCH_KEY,
      (item) => {
        return item === query;
      },
      maxLen
    );
    store.commit("setSearchHistory", searches);
  }
  // 删除搜索历史
  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query;
    });
    store.commit("setSearchHistory", searches);
  }
  // 清除搜索历史
  function clearSearch() {
    const searches = clear(SEARCH_KEY);
    store.commit("setSearchHistory", searches);
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch,
  };
}
