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
import {ElLoading, ElMessage, ElNotification} from "element-plus";
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
import SelectLayer from "./common/layer/select.vue";
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
                        if(message_json.command === "launch:restart"){
                            if(message_json.data){
                                setTimeout(()=>{
                                    props.cnc.device.restart = false;
                                    props.cnc.console.right.is_first = true;
                                    if((window as any).simulation){
                                        (window as any).simulation.clearToolLine();
                                    }
                                    props.cnc.loading.close();
                                }, 5000);
                            }
                            if(!message_json.data){
                                props.cnc.device.restart = true;
                                props.cnc.console.right.is_first = true;
                                if((window as any).simulation){
                                    (window as any).simulation.clearToolLine();
                                    (window as any).simulation.clearGcode();
                                }
                                props.cnc.loading = ElLoading.service({
                                    lock: true,
                                    background: "rgba(0, 0, 0, .5)",
                                    customClass: "cnc",
                                    fullscreen: true
                                });
                            }
                        }
                        if(message_json.command === "launch:program:open"){
                            if(message_json.data.status){
                                (window as any).runtime.EventsEmit("dialog_close", {});
                                props.cnc.device.machine.file = message_json.data.file;
                                (window as any).runtime.EventsEmit("event_load_code", {file: message_json.data.file});
                            }else{
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "程序加载失败，请重新尝试",
                                    type: "warning",
                                    customClass: "cnc"
                                });
                            }
                        }
                        if(message_json.command === "launch:machine:info" && !props.cnc.device.restart){
                            props.cnc.device.status = true;
                            props.cnc.device.machine.info = message_json.data;
                            props.cnc.console.left.simulation.current_velocity = parseFloat(props.cnc.device.machine.info.user_data.current_velocity) * 60;
                            props.cnc.console.left.simulation.velocity = props.cnc.device.machine.info.user_data.data.velocity;
                            props.cnc.console.left.simulation.g92_offset = props.cnc.device.machine.info.user_data.data.g92_offset;
                            props.cnc.console.left.simulation.g5x_offset = props.cnc.device.machine.info.user_data.data.g5x_offset;
                            props.cnc.console.left.simulation.g_offset = props.cnc.device.machine.info.user_data.data.g_offset;
                            props.cnc.console.left.simulation.dtg_offset = props.cnc.device.machine.info.user_data.data.dtg_offset;
                            props.cnc.console.left.simulation.tool = props.cnc.device.machine.info.user_data.data.tool;
                            props.cnc.console.right.axes = [];
                            props.cnc.device.machine.info.user_data.axes.forEach((item: any, index: any, array: any)=>{
                                props.cnc.console.right.axes.push({name: item, index: index, position: parseFloat(props.cnc.device.machine.info.user_data.data.position[index]), home: props.cnc.device.machine.info.user_data.homed[index]});
                            });
                            props.cnc.console.right.offset.index = props.cnc.device.machine.info.user_data.data.index;
                            props.cnc.console.right.offset.options = props.cnc.device.machine.info.user_data.data.options;
                            props.cnc.console.right.spindle.enabled = message_json.data.user_data.spindle.enabled;
                            props.cnc.console.right.spindle.direction = message_json.data.user_data.spindle.direction;
                            props.cnc.console.right.spindle.velocity_tmp = message_json.data.user_data.spindle.velocity;
                            if(props.cnc.console.right.is_first){
                                props.cnc.device.machine.linear_units = message_json.data.user_data.linear_units;
                                props.cnc.device.machine.angular_units = message_json.data.user_data.angular_units;
                                props.cnc.console.right.rocker.forEach((item: any, index: any, array: any)=>{
                                    if(index == 1){
                                        if(props.cnc.device.machine.info.user_data.axes.includes("Y")){
                                            props.cnc.console.right.rocker[index].name = "Y";
                                            props.cnc.console.right.rocker[index].value = "y+";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 3){
                                        if(props.cnc.device.machine.info.user_data.axes.includes("Z")){
                                            props.cnc.console.right.rocker[index].name = "Z";
                                            props.cnc.console.right.rocker[index].value = "z+";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 4){
                                        if(props.cnc.device.machine.info.user_data.axes.includes("X")){
                                            props.cnc.console.right.rocker[index].name = "X";
                                            props.cnc.console.right.rocker[index].value = "x-";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 5){
                                        if(props.cnc.device.machine.info.user_data.axes.includes("Y")){
                                            props.cnc.console.right.rocker[index].name = "Y";
                                            props.cnc.console.right.rocker[index].value = "y-";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 6){
                                        if(props.cnc.device.machine.info.user_data.axes.includes("X")){
                                            props.cnc.console.right.rocker[index].name = "X";
                                            props.cnc.console.right.rocker[index].value = "x+";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 7){
                                        if(props.cnc.device.machine.info.user_data.axes.includes("X")){
                                            props.cnc.console.right.rocker[index].name = "Z";
                                            props.cnc.console.right.rocker[index].value = "z-";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 8){
                                        if(props.cnc.device.machine.info.user_data.axes.length > 3){
                                            props.cnc.console.right.rocker[index].name = props.cnc.device.machine.info.user_data.axes[3];
                                            props.cnc.console.right.rocker[index].value = props.cnc.device.machine.info.user_data.axes[3].toLowerCase() + "-";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 9){
                                        if(props.cnc.device.machine.info.user_data.axes.length > 3){
                                            props.cnc.console.right.rocker[index].name = props.cnc.device.machine.info.user_data.axes[3];
                                            props.cnc.console.right.rocker[index].value = props.cnc.device.machine.info.user_data.axes[3].toLowerCase() + "+";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 10){
                                        if(props.cnc.device.machine.info.user_data.axes.length > 4){
                                            props.cnc.console.right.rocker[index].name = props.cnc.device.machine.info.user_data.axes[4];
                                            props.cnc.console.right.rocker[index].value = props.cnc.device.machine.info.user_data.axes[4].toLowerCase() + "-";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                    if(index == 11){
                                        if(props.cnc.device.machine.info.user_data.axes.length > 4){
                                            props.cnc.console.right.rocker[index].name = props.cnc.device.machine.info.user_data.axes[4];
                                            props.cnc.console.right.rocker[index].value = props.cnc.device.machine.info.user_data.axes[4].toLowerCase() + "+";
                                            props.cnc.console.right.rocker[index].hide = false
                                        }
                                    }
                                });
                                props.cnc.console.right.spindle.min_velocity = message_json.data.user_data.spindle.min_velocity;
                                props.cnc.console.right.spindle.max_velocity = message_json.data.user_data.spindle.max_velocity;
                                props.cnc.console.right.spindle.velocity = message_json.data.user_data.spindle.velocity / 100 * 100;
                                props.cnc.console.right.spindle.min_override = message_json.data.user_data.spindle.min_override * 100;
                                props.cnc.console.right.spindle.max_override = message_json.data.user_data.spindle.max_override * 100;
                                props.cnc.console.right.spindle.override = message_json.data.user_data.spindle.override * 100;
                                props.cnc.console.right.feed.max_override = message_json.data.user_data.feed.max_override * 100;
                                props.cnc.console.right.feed.override = message_json.data.user_data.feed.override * 100;
                                props.cnc.console.right.max_velocity = message_json.data.user_data.max_velocity * 60;
                                props.cnc.console.right.max_linear_velocity = Math.round(message_json.data.user_data.max_linear_velocity * 60);
                                props.cnc.console.right.default_linear_velocity = Math.round(message_json.data.user_data.default_linear_velocity * 60);
                                props.cnc.console.right.max_angular_velocity = Math.round(message_json.data.user_data.max_angular_velocity * 60);
                                props.cnc.console.right.default_angular_velocity = Math.round(message_json.data.user_data.default_angular_velocity * 60);
                                if(props.cnc.device.machine.info.file === ""){
                                    props.cnc.device.machine.info.file = "armcnc.ngc";
                                    let file_part = props.cnc.device.machine.info.file.split("/");
                                    props.cnc.device.machine.file = file_part.pop();
                                    let message = {command: "desktop:program:open", data: props.cnc.device.machine.file};
                                    props.cnc.device.message.socket.send(JSON.stringify(message));
                                }else{
                                    let file_part = props.cnc.device.machine.info.file.split("/");
                                    props.cnc.device.machine.file = file_part.pop();
                                    (window as any).runtime.EventsEmit("event_load_code", {file: props.cnc.device.machine.file});
                                }
                                props.cnc.console.right.is_first = false;
                            }
                            if(props.cnc.device.machine.info.user_data.increments){
                                props.cnc.console.right.step.items = [];
                                props.cnc.device.machine.info.user_data.increments.forEach((item: any) => {
                                    props.cnc.console.right.step.items.push({label: item.replace("mm", ""), value: parseFloat(item.replace("mm", ""))});
                                });
                                props.cnc.console.right.step.items.push({label: "连续", value: -1});
                            }
                            props.cnc.header.right.limit = "allow";
                            props.cnc.console.right.homed = props.cnc.device.machine.info.user_data.is_homed;
                            if(props.cnc.device.machine.info.user_data.task_state == 1){
                                props.cnc.header.right.estop = "disabled";
                                props.cnc.header.right.enabled = "disabled";
                                props.cnc.header.centre.start = "disabled";
                                props.cnc.header.centre.start_disabled = false;
                                props.cnc.header.centre.pause = "disabled";
                                props.cnc.header.centre.pause_disabled = true;
                                props.cnc.header.centre.stop = "disabled";
                                props.cnc.header.centre.stop_disabled = true;
                                props.cnc.console.right.home = "disabled";
                                props.cnc.console.right.relative_offset = "disabled";
                            }
                            if(props.cnc.device.machine.info.user_data.task_state == 2){
                                props.cnc.header.right.estop = "active";
                                props.cnc.header.right.enabled = "allow";
                                props.cnc.header.centre.start = "allow";
                                props.cnc.header.centre.start_disabled = true;
                                props.cnc.header.centre.pause = "disabled";
                                props.cnc.header.centre.pause_disabled = true;
                                props.cnc.header.centre.stop = "disabled";
                                props.cnc.header.centre.stop_disabled = true;
                                props.cnc.console.right.home = "disabled";
                                props.cnc.console.right.relative_offset = "disabled";
                            }
                            if(props.cnc.device.machine.info.user_data.task_state == 4){
                                props.cnc.header.right.estop = "active";
                                props.cnc.header.right.enabled = "active";
                                if(props.cnc.device.machine.info.paused){
                                    props.cnc.header.centre.pause = "active";
                                    props.cnc.header.centre.pause_disabled = false;
                                    props.cnc.header.centre.start = "active";
                                    props.cnc.header.centre.start_disabled = true;
                                    props.cnc.header.centre.stop = "allow";
                                    props.cnc.header.centre.stop_disabled = false;
                                }else{
                                    if(props.cnc.device.machine.info.state === 2){
                                        props.cnc.header.centre.start = "active";
                                        props.cnc.header.centre.start_disabled = true;
                                        props.cnc.header.centre.pause = "allow";
                                        props.cnc.header.centre.pause_disabled = false;
                                        props.cnc.header.centre.stop = "allow";
                                        props.cnc.header.centre.stop_disabled = false;
                                    }
                                    if(props.cnc.device.machine.info.state === 1 || props.cnc.device.machine.info.state === 3){
                                        props.cnc.header.centre.stop = "active";
                                        props.cnc.header.centre.stop_disabled = true;
                                        props.cnc.header.centre.start = "allow";
                                        props.cnc.header.centre.start_disabled = false;
                                        props.cnc.header.centre.pause = "allow";
                                        props.cnc.header.centre.pause_disabled = true;
                                    }
                                }
                                props.cnc.console.right.home = "allow";
                                props.cnc.console.right.relative_offset = "allow";
                            }
                            (window as any).runtime.EventsEmit("set_highlight_line", {line: props.cnc.device.machine.info.motion_line});
                            if((window as any).simulation){
                                (window as any).simulation.updateToolPosition(props.cnc.device.machine.info.state, props.cnc.console.right.axes[0].position, props.cnc.console.right.axes[1].position, props.cnc.console.right.axes[2].position);
                            }
                        }
                        if(message_json.command === "launch:machine:error"){
                            let kind = [11];
                            if(kind.includes(message_json.data)){
                                let new_message = message_json.message.split(":");
                                ElNotification({
                                    title: "消息提醒",
                                    message: new_message.length > 1 ? new_message[1] : message_json.message,
                                    type: "info",
                                    position: "bottom-right",
                                    duration: 0,
                                    customClass: "cnc"
                                });
                            }
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
            props.cnc.console.right.is_first = true;
            props.cnc.loading.close();
        }

        document.onkeydown = function(event: any) {
            if(event.key === "Tab"){
                event.preventDefault();
            }
        }

        onBeforeMount(() => {
            props.cnc.loading = ElLoading.service({
                lock: true,
                background: "rgba(0, 0, 0, .5)",
                customClass: "cnc",
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
                (window as any).go.StartWindows.Api.GetPlatform().then((platform: string)=>{
                    props.cnc.platform = platform;
                });
                (window as any).runtime.ScreenGetAll().then((screen: any)=>{
                    if(screen.length > 0){
                        props.cnc.screen.width = screen[0].width;
                        props.cnc.screen.height = screen[0].height;
                    }
                });
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
