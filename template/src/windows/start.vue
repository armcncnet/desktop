<template>
    <div class="cnc-main">
        <div class="main-item">
            <HeaderCommon ref="headerCommon" :cnc="props.cnc" />
        </div>
        <div class="main-item">
            <div class="main-box">
                <div class="main-box-item">
                    <NavigationCommon ref="navigationCommon" :cnc="props.cnc" />
                </div>
                <div class="main-box-item">
                    <ConsoleStart ref="consoleStart" :cnc="props.cnc" />
                    <MachineStart ref="machineStart" :cnc="props.cnc" />
                    <ProgramStart ref="programStart" :cnc="props.cnc" />
                    <PluginStart ref="pluginStart" :cnc="props.cnc" />
                    <SettingsStart ref="settingsStart" :cnc="props.cnc" />
                </div>
            </div>
        </div>
        <div class="main-item">
            <FooterCommon ref="footerCommon" :cnc="props.cnc" />
        </div>
    </div>
    <SelectLayer ref="selectLayer" :cnc="props.cnc" v-if="props.cnc.layer.select" />
</template>

<script lang="ts">
import {defineComponent, nextTick, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted} from "vue";
import {ElLoading} from "element-plus";
import * as icons from "@element-plus/icons";
import NoSleep from "nosleep.js";
import HeaderCommon from "./common/header.vue";
import FooterCommon from "./common/footer.vue";
import NavigationCommon from "./common/navigation.vue";
import ConsoleStart from "./start/console.vue";
import ProgramStart from "./start/program.vue";
import PluginStart from "./start/plugin.vue";
import MachineStart from "./start/machine.vue";
import SettingsStart from "./start/settings.vue";
import SelectLayer from "./layer/select.vue";
export default defineComponent({
    name: "Start",
    emits: [],
    props: ["cnc"],
    components: {
        HeaderCommon,
        FooterCommon,
        NavigationCommon,
        ConsoleStart,
        MachineStart,
        ProgramStart,
        PluginStart,
        SettingsStart,
        SelectLayer
    },
    setup(props, context) {

        // 消息事件
        (window as any).runtime.EventsOn("event_message", (message: any) => {
            if(message.type && message.type === "connected_device"){
                onConnectedDevice();
            }
            if(message.type && message.type === "disconnect_device"){
                if(props.cnc.device.message.status){
                    onDisconnectDevice();
                }
            }
        });

        // 连接设备
        function onConnectedDevice(){
            if(props.cnc.device.ip !== ""){
                onConnectedDeviceControl();
            }
        }

        // 连接设备控制消息服务
        function onConnectedDeviceControl(){
            if(!props.cnc.device.message.status){
                props.cnc.device.message.socket = new WebSocket("ws://" + props.cnc.device.ip + ":" + props.cnc.device.message.port + "/message/service", undefined);
                props.cnc.device.message.socket.onopen = function () {
                    props.cnc.device.message.status = true;
                    props.cnc.navigation.select = "console";
                }
                props.cnc.device.message.socket.onmessage = function (message: any) {
                    let message_json = JSON.parse(message.data);
                    if(message_json.command){
                        if(message_json.command === "launch:machine:info"){
                            props.cnc.device.status = true;
                            props.cnc.device.machine.info = message_json.data;
                            if(props.cnc.device.machine.info.user_data.increments){
                                props.cnc.console.right.step.items = [];
                                props.cnc.device.machine.info.user_data.increments.forEach((item: any) => {
                                    props.cnc.console.right.step.items.push({label: item.replace("mm", ""), value: parseFloat(item.replace("mm", ""))});
                                });
                                props.cnc.console.right.step.items.push({label: "连续", value: -1});
                            }
                            props.cnc.console.right.coordinate.value = props.cnc.device.machine.info.g5x_index;
                            props.cnc.console.right.axis = [];
                            props.cnc.device.machine.info.user_data.coordinates.forEach((item: any, index: any, array: any)=>{
                                props.cnc.console.right.axis.push({name: item, index: index, value: 0.000});
                            });
                            props.cnc.header.right.limit = "allow";
                            if(props.cnc.device.machine.info.user_data.task_state == 1){
                                props.cnc.header.right.estop = "";
                                props.cnc.header.right.enabled = "";
                                props.cnc.header.centre.start = "";
                                props.cnc.header.centre.next = "";
                                props.cnc.header.centre.pause = "";
                                props.cnc.header.centre.stop = "";
                                props.cnc.console.right.home = "";
                                props.cnc.console.right.zero = "";
                            }
                            if(props.cnc.device.machine.info.user_data.task_state == 2){
                                props.cnc.header.right.estop = "active";
                                props.cnc.header.right.enabled = "allow";
                                props.cnc.header.centre.start = "";
                                props.cnc.header.centre.next = "";
                                props.cnc.header.centre.pause = "";
                                props.cnc.header.centre.stop = "";
                                props.cnc.console.right.home = "";
                                props.cnc.console.right.zero = "";
                            }
                            if(props.cnc.device.machine.info.user_data.task_state == 4){
                                props.cnc.header.right.estop = "active";
                                props.cnc.header.right.enabled = "active";
                                props.cnc.header.centre.start = "allow";
                                props.cnc.header.centre.next = "allow";
                                props.cnc.header.centre.pause = "allow";
                                props.cnc.header.centre.stop = "allow";
                                props.cnc.console.right.home = "allow";
                                props.cnc.console.right.zero = "allow";
                            }
                            // console.log(props.cnc.device.machine.info);
                        }
                        if(message_json.command === "launch:machine:error"){
                            console.log(message_json.message);
                        }
                        if(message_json.command === "launch:restart"){
                            props.cnc.device.status = message_json.data;
                        }
                    }
                }
                props.cnc.device.message.socket.onerror = function () {
                    if(props.cnc.device.message.status){
                        onDisconnectDevice();
                    }
                }
                props.cnc.device.message.socket.onclose = function () {
                    if(props.cnc.device.message.status){
                        onDisconnectDevice();
                    }
                }
            }
        }

        // 断开设备
        function onDisconnectDevice(){
            if(props.cnc.device.message.status){
                props.cnc.device.message.socket.close();
                props.cnc.device.message.socket = false;
                props.cnc.device.message.status = false;
            }
            props.cnc.navigation.select = "console";
            props.cnc.device.machine.info = false;
        }

        document.onkeydown = function(event: any) {
            if(event.key === "Tab"){
                event.preventDefault();
            }
        }

        onBeforeMount(() => {
            props.cnc.loading = ElLoading.service({
                lock: true,
                background: "rgba(0, 0, 0, .01)",
                fullscreen: true
            });
        });

        onMounted(() => {
            nextTick(()=>{
                if(!props.cnc.sleep){
                    // 禁止屏幕休眠
                    props.cnc.sleep = new NoSleep();
                    props.cnc.sleep.enable();
                }
                let ips = localStorage.getItem("cnc:device:ips");
                if(ips){
                    props.cnc.device.ips = JSON.parse(ips);
                }
                props.cnc.loading.close();
            });
        });

        onBeforeUnmount(()=>{
            onDisconnectDevice();
        })

        onUnmounted(() => {});

        return {
            props,
            icons
        }
    }
});
</script>

<style scoped>
.cnc-main{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.cnc-main .main-item{
    width: 100%;
    height: calc(100% - 65px);
}
.cnc-main .main-item:first-child{
    width: 100%;
    height: 40px;
    background-color: rgba(43, 45, 48, 1);
    border-top: solid 1px rgba(30, 31, 34, 1);
}
.cnc-main .main-item:last-child{
    width: 100%;
    height: 25px;
    background-color: rgba(43, 45, 48, .8);
    border-top: 1px solid rgba(30, 31, 34, 1);
}
.cnc-main .main-item .main-box{
    width: 100%;
    height: 100%;
    border-top: 1px solid rgba(30, 31, 34, 1);
}
.cnc-main .main-item .main-box .main-box-item{
    width: calc(100% - 40px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.cnc-main .main-item .main-box .main-box-item:first-child{
    width: 40px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    background-color: rgba(43, 45, 48, 1);
    border-right: solid 1px rgba(30, 31, 34, 1);
}
</style>
