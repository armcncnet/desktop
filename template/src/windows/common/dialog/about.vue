<template>
    <el-dialog class="cnc" v-model="props.cnc.dialog.status" :title="props.cnc.dialog.config.title" :width="props.cnc.dialog.config.width" draggable :modal="true" title="" :show-close="props.cnc.dialog.config.close" :before-close="dialogClose" :lock-scroll="true" :closeOnClickModal="false" :closeOnPressEscape="false" :destroy-on-close="true">
        <div class="about-dialog">
            <div class="logo"></div>
            <div class="version" v-if="props.cnc.version.length > 0">{{props.cnc.version[0]}} {{props.cnc.version[1]}}</div>
            <div class="site">www.armcnc.net</div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "AboutDialog",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function dialogClose(close: any){
            if(close){
                close();
            }
            props.cnc.dialog.status = false;
            setTimeout(()=>{
                props.cnc.dialog.config.type = "";
                props.cnc.dialog.form = false;
            }, 20);
        }

        onMounted(() => {});

        onBeforeUnmount(() => {});

        return {
            props,
            dialogClose
        }
    }
});
</script>

<style scoped>
.about-dialog{
    width: 100%;
    padding: 30px;
}
.about-dialog .logo{
    width: 100%;
    height: 40px;
    background: url("../src/assets/image/logo.png") no-repeat center center;
    background-size: 14%;
    margin-bottom: 10px;
}
.about-dialog .version{
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-bottom: 10px;
}
.about-dialog .site{
    width: 100%;
    font-size: 12px;
    text-align: center;
}
</style>