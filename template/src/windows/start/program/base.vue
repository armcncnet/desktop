<template>
    <div class="base-view">
        <div class="base-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.program.item" label-width="120px">
                    <el-form-item label="程序名称">
                        <el-input class="cnc" v-model="props.cnc.program.item.name" style="width: 300px" maxlength="12" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="程序描述">
                        <el-input class="cnc" v-model="props.cnc.program.item.describe" style="width: 400px" maxlength="30" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="版本号">
                        <el-input class="cnc" v-model="props.cnc.program.item.version" style="width: 100px"/>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "BaseProgram",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons
        }
    }
});
</script>

<style scoped>
.base-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.base-view .base-box{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
}
.base-view .base-box .box-item{
    width: 100%;
    padding: 30px 20px;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 20px;
    border-radius: 4px;
}
.base-view .base-box .box-item .title{
    color: #999999;
    margin-bottom: 20px;
}
</style>
