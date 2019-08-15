<template>
    <div class="main">
        <!-- <div class="main-tag">
            <div class="tag-btn left-btn">
                <el-button icon="el-icon-caret-left" type="text" @click="handleScroll(240)"></el-button>
            </div>
            <div ref="scrollOuter" class="tag-scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
                <div ref="scrollBody" class="tag-scrollBody" :style="{left: tagBodyLeft + 'px'}">
                    <el-tag
                        v-for="item in pageTagsList"
                        :closable="item.path == home ? false : true"
                        :key="item.id"
                        :type="item.path == currentPageName ? 'default' : 'info'"
                        @click.native="linkTo(item.path)"
                        @close="delTag(item.path)"
                    >
                        {{ item.title }}
                    </el-tag>
                </div>
            </div>
            <div class="tag-btn right-btn">
                <el-button icon="el-icon-caret-right" type="text" @click="handleScroll(-240)"></el-button>
            </div>
            <div class="tag-btn close-btn">
                <el-dropdown trigger="click" @command="tagsOption">
                    <el-button icon="el-icon-circle-close" type="text"></el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="clearOthers">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div> -->
         <div class="tags" v-if="showTags">
            <ul>
                <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                    <router-link :to="item.path" class="tags-li-title">
                        {{item.title}}
                    </router-link>
                    <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
                </li>
            </ul>
            <div class="tags-close-box">
                <el-dropdown @command="handleTags">
                    <el-button size="mini" type="primary">
                        标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu size="small" slot="dropdown">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="main-content">
            <router-view/>
        </div>
    </div>
</template>

<script>
// export default {
//     data(){
//         return {
//             home: "/userlatform",
//             tagBodyLeft: "",
//         }
//     },
// 	computed: {
// 		pageTagsList(){
// 			return this.$store.state.tag.tagItem;
// 		},
// 		currentPageName(){
// 			return this.$route.path;
// 		}
// 	},
//     methods:{
//         linkTo (path) {
//             if(path != this.$route.path){
//                 this.$router.push(path);
//             }
//         },
//         delTag(path){
//             this.$store.commit("delOneTagItem", path);
//             if (this.currentPageName == path) {
// 				let nowTagPath = "";
// 				if (this.pageTagsList.length === 1) {
// 					nowTagPath = this.pageTagsList[0].path;
// 				} else {
// 					nowTagPath = this.pageTagsList[1].path;
// 				}
// 				this.$router.push(nowTagPath);
// 			}
//         },
//         tagsOption(checkedOpeation){
// 			if (checkedOpeation === "clearAll") {
//                 this.$store.commit("clearAllTagItem");
//                 this.$router.push(this.home);
// 			} else if (checkedOpeation === "clearOthers") {
// 				this.$store.commit("clearOthersTagItem", this.$route.path);
// 			}
// 		},
//         handlescroll(e) {
//             var type = e.type;
//             let delta = 0;
//             if (type === "DOMMouseScroll" || type === "mousewheel") {
//                 delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
//             }
//             this.handleScroll(delta);
//         },
//         handleScroll(offset) {
//             if (offset > 0) {
//                 this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
//             } else {
//                 if (this.$refs.scrollOuter.offsetWidth < this.$refs.scrollBody.offsetWidth) {
//                     if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollOuter.offsetWidth)) {
//                         this.tagBodyLeft = this.tagBodyLeft
//                     } else {
//                         this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, this.$refs.scrollOuter.offsetWidth - this.$refs.scrollBody.offsetWidth)
//                     }
//                 } else {
//                     this.tagBodyLeft = 0
//                 }
//             }
//         }
//     }
// }
import bus from '@/static/js/common/bus.js';
export default {
        data() {
            return {
                tagsList: []
            }
        },
        methods: {
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];//被关闭的项
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];//当前所在的一项
                console.log(delItem)
                console.log(item)
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                    console.log(delItem.path)
                }else{
                    this.$router.push('/userlatform');
                }
            },
            // 关闭全部标签
            closeAll(){
                this.tagsList = [];
                this.$router.push('/userlatform');
            },
            // 关闭其他标签
            closeOther(){
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route){
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                })
                if(!isExist){
                    if(this.tagsList.length >= 8){
                        this.tagsList.shift();
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        name: route.matched[1].components.default.name
                    })
                }
                bus.$emit('tags', this.tagsList);
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            }
        },
        created(){
            this.setTags(this.$route);
            // 监听关闭当前页面的标签页
            bus.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i];
                    if(item.path === this.$route.fullPath){
                        if(i < len - 1){
                            this.$router.push(this.tagsList[i+1].path);
                        }else if(i > 0){
                            this.$router.push(this.tagsList[i-1].path);
                        }else{
                            this.$router.push('/userlatform');
                        }
                        this.tagsList.splice(i, 1);
                    }
                }
            })
        }
    }
</script>

<style scoped>
    @import url("../../static/css/body.css");
    .tags {
        position: relative;
        height: 30px;
        overflow: hidden;
        background: #fff;
        padding-right: 120px;
        box-shadow: 0 5px 10px #ddd;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin:0;
        padding-left:0;
        box-shadow: 0px 0 3px 2px rgba(100,100,100,.1) inset;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        color: #fff;
        border: 1px solid #409EFF;
        background-color: #409EFF;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
    a{
        text-decoration: none;
    }
</style>
