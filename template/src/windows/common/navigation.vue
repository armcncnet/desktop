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
                <el-tooltip popper-class="cnc" effect="dark" content="程序" placement="right">
                    <el-icon><Tickets /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" :class="props.cnc.navigation.select === 'plugin' ? 'select' : ''" @click="onNavigation('plugin')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="插件" placement="right">
                    <el-icon><Grid /></el-icon>
                </el-tooltip>
            </div>
        </div>
        <div class="navigation-item">
            <div class="item" :class="props.cnc.navigation.select === 'settings' ? 'select' : ''" @click="onNavigation('settings')" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="设置" placement="right">
                    <el-icon><Tools /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" @click="onDeviceRestart" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="重启设备" placement="right">
                    <el-icon><RefreshRight /></el-icon>
                </el-tooltip>
            </div>
            <div class="item" @click="onDeviceShutdown" v-if="props.cnc.device.message.status">
                <el-tooltip popper-class="cnc" effect="dark" content="设备关机" placement="right">
                    <el-icon><SwitchButton /></el-icon>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
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

        }

        function onDeviceShutdown(){

        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onNavigation,
            onDeviceRestart,
            onDeviceShutdown
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
    height: calc(100% - 120px);
}
.navigation-view .navigation-item:last-child{
    height: 120px;
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
