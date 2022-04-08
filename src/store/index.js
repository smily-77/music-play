import { createStore ,createLogger} from "vuex";
import state from "./state";
import mutations from "./mutations";
import * as getters from "./getters";
import * as actions from "./actions";
const debug = process.env.NODE_ENV !== 'production'
const singerStore = createStore({
  // state: {
  //     singers: null,
  // },
  // mutations: {
  //     saveSingers (state, data) {
  //         state.singers = data;
  //     }
  // },
  // getters: {
  //     getSingers: (state) => {
  //         return state.singers;
  //     }
  // }

  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default singerStore;
