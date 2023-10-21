<template>
    <div class="header-main">
        <div class="header-item">
            <div class="item logo"></div>
            <div class="item menu">
                <el-icon><Grid /></el-icon>
                <div class="dropdown">
                    <div class="dropdown-item" @click="onSettings">
                        <div class="dropdown-item-item">
                            <el-icon><Setting /></el-icon>
                        </div>
                        <div class="dropdown-item-item">
                            <span>设置</span>
                        </div>
                        <div class="dropdown-item-item"></div>
                    </div>
                    <div class="dropdown-item" @click="onReload">
                        <div class="dropdown-item-item">
                            <el-icon><Refresh /></el-icon>
                        </div>
                        <div class="dropdown-item-item">
                            <span>重载应用</span>
                        </div>
                        <div class="dropdown-item-item"></div>
                    </div>
                    <div class="dropdown-item">
                        <div class="dropdown-item-item">
                            <el-icon><QuestionFilled /></el-icon>
                        </div>
                        <div class="dropdown-item-item">
                            <span>帮助</span>
                        </div>
                        <div class="dropdown-item-item">
                            <el-icon class="arrow"><ArrowRight /></el-icon>
                        </div>
                        <div class="dropdown-more">
                            <div class="dropdown-item" @click="onSite">
                                <div class="dropdown-item-item">
                                    <el-icon><ChromeFilled /></el-icon>
                                </div>
                                <div class="dropdown-item-item">
                                    <span>官方网站</span>
                                </div>
                                <div class="dropdown-item-item"></div>
                            </div>
                            <div class="dropdown-item line"></div>
                            <div class="dropdown-item" @click="onAbout">
                                <div class="dropdown-item-item"></div>
                                <div class="dropdown-item-item">
                                    <span>关于</span>
                                </div>
                                <div class="dropdown-item-item"></div>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-item line"></div>
                    <div class="dropdown-item" @click="onQuit">
                        <div class="dropdown-item-item"></div>
                        <div class="dropdown-item-item">
                            <span>退出</span>
                        </div>
                        <div class="dropdown-item-item"></div>
                    </div>
                </div>
            </div>
            <div class="item device">
                <div class="new-device" @click="onNewDevice">
                    <el-text class="cnc" v-if="!props.cnc.device.message.status">
                        <el-icon><Connection /></el-icon>
                        <span>连接设备</span>
                    </el-text>
                    <el-text class="cnc" v-else>
                        <el-icon><Connection /></el-icon>
                        <span>{{props.cnc.device.ip}}</span>
                        <el-icon style="margin-left: 5px"><Close /></el-icon>
                    </el-text>
                </div>
            </div>
        </div>
        <div class="header-item">
            <el-tooltip popper-class="cnc" effect="dark" content="运行" placement="bottom" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" :icon="icons.VideoPlay" @click="onControlStart"></el-button>
            </el-tooltip>
            <el-tooltip popper-class="cnc" effect="dark" content="执行下一行" placement="bottom" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" :icon="icons.Expand" @click="onControlSuspend"></el-button>
            </el-tooltip>
            <el-tooltip popper-class="cnc" effect="dark" content="暂停" placement="bottom" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" :icon="icons.VideoPause" @click="onControlSuspend"></el-button>
            </el-tooltip>
            <el-tooltip popper-class="cnc" effect="dark" content="停止" placement="bottom" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" :icon="icons.Remove" @click="onControlStop"></el-button>
            </el-tooltip>
        </div>
        <div class="header-item">
            <div class="item global" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" type="danger" :icon="icons.SwitchButton" @click="onEmergencyStop">急停</el-button>
            </div>
            <div class="item global" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" type="primary" :icon="icons.Promotion" @click="onDeviceStart">启动</el-button>
            </div>
            <div class="item global" v-if="props.cnc.device.message.status">
                <el-button class="el-cnc-button" type="warning" :icon="icons.Rank" @click="onDeviceZero">回零</el-button>
            </div>
        </div>
    </div>
    <NewDeviceDialog ref="newDeviceDialog" :cnc="props.cnc" v-if="props.cnc.header.dialog.config.type === 'device'" />
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessageBox} from "element-plus";
import NewDeviceDialog from "./dialog/device.vue";
export default defineComponent({
    name: "HeaderCommon",
    emits: [],
    props: ["cnc"],
    components: {
        NewDeviceDialog
    },
    setup(props, context) {

        function onSettings(){

        }

        function onReload(){
            (window as any).runtime.WindowReloadApp();
        }

        function onSite(){
            (window as any).runtime.BrowserOpenURL("https://www.armcnc.net");
        }

        function onAbout(){

        }

        function onQuit(){
            (window as any).runtime.Quit();
        }

        function onNewDevice(){
            if(!props.cnc.device.message.status){
                props.cnc.header.dialog.config.type = "device";
                props.cnc.header.dialog.config.title = "连接设备";
                props.cnc.header.dialog.config.width = "400px";
                props.cnc.header.dialog.config.close = true;
                props.cnc.header.dialog.form = {
                    ip: "127.0.0.1"
                }
                props.cnc.header.dialog.status = true;
            }else{
                ElMessageBox.confirm("是否确认断开设备连接？", "操作确认", {
                    draggable: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning",
                    customClass: "cnc"
                }).then(() => {
                    (window as any).runtime.EventsEmit("event_message", {type: "disconnect_device"});
                }).catch(() => {});
            }
        }

        function onControlStart(){

        }

        function onControlSuspend(){

        }

        function onControlStop(){

        }

        function onEmergencyStop(){
            let message = {command: "desktop:control:device:estop"}
            props.cnc.device.message.socket.send(JSON.stringify(message));
        }

        function onDeviceStart(){
            let message = {command: "desktop:control:device:start"}
            props.cnc.device.message.socket.send(JSON.stringify(message));
        }

        function onDeviceZero(){
            let message = {command: "desktop:control:device:zero"}
            props.cnc.device.message.socket.send(JSON.stringify(message));
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onSettings,
            onReload,
            onSite,
            onAbout,
            onQuit,
            onNewDevice,
            onControlStart,
            onControlSuspend,
            onControlStop,
            onEmergencyStop,
            onDeviceStart,
            onDeviceZero
        }
    }
});
</script>

<style scoped>
.header-main{
    width: 100%;
    height: 40px;
}
.header-main .header-item{
    width: 400px;
    height: 40px;
    display: inline-block;
    vertical-align: top;
}
.header-main .header-item:nth-child(2){
    width: calc(100% - 800px);
    text-align: center;
    padding: 5px 10px;
}
.header-main .header-item:last-child{
    width: 400px;
    text-align: center;
    padding: 0 10px;
}
.header-main .header-item .item{
    width: auto;
    height: 39px;
    display: inline-block;
    vertical-align: top;
}
.header-main .header-item .item.logo{
    width: 40px;
    background: url("../src/assets/image/logo.png") no-repeat center center;
    background-size: 50%;
}
.header-main .header-item .item.menu{
    width: 40px;
    line-height: 36px;
    text-align: center;
    padding: 6px;
    position: relative;
}
.header-main .header-item .item.menu:hover{
    cursor: pointer;
    background-color: rgba(57, 59, 64, .5);
}
.header-main .header-item .item.menu .el-icon{
    font-size: 18px;
}
.header-main .header-item .item.menu .dropdown{
    width: max-content;
    white-space: nowrap;
    min-width: 120px;
    line-height: normal;
    position: absolute;
    top: 40px;
    left: 0;
    text-align: left;
    background-color: rgba(43, 45, 48, 1);
    border: 1px solid rgba(59, 60, 61, 1);
    z-index: 100;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    padding: 5px;
    border-radius: 4px;
    color: #999999;
    display: none;
}
.header-main .header-item .item.menu:hover .dropdown{
    display: block;
}
.header-main .header-item .item.menu .dropdown .dropdown-item{
    width: 100%;
    height: 30px;
    position: relative;
}
.header-main .header-item .item.menu .dropdown .dropdown-item:hover{
    color: #ffffff;
}
.header-main .header-item .item.menu .dropdown .dropdown-item.line{
    height: 1px;
    border-bottom: 1px solid rgba(59, 60, 61, 1);
    margin: 6px 0;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-item-item{
    width: auto;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    vertical-align: top;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-item-item:first-child{
    width: 30px;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-item-item span{
    width: auto;
    min-width: 60px;
    height: 30px;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-item-item .el-icon{
    width: 30px;
    height: 30px;
    font-size: 14px;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-item-item:last-child .el-icon{
    float: right;
}
.header-main .header-item .item.menu .dropdown .dropdown-item:not(:hover) .dropdown-item-item .el-icon.arrow{
    font-size: 12px;
    color: #666666;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-item-item i{
    color: #666666;
    padding-right: 5px;
}
.header-main .header-item .item.menu .dropdown .dropdown-item .dropdown-more{
    width: max-content;
    white-space: nowrap;
    min-width: 140px;
    line-height: normal;
    position: absolute;
    top: 0;
    left: calc(100%);
    text-align: left;
    background-color: rgba(43, 45, 48, 1);
    border: 1px solid rgba(59, 60, 61, 1);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    padding: 5px;
    border-radius: 4px;
    color: #999999;
    display: none;
}
.header-main .header-item .item.menu .dropdown .dropdown-item:hover .dropdown-more{
    display: block;
}
.header-main .header-item .item.device{
    padding: 0 5px;
    line-height: 34px;
}
.header-main .header-item .item.device .new-device{
    width: auto;
    height: 32px;
    line-height: 32px;
    background-color: rgba(30, 31, 34, .3);
    display: inline-block;
    vertical-align: middle;
    border-radius: 4px;
    padding: 0 10px;
}
.header-main .header-item .item.device .new-device:deep(.el-text){
    color: #999999;
}
.header-main .header-item .item.device .new-device:hover:deep(.el-text){
    cursor: pointer;
    color: #ffffff;
}
.header-main .header-item .item.global{
    width: auto;
    height: 39px;
    line-height: 30px;
    text-align: center;
    padding: 3px 10px;
    position: relative;
}
</style>
