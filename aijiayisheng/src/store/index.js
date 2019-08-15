import Vue from 'vue';
import Vuex from 'vuex';

import tag from './modules/tag';
import permission from './modules/permission';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        tag,
        permission
    }
});

export default store;