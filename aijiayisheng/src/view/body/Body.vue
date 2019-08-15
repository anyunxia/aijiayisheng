<template>
    <div class="body">
        <el-container>
            <el-header>
                <Head></Head>
            </el-header>
            <el-container>
                <el-aside>
                    <Menu></Menu>
                </el-aside>
                <el-main>
                    <Main></Main>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Head from './Head';
import Menu from './Menu';
import Main from './Main';
export default {
    components:{
        Head,
        Menu,
        Main,
    }
}
</script>

<style scoped>
    @import url("../../static/css/body.css");
</style>
