import { createStore } from 'vuex';


const singerStore = createStore({
    state: {
        singers: null,
    },
    mutations: {
        saveSingers (state, data) {
            state.singers = data;
        }
    },
    getters: {
        getSingers: (state) => {
            return state.singers;
        }
    }

});

export default singerStore;