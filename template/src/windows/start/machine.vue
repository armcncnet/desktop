<template>
    <div class="machine-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-header">
                <div class="item-header-item">
                    <el-input class="cnc none" v-model="props.cnc.machine.search_keyword" placeholder="请输入关键词" maxlength="140" autocomplete="off" spellcheck="false" clearable />
                </div>
                <div class="item-header-item">
                    <el-tooltip popper-class="cnc" effect="dark" content="新增机床配置" placement="bottom">
                        <el-button class="cnc" :icon="icons.Plus"></el-button>
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
                <el-tabs v-model="props.cnc.machine.tab.value" type="card" class="cnc" @tab-remove="onTabRemove">
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
                <div class="machine-button" v-if="props.cnc.machine.tab.value !== 'launch' && props.cnc.machine.tab.value !== 'hal' && props.cnc.machine.tab.value !== 'xml'">
                    <el-tooltip popper-class="cnc" effect="dark" content="下载配置" placement="top">
                        <el-button class="info" type="primary" :icon="icons.Download" @click="onDownloadMachine" circle></el-button>
                    </el-tooltip>
                    <el-button class="info" type="primary" :icon="icons.Delete" @click="onDeleteMachine" circle v-if="!props.cnc.machine.item.is_default"></el-button>
                    <el-button color="#5e4eff" type="primary" @click="onUpdateMachine">保存配置</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
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
        LaunchMachine
    },
    setup(props, context) {

        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_machine"){
                props.cnc.machine.item = false;
                props.cnc.machine.tab.items = [];
                props.cnc.machine.tab.value = "";
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

        function onSelect(item: any){
            if(props.cnc.machine.item && props.cnc.machine.item.path === item.path){
                return;
            }
            props.cnc.machine.tab.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/get", "GET", {path: item.path}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        console.log(response.data);
                        props.cnc.machine.item = JSON.parse(JSON.stringify(response.data));
                        props.cnc.machine.item.joints = props.cnc.machine.item.ini.Traj.Coordinates.split("");
                        props.cnc.machine.item.ini.Display.MaxSpindleOverride = parseFloat(props.cnc.machine.item.ini.Display.MaxSpindleOverride) * 100 + "";
                        props.cnc.machine.item.ini.Display.MinSpindleOverride = parseFloat(props.cnc.machine.item.ini.Display.MinSpindleOverride) * 100 + "";
                        props.cnc.machine.item.ini.Display.MaxFeedOverride = parseFloat(props.cnc.machine.item.ini.Display.MaxFeedOverride) * 100 + "";
                        props.cnc.machine.item.ini.Display.DefaultLinearVelocity = Math.round(props.cnc.machine.item.ini.Display.DefaultLinearVelocity * 60).toFixed(3) + "";
                        props.cnc.machine.item.ini.Display.MinLinearVelocity = Math.round(props.cnc.machine.item.ini.Display.MinLinearVelocity * 60).toFixed(3) + "";
                        props.cnc.machine.item.ini.Display.MaxLinearVelocity = Math.round(props.cnc.machine.item.ini.Display.MaxLinearVelocity * 60).toFixed(3) + "";
                        props.cnc.machine.item.ini.Display.DefaultAngularVelocity = Math.round(props.cnc.machine.item.ini.Display.DefaultAngularVelocity * 60).toFixed(3) + "";
                        props.cnc.machine.item.ini.Display.MinAngularVelocity = Math.round(props.cnc.machine.item.ini.Display.MinAngularVelocity * 60).toFixed(3) + "";
                        props.cnc.machine.item.ini.Display.MaxAngularVelocity = Math.round(props.cnc.machine.item.ini.Display.MaxAngularVelocity * 60).toFixed(3) + "";
                        props.cnc.machine.item.joints.forEach((item: any, index: any, array: any)=>{
                            props.cnc.machine.item.ini["Joint" + index].MaxVelocity = Math.round(props.cnc.machine.item.ini["Joint" + index].MaxVelocity * 60).toFixed(3) + "";
                            props.cnc.machine.item.ini["Joint" + index].HomeSearchVel = Math.round(props.cnc.machine.item.ini["Joint" + index].HomeSearchVel * 60).toFixed(3) + "";
                            props.cnc.machine.item.ini["Joint" + index].HomeLarchVel = Math.round(props.cnc.machine.item.ini["Joint" + index].HomeLarchVel * 60).toFixed(3) + "";
                            props.cnc.machine.item.ini["Joint" + index].HomeFinalVel = Math.round(props.cnc.machine.item.ini["Joint" + index].HomeFinalVel * 60).toFixed(3) + "";
                        });
                        props.cnc.machine.item.user.Tool.Pockets = JSON.parse(props.cnc.machine.item.user.Tool.Pockets);
                        props.cnc.machine.item.table = props.cnc.machine.item.table.split(";").map((item: any, index: any) => {
                            let parts = item.trim().split(" ");
                            if(parts.length > 1){
                                return {id: index, t: parts[0], p: parts[1], d: parseFloat(parts[2].replace("D", "")).toFixed(3), x: parseFloat(parts[3].replace("X", "")).toFixed(3), y: parseFloat(parts[4].replace("Y", "")).toFixed(3), z: parseFloat(parts[5].replace("Z", "")).toFixed(3)};
                            }else{
                                return false;
                            }
                        });
                        if(!props.cnc.machine.item.table[props.cnc.machine.item.table.length - 1]){
                            props.cnc.machine.item.table.pop();
                        }
                        props.cnc.machine.tab.items = [];
                        let tabs = [
                            {name: "基础配置", id: "base"},
                            {name: "主轴配置", id: "spindle"},
                            {name: "轴关节配置", id: "joint"},
                            {name: "刀库配置", id: "tool"},
                            {name: "信号配置", id: "signal"},
                            {name: "手轮配置", id: "wheel"},
                            {name: "HAL配置", id: "hal"},
                            {name: "XML配置", id: "xml"},
                            {name: "启动程序", id: "launch"},
                        ]
                        props.cnc.machine.tab.items.push(...tabs);
                        props.cnc.machine.tab.value = "base";
                        props.cnc.machine.tab.loading = false;
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

        function onUpdateMachine(){

        }

        function onDownloadMachine(){

        }

        function onDeleteMachine(){
            ElMessageBox.confirm("是否确认删除机床配置？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                props.cnc.machine.tab.loading = false;
                props.cnc.machine.tab.items = [];
                props.cnc.machine.item = false;
            }).catch(() => {});
        }

        function onTabRemove(){}

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onSelect,
            onTabRemove,
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
