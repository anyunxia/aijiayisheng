<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body,#app{
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
        background: #ffffff;
        font-size: 10px;
        font-family: Microsoft YaHei;
    }
    img,video{
        max-width: 100%;
    }
    ::-webkit-scrollbar-track-piece {
        background-color: rgba(0, 0, 0, 0);
    }
    ::-webkit-scrollbar {
        width: 9px;
        height: 9px;
    }
    ::-webkit-scrollbar-thumb {
        background-color:rgba(0, 0, 0, 0.6);
        background-clip: padding-box;
        height: 10px;
        border-radius: 9px;
        overflow-y: hidden !important;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.9);
        border-radius: 9px;
    }
</style>
