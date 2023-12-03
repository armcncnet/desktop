<template>
    <div class="bottom-view">
        <div class="bottom-header">
            <div class="bottom-header-item">
                <div class="item">
                    <el-tooltip popper-class="cnc" effect="dark" content="选择机床配置" placement="top">
                        <el-button class="cnc" :disabled="props.cnc.header.right.enabled === 'active'" :icon="icons.Files" @click="openMachine">
                            <div class="bottom-name">{{props.cnc.device.machine.path === "" ? "未配置" : props.cnc.device.machine.path}}</div>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip popper-class="cnc" effect="dark" content="打开G程序" placement="top">
                        <el-button class="cnc" :disabled="props.cnc.header.centre.start === 'active'" :icon="icons.FolderOpened" @click="openProgram"></el-button>
                    </el-tooltip>
                    <el-tooltip popper-class="cnc" effect="dark" content="刷新G程序" placement="top">
                        <el-button class="cnc" :disabled="props.cnc.header.centre.start === 'active'" :icon="icons.Refresh" @click="refreshProgram"></el-button>
                    </el-tooltip>
                </div>
            </div>
            <div class="bottom-header-item">
                <div class="item">
                    <el-radio-group class="cnc" v-model="props.cnc.console.bottom.view" @change="onSwitchView">
                        <el-radio-button label="x">X</el-radio-button>
                        <el-radio-button label="y">Y</el-radio-button>
                        <el-radio-button label="z">Z</el-radio-button>
                        <el-radio-button label="p">P</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="bottom-header-item">
                <div class="item">
                    <el-tooltip popper-class="cnc" effect="dark" content="清除刀轨" placement="top">
                        <el-button class="cnc" :icon="icons.DeleteLocation" @click="clearLine"></el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="bottom-footer" ref="bottomFooter" style="overflow-y: auto">
            <div class="code-box" v-infinite-scroll="onScroll" v-if="props.cnc.console.bottom.line.items.length > 0">
                <div :name="'line' + (item.id + 1)" class="code-line" :class="props.cnc.console.bottom.line.motion_line > 0 && props.cnc.console.bottom.line.motion_line === item.id + 1 ? 'current' : ''" v-for="(item, index) in props.cnc.console.bottom.line.items" :key="index">
                    <div class="item">{{item.code}}</div>
                    <div class="item">{{item.id + 1}}</div>
                </div>
            </div>
        </div>
    </div>
    <ProgramDialog ref="programDialog" :cnc="props.cnc" v-if="props.cnc.dialog.config.type === 'program'" />
    <MachineDialog ref="machineDialog" :cnc="props.cnc" v-if="props.cnc.dialog.config.type === 'machine'" />
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";
import * as icons from "@element-plus/icons";
import ProgramDialog from "../../common/dialog/program.vue";
import MachineDialog from "../../common/dialog/machine.vue";

export default defineComponent({
    name: "BottomConsole",
    emits: [],
    props: ["cnc"],
    components: {
        ProgramDialog,
        MachineDialog
    },
    setup(props, context) {

        (window as any).runtime.EventsOn("event_load_code", (message: any) => {
            if(message.file && message.file !== ""){
                onCode(message.file);
            }
        });

        (window as any).runtime.EventsOn("set_highlight_line", (message: any) => {
            setHighlightLine(message.line ? message.line : 0);
        });

        (window as any).runtime.EventsOn("set_start_line", (message: any) => {
            props.cnc.console.bottom.line.page = 0;
            props.cnc.console.bottom.line.motion_line = 0;
            props.cnc.console.bottom.line.items = [];
            onScroll(true);
        });

        function onCode(file: string){
            props.cnc.console.left.simulation.mask = true;
            props.cnc.console.bottom.line.loading = true;
            props.cnc.console.bottom.line.page = 0;
            props.cnc.console.bottom.line.tmp = [];
            props.cnc.console.bottom.line.items = [];
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/program/read/line", "GET", {file_name: file}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        if((window as any).simulation){
                            (window as any).simulation.clearToolLine();
                            (window as any).simulation.onLoadCode(response.data.lines);
                        }
                        props.cnc.console.bottom.line.content = response.data.content;
                        props.cnc.console.bottom.line.tmp = response.data.lines.map((item: any, index: any)=>{return {id: index, code: item}});
                        props.cnc.console.bottom.line.page = 0;
                        if(props.cnc.console.bottom.line.motion_line > 0){
                            props.cnc.console.bottom.line.page = Math.ceil(props.cnc.console.bottom.line.motion_line / 1000) - 1;
                        }
                        onScroll(true);
                        props.cnc.console.bottom.line.loading = false;
                    }else{
                        props.cnc.console.bottom.line.loading = false;
                    }
                }else{
                    props.cnc.console.bottom.line.loading = false;
                }
            });
        }

        function onScroll(event = false){
            if(props.cnc.console.bottom.line.page > -1){
                let data = props.cnc.console.bottom.line.tmp.slice(props.cnc.console.bottom.line.page * 1000, -1);
                if(data.length >= 1000){
                    let new_data = data.slice(0, 1000);
                    props.cnc.console.bottom.line.items.push(...new_data);
                    props.cnc.console.bottom.line.page++;
                    if(!event){
                        props.cnc.console.bottom.line.items.splice(0, 950);
                    }
                }else{
                    let new_data = data.slice(0, 1000);
                    props.cnc.console.bottom.line.items.push(...new_data);
                    props.cnc.console.bottom.line.items.push(props.cnc.console.bottom.line.tmp[props.cnc.console.bottom.line.tmp.length - 1]);
                    props.cnc.console.bottom.line.page = -1;
                }
            }
        }

        const bottomFooter = ref(null);
        function setHighlightLine(line: any){
            props.cnc.console.bottom.line.motion_line = line;
            if((bottomFooter as any).value && props.cnc.device.machine.info.state === 2 && props.cnc.device.machine.info.task_paused === 0 && props.cnc.console.bottom.line.items.length > 0){
                const targetLine = (bottomFooter as any).value.querySelector(`[name="line${line}"]`);
                if (targetLine) {
                    const containerTop = (bottomFooter as any).value.offsetTop;
                    const targetLineTop = targetLine.offsetTop;
                    const topPositionToScroll = targetLineTop - containerTop - 48;
                    (bottomFooter as any).value.scrollTo({
                        top: topPositionToScroll,
                        behavior: "auto"
                    });
                }
            }
        }

        function openMachine(){
            props.cnc.dialog.config.type = "machine";
            props.cnc.dialog.config.title = "选择机床配置";
            props.cnc.dialog.config.width = "260px";
            props.cnc.dialog.config.close = true;
            props.cnc.dialog.form = {
                items: [],
                item: false,
                loading: true,
            }
            props.cnc.dialog.status = true;
        }

        function openProgram(){
            props.cnc.dialog.config.type = "program";
            props.cnc.dialog.config.title = "打开G程序";
            props.cnc.dialog.config.width = "260px";
            props.cnc.dialog.config.close = true;
            props.cnc.dialog.form = {
                items: [],
                item: false,
                loading: true,
            }
            props.cnc.dialog.status = true;
        }

        function refreshProgram(){
            if((window as any).simulation){
                (window as any).simulation.clearToolLine();
                (window as any).simulation.clearGcode();
            }
            (window as any).runtime.EventsEmit("event_load_code", {file: props.cnc.device.machine.file});
        }

        function onSwitchView(value: string){
            if((window as any).simulation){
                (window as any).simulation.setView(value);
            }
        }

        function clearLine(){
            if((window as any).simulation){
                (window as any).simulation.clearToolLine();
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            bottomFooter,
            onScroll,
            openMachine,
            openProgram,
            refreshProgram,
            onSwitchView,
            clearLine
        }
    }
});
</script>

<style scoped>
.bottom-view{
    width: 100%;
    height: 100%;
}
.bottom-view .bottom-header{
    width: 100%;
    height: 40px;
    background-color: rgba(43, 45, 48, .5);
    border-bottom: solid 1px rgba(30, 31, 34, .8);
}
.bottom-view .bottom-header .bottom-header-item{
    width: 33.33%;
    height: 40px;
    display: inline-block;
    vertical-align: top;
    padding: 2px 5px;
    text-align: center;
}
.bottom-view .bottom-header .bottom-header-item:first-child{
    text-align: left;
}
.bottom-view .bottom-header .bottom-header-item:last-child{
    text-align: right;
}
.bottom-view .bottom-header .bottom-header-item .item{
    width: auto;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    vertical-align: top;
}
.bottom-view .bottom-header .bottom-header-item .item .bottom-name{
    max-width: 60px;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.bottom-view .bottom-footer{
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
}
.bottom-view .bottom-footer .code-box{
    width: 100%;
    height: 100%;
}
.bottom-view .bottom-footer .code-box .code-line{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    position: relative;
}
.bottom-view .bottom-footer .code-box .code-line:hover{
    color: #999999;
}
.bottom-view .bottom-footer .code-box .code-line .item{
    width: auto;
    height: 24px;
}
.bottom-view .bottom-footer .code-box .code-line .item:first-child{
    width: 100%;
    padding-left: 5px;
}
.bottom-view .bottom-footer .code-box .code-line .item:last-child{
    position: absolute;
    top: 0;
    right: 0;
    font-size: 11px;
    padding-right: 5px;}
.bottom-view .bottom-footer .code-box .code-line.current{
    color: #5e4eff;
}
</style>
