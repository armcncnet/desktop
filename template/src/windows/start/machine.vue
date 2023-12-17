<template>
    <div class="machine-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-header">
                <div class="item-header-item">
                    <el-input class="cnc none" v-model="props.cnc.machine.search_keyword" placeholder="请输入关键词" maxlength="140" autocomplete="off" spellcheck="false" clearable />
                </div>
                <div class="item-header-item">
                    <el-tooltip popper-class="cnc" effect="dark" content="新增机床配置" placement="bottom">
                        <el-button class="cnc" :icon="icons.Plus" @click="newMachine"></el-button>
                    </el-tooltip>
                </div>
            </div>
            <div class="item-footer">
                <div class="item-footer-box" v-if="!props.cnc.machine.loading">
                    <div class="machine-item" :class="props.cnc.machine.item && props.cnc.machine.item.path === item.path ? 'select' : ''" v-for="(item, index) in props.cnc.machine.items" :key="index" v-if="props.cnc.machine.items.length > 0" @click="onSelect(item)">
                        <div class="title">{{item.name}}</div>
                        <div class="describe">{{item.describe}}</div>
                        <div class="tag">
                            <el-tag class="cnc" size="small" :disable-transitions="true" style="color: #ffffff; background-color: #5e4eff" v-if="props.cnc.device.machine.path === item.path">
                                <el-icon><Check /></el-icon>
                            </el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true" v-if="item.control === 0">仿真模拟</el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true" v-else-if="item.control === 1">GPIO</el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true" v-else-if="item.control === 2">Arduino</el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true" v-else-if="item.control === 3">MACH3</el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true" v-else-if="item.control === 4">EtherCAT</el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true" v-else>-</el-tag>
                            <el-tag class="cnc" size="small" :disable-transitions="true">{{item.coordinate}}</el-tag>
                        </div>
                    </div>
                    <el-empty class="cnc none" :image-size="30" v-else/>
                </div>
                <div class="loading-view" v-else>
                    <el-icon class="is-loading"><Loading /></el-icon>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="loading-view" v-if="props.cnc.machine.tab.loading">
                <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <el-empty class="cnc none" :image-size="30" v-if="!props.cnc.machine.item && !props.cnc.machine.tab.loading"/>
            <div class="machine-box" v-if="!props.cnc.machine.tab.loading && props.cnc.machine.item">
                <el-tabs v-model="props.cnc.machine.tab.value" type="card" class="cnc">
                    <el-tab-pane class="cnc" :closable="item.close" v-for="(item, index) in props.cnc.machine.tab.items" :key="index" :label="item.name" :name="item.id">
                        <BaseMachine ref="baseMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'base'"/>
                        <SpindleMachine ref="spindleMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'spindle'"/>
                        <JointMachine ref="jointMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'joint'"/>
                        <ToolMachine ref="toolMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'tool'"/>
                        <SignalMachine ref="signalMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'signal'"/>
                        <WheelMachine ref="wheelMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'wheel'"/>
                        <HalMachine ref="halMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'hal'"/>
                        <XmlMachine ref="xmlMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'xml'"/>
                        <LaunchMachine ref="launchMachine" :cnc="props.cnc" :item="item" v-if="item.id === 'launch'"/>
                    </el-tab-pane>
                </el-tabs>
                <div class="machine-button">
                    <el-tooltip popper-class="cnc" effect="dark" content="下载配置" placement="top" v-if="props.cnc.machine.item.path !== ''">
                        <el-button class="info" type="primary" :icon="icons.Download" @click="onDownloadMachine" circle v-if="!props.cnc.machine.download_loading"></el-button>
                        <el-button class="info" type="primary" circle v-else>
                            <el-icon class="is-loading"><Loading /></el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-button class="info" type="primary" :icon="icons.Delete" @click="onDeleteMachine" circle v-if="!props.cnc.machine.item.is_default && props.cnc.machine.item.path !== ''"></el-button>
                    <el-button color="#5e4eff" type="primary" :loading="props.cnc.machine.update_loading" @click="onUpdateMachine">保存配置</el-button>
                </div>
            </div>
        </div>
    </div>
    <NewMachineDialog ref="newMachineDialog" :cnc="props.cnc" v-if="props.cnc.dialog.config.type === 'new_machine'" />
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage, ElMessageBox} from "element-plus";
import BaseMachine from "./machine/base.vue";
import SpindleMachine from "./machine/spindle.vue";
import JointMachine from "./machine/joint.vue";
import ToolMachine from "./machine/tool.vue";
import SignalMachine from "./machine/signal.vue";
import WheelMachine from "./machine/wheel.vue";
import HalMachine from "./machine/hal.vue";
import XmlMachine from "./machine/xml.vue";
import LaunchMachine from "./machine/launch.vue";
import NewMachineDialog from "../common/dialog/new_machine.vue";
export default defineComponent({
    name: "MachineStart",
    emits: [],
    props: ["cnc"],
    components: {
        BaseMachine,
        SpindleMachine,
        ToolMachine,
        SignalMachine,
        WheelMachine,
        JointMachine,
        HalMachine,
        XmlMachine,
        LaunchMachine,
        NewMachineDialog
    },
    setup(props, context) {

        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_machine"){
                onCloseSelect();
                onData();
            }
        });

        function onData(){
            props.cnc.machine.items = [];
            props.cnc.machine.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/select", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.machine.items = response.data.machine;
                        props.cnc.machine.loading = false;
                    }else{
                        props.cnc.machine.loading = false;
                    }
                }else{
                    props.cnc.machine.loading = false;
                }
            });
        }

        function newMachine(){
            props.cnc.dialog.config.type = "new_machine";
            props.cnc.dialog.config.title = "新增机床配置";
            props.cnc.dialog.config.width = "350px";
            props.cnc.dialog.config.close = true;
            props.cnc.dialog.form = {
                upload_loading: false,
                new_callback: ()=>{
                    onSelect({path: ""});
                }
            }
            props.cnc.dialog.status = true;
        }

        function onSelect(item: any){
            if(props.cnc.machine.item && props.cnc.machine.item.path === item.path || props.cnc.machine.tab.loading){
                return;
            }
            props.cnc.machine.tab.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/get", "GET", {path: item.path}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.machine.item = onFormatData(response);
                        props.cnc.machine.tab.items = [];
                        let tabs = [
                            {name: "基础配置", id: "base"},
                            {name: "主轴配置", id: "spindle"},
                            {name: "轴关节配置", id: "joint"},
                            {name: "刀库配置", id: "tool"},
                            {name: "信号配置", id: "signal"},
                            {name: "手轮配置", id: "wheel"}
                        ]
                        if(item.path !== ""){
                            tabs.push({name: "HAL配置", id: "hal"});
                            tabs.push({name: "XML配置", id: "xml"});
                            tabs.push({name: "启动程序", id: "launch"});
                        }
                        props.cnc.machine.tab.items.push(...tabs);
                        props.cnc.machine.tab.value = "base";
                        props.cnc.machine.tab.loading = false;
                        props.cnc.machine.update_loading = false;
                        props.cnc.machine.download_loading = false;
                    }else{
                        props.cnc.machine.tab.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "请求失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    props.cnc.machine.tab.loading = false;
                    ElMessage.closeAll();
                    ElMessage({
                        message: "请求失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function onFormatData(response: any){
            let data = JSON.parse(JSON.stringify(response.data));
            data.joints = data.ini.Traj.Coordinates.split("");
            data.ini.Display.MaxSpindleOverride = parseFloat(data.ini.Display.MaxSpindleOverride) * 100 + "";
            data.ini.Display.MinSpindleOverride = parseFloat(data.ini.Display.MinSpindleOverride) * 100 + "";
            data.ini.Display.MaxFeedOverride = parseFloat(data.ini.Display.MaxFeedOverride) * 100 + "";
            data.ini.Display.DefaultLinearVelocity = Math.round(data.ini.Display.DefaultLinearVelocity * 60).toFixed(3) + "";
            data.ini.Display.MinLinearVelocity = Math.round(data.ini.Display.MinLinearVelocity * 60).toFixed(3) + "";
            data.ini.Display.MaxLinearVelocity = Math.round(data.ini.Display.MaxLinearVelocity * 60).toFixed(3) + "";
            data.ini.Display.DefaultAngularVelocity = Math.round(data.ini.Display.DefaultAngularVelocity * 60).toFixed(3) + "";
            data.ini.Display.MinAngularVelocity = Math.round(data.ini.Display.MinAngularVelocity * 60).toFixed(3) + "";
            data.ini.Display.MaxAngularVelocity = Math.round(data.ini.Display.MaxAngularVelocity * 60).toFixed(3) + "";
            data.joints.forEach((item: any, index: any, array: any)=>{
                data.ini["Joint" + index].MaxVelocity = Math.round(data.ini["Joint" + index].MaxVelocity * 60).toFixed(3) + "";
                data.ini["Joint" + index].HomeSearchVel = Math.round(data.ini["Joint" + index].HomeSearchVel * 60).toFixed(3) + "";
                data.ini["Joint" + index].HomeLarchVel = Math.round(data.ini["Joint" + index].HomeLarchVel * 60).toFixed(3) + "";
                data.ini["Joint" + index].HomeFinalVel = Math.round(data.ini["Joint" + index].HomeFinalVel * 60).toFixed(3) + "";
            });
            data.user.HandWheel.XVelocity = Math.round(data.user.HandWheel.XVelocity * 60).toFixed(3) + "";
            data.user.HandWheel.YVelocity = Math.round(data.user.HandWheel.YVelocity * 60).toFixed(3) + "";
            data.user.HandWheel.ZVelocity = Math.round(data.user.HandWheel.ZVelocity * 60).toFixed(3) + "";
            data.user.HandWheel.AVelocity = Math.round(data.user.HandWheel.AVelocity * 60).toFixed(3) + "";
            data.user.HandWheel.BVelocity = Math.round(data.user.HandWheel.BVelocity * 60).toFixed(3) + "";
            data.user.HandWheel.CVelocity = Math.round(data.user.HandWheel.CVelocity * 60).toFixed(3) + "";
            data.user.Tool.SearchVelocity = Math.round(data.user.Tool.SearchVelocity * 60).toFixed(3) + "";
            data.user.Tool.LatchSearchVelocity = Math.round(data.user.Tool.LatchSearchVelocity * 60).toFixed(3) + "";
            data.user.Tool.Pockets = JSON.parse(data.user.Tool.Pockets);
            data.table = data.table.split(";").map((item: any, index: any) => {
                let parts = item.trim().split(" ");
                if(parts.length > 1){
                    return {id: index + "", t: parts[0], p: parts[1], d: parseFloat(parts[2].replace("D", "")).toFixed(3), x: parseFloat(parts[3].replace("X", "")).toFixed(3), y: parseFloat(parts[4].replace("Y", "")).toFixed(3), z: parseFloat(parts[5].replace("Z", "")).toFixed(3)};
                }else{
                    return false;
                }
            });
            if(!data.table[data.table.length - 1]){
                data.table.pop();
            }
            return data;
        }

        function onCloseSelect(){
            props.cnc.machine.tab.items = [];
            props.cnc.machine.tab.value = "";
            props.cnc.machine.tab.loading = false;
            props.cnc.machine.update_loading = false;
            props.cnc.machine.download_loading = false;
            props.cnc.machine.item = false;
        }

        const halMachine = ref(null);
        const xmlMachine = ref(null);
        const launchMachine = ref(null);
        function onUpdateMachine(){
            if(!props.cnc.machine.update_loading){
                if(props.cnc.machine.tab.value == "hal"){
                    if((halMachine as any).value){
                        props.cnc.machine.update_loading = true;
                        (halMachine as any).value[0].onSaveHal();
                    }
                    return
                }
                if(props.cnc.machine.tab.value == "xml"){
                    if((xmlMachine as any).value){
                        props.cnc.machine.update_loading = true;
                        (xmlMachine as any).value[0].onSaveXml();
                    }
                    return
                }
                if(props.cnc.machine.tab.value == "launch"){
                    if((launchMachine as any).value){
                        props.cnc.machine.update_loading = true;
                        (launchMachine as any).value[0].onSaveLaunch();
                    }
                    return
                }
                let check = true;
                Object.entries(props.cnc.machine.item.ini).forEach(([key, value])=>{
                    if (typeof value === "object" && value !== null) {
                        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                            if (nestedValue === null || nestedValue === "") {
                                check = false;
                            }
                        });
                    }
                });
                if(props.cnc.machine.item.user.Tool.Pockets.length > 0){
                    Object.entries(props.cnc.machine.item.user.Tool.Pockets).forEach(([key, value])=>{
                        if (typeof value === "object" && value !== null) {
                            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                                if (nestedValue === null || nestedValue === "") {
                                    check = false;
                                }
                            });
                        }
                    });
                }
                if(props.cnc.machine.item.table.length > 0){
                    Object.entries(props.cnc.machine.item.table).forEach(([key, value])=>{
                        if (typeof value === "object" && value !== null) {
                            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                                if (nestedValue === null || nestedValue === "") {
                                    check = false;
                                }
                            });
                        }
                    });
                }
                if(!check){
                    ElMessage.closeAll();
                    ElMessage({
                        message: "配置信息不完整，请检查",
                        type: "warning",
                        customClass: "cnc"
                    });
                }else{
                    props.cnc.machine.update_loading = true;
                    let data = JSON.parse(JSON.stringify(props.cnc.machine.item));
                    data.ini.Display.MaxSpindleOverride = parseInt(data.ini.Display.MaxSpindleOverride) / 100 + "";
                    data.ini.Display.MinSpindleOverride = parseInt(data.ini.Display.MinSpindleOverride) / 100 + "";
                    data.ini.Display.MaxFeedOverride = parseInt(data.ini.Display.MaxFeedOverride) / 100 + "";
                    data.ini.Display.DefaultLinearVelocity = (parseFloat(data.ini.Display.DefaultLinearVelocity) / 60).toFixed(3) + "";
                    data.ini.Display.MinLinearVelocity = (parseFloat(data.ini.Display.MinLinearVelocity) / 60).toFixed(3) + "";
                    data.ini.Display.MaxLinearVelocity = (parseFloat(data.ini.Display.MaxLinearVelocity) / 60).toFixed(3) + "";
                    data.ini.Display.DefaultAngularVelocity = (parseFloat(data.ini.Display.DefaultAngularVelocity) / 60).toFixed(3) + "";
                    data.ini.Display.MinAngularVelocity = (parseFloat(data.ini.Display.MinAngularVelocity) / 60).toFixed(3) + "";
                    data.ini.Display.MaxAngularVelocity = (parseFloat(data.ini.Display.MaxAngularVelocity) / 60).toFixed(3) + "";
                    data.joints.forEach((item: any, index: any, array: any)=>{
                        data.ini["Joint" + index].MaxVelocity = (parseFloat(data.ini["Joint" + index].MaxVelocity) / 60).toFixed(3) + "";
                        data.ini["Joint" + index].HomeSearchVel = (parseFloat(data.ini["Joint" + index].HomeSearchVel) / 60).toFixed(3) + "";
                        data.ini["Joint" + index].HomeLarchVel = (parseFloat(data.ini["Joint" + index].HomeLarchVel) / 60).toFixed(3) + "";
                        data.ini["Joint" + index].HomeFinalVel = (parseFloat(data.ini["Joint" + index].HomeFinalVel) / 60).toFixed(3) + "";
                        data.ini["Axis" + item].MaxVelocity = data.ini["Joint" + index].MaxVelocity;
                        data.ini["Axis" + item].MaxAcceleration = parseFloat(data.ini["Joint" + index].MaxAcceleration).toFixed(3) + "";
                        data.ini["Axis" + item].MinLimit = parseFloat(data.ini["Joint" + index].MinLimit).toFixed(3) + "";
                        data.ini["Axis" + item].MaxLimit = parseFloat(data.ini["Joint" + index].MaxLimit).toFixed(3) + "";
                    });
                    data.user.HandWheel.XVelocity = (parseFloat(data.user.HandWheel.XVelocity) / 60).toFixed(3) + "";
                    data.user.HandWheel.YVelocity = (parseFloat(data.user.HandWheel.YVelocity) / 60).toFixed(3) + "";
                    data.user.HandWheel.ZVelocity = (parseFloat(data.user.HandWheel.ZVelocity) / 60).toFixed(3) + "";
                    data.user.HandWheel.AVelocity = (parseFloat(data.user.HandWheel.AVelocity) / 60).toFixed(3) + "";
                    data.user.HandWheel.BVelocity = (parseFloat(data.user.HandWheel.BVelocity) / 60).toFixed(3) + "";
                    data.user.HandWheel.CVelocity = (parseFloat(data.user.HandWheel.CVelocity) / 60).toFixed(3) + "";
                    data.user.Tool.SearchVelocity = (parseFloat(data.user.Tool.SearchVelocity) / 60).toFixed(3) + "";
                    data.user.Tool.LatchSearchVelocity = (parseFloat(data.user.Tool.LatchSearchVelocity) / 60).toFixed(3) + "";
                    data.user.Tool.Pockets = JSON.stringify(data.user.Tool.Pockets);
                    data.table = data.table.map((item: any, index: any) => {
                        return item.t + " " + item.p + " " + "D" + parseFloat(item.d).toFixed(3) + " " + "X" + parseFloat(item.x).toFixed(3) + " " + "Y" + parseFloat(item.y).toFixed(3) + " " + "Z" + parseFloat(item.z).toFixed(3) + ";\n";
                    });
                    data.table = data.table.join("");
                    (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/update", "POST", data).then((response: any)=>{
                        if(response.code === 0){
                            if(response.data){
                                if(data.path !== ""){
                                    props.cnc.machine.items.forEach((item: any, index: any, array: any)=>{
                                        if(item.path === props.cnc.machine.item.path){
                                            props.cnc.machine.items[index].name = props.cnc.machine.item.user.Base.Name;
                                            props.cnc.machine.items[index].describe = props.cnc.machine.item.user.Base.Describe;
                                            props.cnc.machine.items[index].control = props.cnc.machine.item.user.Base.Control;
                                        }
                                    });
                                }
                                if(data.path === ""){
                                    (window as any).runtime.EventsEmit("event_page", {type: "page_machine"});
                                }
                                props.cnc.machine.update_loading = false;
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "保存成功",
                                    type: "success",
                                    customClass: "cnc"
                                });
                            }else{
                                props.cnc.machine.update_loading = false;
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "保存失败，请重新尝试",
                                    type: "warning",
                                    customClass: "cnc"
                                });
                            }
                        }else{
                            props.cnc.machine.update_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    });
                }
            }
        }

        function onDownloadMachine(){
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/download", "GET", {path: props.cnc.machine.item.path}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.machine.download_loading = true;
                        (window as any).go.StartWindows.Api.SaveFile("保存文件", response.data.file).then((path: string)=>{
                            if(path !== ""){
                                (window as any).go.StartWindows.Api.DownloadFile(props.cnc.device.ip + ":" + props.cnc.device.message.port + "/resources/runtime/" + response.data.file, path).then((status: string)=>{
                                    if(status){
                                        let message = {command: "desktop:delete:uploads:file", data: response.data.file};
                                        props.cnc.device.message.socket.send(JSON.stringify(message));
                                        props.cnc.machine.download_loading = false;
                                        ElMessage.closeAll();
                                        ElMessage({
                                            message: "下载完成",
                                            type: "success",
                                            customClass: "cnc"
                                        });
                                    }else{
                                        props.cnc.machine.download_loading = false;
                                        let message = {command: "desktop:delete:uploads:file", data: response.data.file};
                                        props.cnc.device.message.socket.send(JSON.stringify(message));
                                        ElMessage.closeAll();
                                        ElMessage({
                                            message: "下载失败，请重新尝试",
                                            type: "warning",
                                            customClass: "cnc"
                                        });
                                    }
                                });
                            }else{
                                props.cnc.machine.download_loading = false;
                                let message = {command: "desktop:delete:uploads:file", data: response.data.file};
                                props.cnc.device.message.socket.send(JSON.stringify(message));
                            }
                        });
                    }else{
                        props.cnc.machine.download_loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "下载失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    props.cnc.machine.download_loading = false;
                    ElMessage.closeAll();
                    ElMessage({
                        message: "下载失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function onDeleteMachine(){
            ElMessageBox.confirm("是否确认删除机床配置？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/delete", "GET", {path: props.cnc.machine.item.path}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            onCloseSelect();
                            (window as any).runtime.EventsEmit("event_page", {type: "page_machine"});
                            ElMessage.closeAll();
                            ElMessage({
                                message: "删除成功",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            ElMessage.closeAll();
                            ElMessage({
                                message: "删除失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        ElMessage.closeAll();
                        ElMessage({
                            message: "删除失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
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
            halMachine,
            xmlMachine,
            launchMachine,
            newMachine,
            onSelect,
            onUpdateMachine,
            onDownloadMachine,
            onDeleteMachine
        }
    }
});
</script>

<style scoped>
.machine-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.machine-view.machine{
    display: block;
}
.machine-view .item{
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.machine-view .item:first-child{
    width: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-right: solid 1px rgba(30, 31, 34, 1);
}
.machine-view .item .item-header{
    width: 100%;
    height: 40px;
    background-color: rgba(43, 45, 48, .5);
    border-bottom: solid 1px rgba(30, 31, 34, 1);
    padding: 5px;
}
.machine-view .item .item-header .item-header-item{
    width: calc(100% - 40px);
    height: 30px;
    display: inline-block;
    vertical-align: top;
}
.machine-view .item .item-header .item-header-item:first-child{
    padding-right: 5px;
}
.machine-view .item .item-header .item-header-item:last-child{
    width: 40px;
}
.machine-view .item .item-footer{
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 5px;
}
.machine-view .item .item-footer .item-footer-box{
    width: 100%;
}
.machine-view .item .item-footer .item-footer-box .machine-item{
    width: 100%;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
}
.machine-view .item .item-footer .item-footer-box .machine-item:hover{
    cursor: pointer;
}
.machine-view .item .item-footer .item-footer-box .machine-item.select{
    background-color: rgba(43, 45, 48, 1);
}
.machine-view .item .item-footer .item-footer-box .machine-item .title{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.machine-view .item .item-footer .item-footer-box .machine-item:hover .title{
    color: #ffffff;
}
.machine-view .item .item-footer .item-footer-box .machine-item.select .title{
    color: #ffffff;
}
.machine-view .item .item-footer .item-footer-box .machine-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.machine-view .item .item-footer .item-footer-box .machine-item .tag{
    width: 100%;
    padding: 2px 0;
}
.machine-view .machine-box{
    width: 100%;
    height: 100%;
    position: relative;
}
.machine-view .machine-box .machine-button{
    width: 100%;
    height: 40px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    padding: 4px 20px;
    text-align: right;
    z-index: 100;
}
</style>
