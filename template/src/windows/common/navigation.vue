<template>
    <div class="navigation-view">
        <div class="navigation-item">
            <div class="item" :class="props.cnc.navigation.select === 'console' ? 'select' : ''" @click="onNavigation('console')">
                <el-tooltip popper-class="cnc" effect="dark" content="控制台" placement="right">
                    <el-icon><Place /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" :class="props.cnc.navigation.select === 'machine' ? 'select' : ''" @click="onNavigation('machine')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="机床" placement="right">
                    <el-icon><Files /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" :class="props.cnc.navigation.select === 'program' ? 'select' : ''" @click="onNavigation('program')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="G程序" placement="right">
                    <el-icon><Tickets /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" :class="props.cnc.navigation.select === 'plugin' ? 'select' : ''" @click="onNavigation('plugin')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="插件" placement="right">
                    <el-icon><Grid /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" :class="props.cnc.navigation.select === 'store' ? 'select' : ''" @click="onNavigation('store')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="市场" placement="right">
                    <el-icon><Handbag /></el-icon>
                </el-tooltip>
            </div>
        </div>
        <div class="navigation-item">
            <div class="item" @click="onDeviceRestart" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="重启设备" placement="right">
                    <el-icon><RefreshRight /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" :class="props.cnc.navigation.select === 'settings' ? 'select' : ''" @click="onNavigation('settings')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="设置" placement="right">
                    <el-icon><Tools /></el-icon>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElLoading, ElMessageBox} from "element-plus";
export default defineComponent({
    name: "NavigationCommon",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onNavigation(navigation: any){
            if(props.cnc.navigation.select !== navigation){
                props.cnc.navigation.select = navigation;
                (window as any).runtime.EventsEmit("event_page", {type: "page_" + navigation});
            }
        }

        function onDeviceRestart(){
            if(!props.cnc.device.message.status){
                return;
            }
            ElMessageBox.confirm("是否确认重启机床？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                let message = {command: "desktop:device:restart", data: {}}
                props.cnc.device.message.socket.send(JSON.stringify(message));
                props.cnc.loading = ElLoading.service({
                    lock: true,
                    background: "rgba(0, 0, 0, .5)",
                    customClass: "cnc",
                    fullscreen: true
                });
            }).catch(() => {});
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onNavigation,
            onDeviceRestart
        }
    }
});
</script>

<style scoped>
.navigation-view{
    width: 100%;
    height: 100%;
}
.navigation-view .navigation-item{
    width: 100%;
    height: calc(100% - 80px);
}
.navigation-view .navigation-item:last-child{
    height: 80px;
}
.navigation-view .navigation-item .item{
    width: 100%;
    height: 40px;
    text-align: center;
    font-size: 18px;
    padding: 5px;
}
.navigation-view .navigation-item .item:deep(.el-icon){
    width: 29px;
    height: 29px;
    font-size: 16px;
    color: #999999;
}
.navigation-view .navigation-item .item:hover:deep(.el-icon){
    cursor: pointer;
    background-color: rgba(78, 81, 87, .2);
    border-radius: 4px;
    color: #ffffff;
}
.navigation-view .navigation-item .item.select:deep(.el-icon){
    cursor: pointer;
    background-color: rgba(78, 81, 87, .2);
    border-radius: 4px;
    color: #ffffff;
}
</style>
