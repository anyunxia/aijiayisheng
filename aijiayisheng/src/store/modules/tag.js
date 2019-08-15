const home = "/userlatform";
const tag ={
    state: {
        tagItem:[
            { path: home, title: "首页", },
        ],
    },
    mutations: {
        addOneTagItem(state, data){
            let repeatState = false;
            state.tagItem.map(item => {
				if (item.path === data.path) {
                    repeatState = true;
                }
            });
            if(!repeatState){
                state.tagItem.push({
                    path:data.path,
                    title:data.title,
                });
            }
        },
        delOneTagItem(state, path){
            state.tagItem.map((item, index) => {
				if (item.path === path) {
					state.tagItem.splice(index, 1);
				}
			});
        },
        clearAllTagItem(state){
            let newPageList = [];
            state.tagItem.map(item => {
				if (item.path == home) {
                    newPageList.push(item);
                }
			});
			state.tagItem = newPageList;
        },
        clearOthersTagItem(state, path){
            let newPageList = [];
            state.tagItem.map(item => {
				if (item.path == path || item.path == home) {
                    newPageList.push(item);
                }
			});
			state.tagItem = newPageList;
        }
    }
};

export default tag;