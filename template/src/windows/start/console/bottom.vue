<template>
    <div class="bottom-view">
        <div class="bottom-header">
            <div class="bottom-header-item">
                <div class="item">
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
            <div class="bottom-header-item"></div>
        </div>
        <div class="bottom-footer" ref="bottomFooter" style="overflow-y: auto">
            <div class="code-box" v-infinite-scroll="onScroll">
                <div :name="'line' + (index + 1)" class="code-line" :class="props.cnc.console.bottom.line.motion_line > 0 && (props.cnc.console.bottom.line.motion_line - 1) === index ? 'current' : ''" v-for="(item, index) in props.cnc.console.bottom.line.items" :key="index">
                    <div class="item">{{index + 1}}</div>
                    <div class="item">{{item}}</div>
                </div>
            </div>
        </div>
    </div>
    <ProgramDialog ref="programDialog" :cnc="props.cnc" v-if="props.cnc.dialog.config.type === 'program'" />
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref} from "vue";
import * as icons from "@element-plus/icons";
import ProgramDialog from "../../common/dialog/program.vue";
export default defineComponent({
    name: "BottomConsole",
    emits: [],
    props: ["cnc"],
    components: {
        ProgramDialog
    },
    setup(props, context) {

        (window as any).runtime.EventsOn("event_load_code", (message: any) => {
            if(message.file && message.file !== ""){
                onCode(message.file);
            }
        });

        (window as any).runtime.EventsOn("set_highlight_line", (message: any) => {
            if(message.line && message.line !== ""){
                setHighlightLine(message.line);
            }
        });

        function onCode(file: string){
            props.cnc.console.bottom.line.loading = true;
            props.cnc.console.bottom.line.tmp_index = 0;
            props.cnc.console.bottom.line.tmp = [];
            props.cnc.console.bottom.line.items = [];
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/code/read/line", "GET", {file_name: file}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        let file_blob = new Blob([response.data.content], {type:"application/text;charset=utf-8"});
                        if((window as any).simulation){
                            (window as any).simulation.clearToolLine();
                            (window as any).simulation.onLoadCode((window as any).URL.createObjectURL(file_blob));
                        }
                        props.cnc.console.bottom.line.content = response.data.content;
                        props.cnc.console.bottom.line.tmp = response.data.lines;
                        if(props.cnc.console.bottom.line.tmp.length <= 1000){
                            props.cnc.console.bottom.line.items = response.data.lines;
                        }else{
                            props.cnc.console.bottom.line.items = response.data.lines.slice(0, 1000);
                            props.cnc.console.bottom.line.tmp_index = 1;
                        }
                        props.cnc.console.bottom.line.loading = false;
                    }else{
                        props.cnc.console.bottom.line.loading = false;
                    }
                }else{
                    props.cnc.console.bottom.line.loading = false;
                }
            });
        }

        function onScroll(){
            if(props.cnc.console.bottom.line.tmp_index > 0){
                let data = props.cnc.console.bottom.line.tmp.slice(props.cnc.console.bottom.line.tmp_index * 1000, -1);
                if(data.length >= 1000){
                    let new_data = data.slice(0, 1000);
                    props.cnc.console.bottom.line.items.push(...new_data);
                    props.cnc.console.bottom.line.tmp_index++;
                }else{
                    let new_data = data.slice(0, 1000);
                    props.cnc.console.bottom.line.items.push(...new_data);
                    props.cnc.console.bottom.line.items.push(props.cnc.console.bottom.line.tmp[props.cnc.console.bottom.line.tmp.length - 1]);
                    props.cnc.console.bottom.line.tmp_index = 0;
                }
            }
        }

        const bottomFooter = ref(null);
        function setHighlightLine(line: any){
            props.cnc.console.bottom.line.motion_line = line;
            if((bottomFooter as any).value && props.cnc.device.machine.info.state === 2){
                const targetLine = (bottomFooter as any).value.querySelector(`[name="line${line}"]`);
                if (targetLine) {
                    const containerTop = (bottomFooter as any).value.offsetTop;
                    const targetLineTop = targetLine.offsetTop;
                    const topPositionToScroll = targetLineTop - containerTop - 50;
                    (bottomFooter as any).value.scrollTo({
                        top: topPositionToScroll,
                        behavior: "auto"
                    });
                }
            }
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

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            bottomFooter,
            onScroll,
            openProgram,
            refreshProgram,
            onSwitchView
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
.bottom-view .bottom-footer{
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
}
.bottom-view .bottom-footer .code-box{
    width: 100%;
}
.bottom-view .bottom-footer .code-box .code-line{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
}
.bottom-view .bottom-footer .code-box .code-line:hover{
    color: #999999;
}
.bottom-view .bottom-footer .code-box .code-line .item{
    width: auto;
    height: 24px;
    display: inline-block;
    vertical-align: top;
}
.bottom-view .bottom-footer .code-box .code-line .item:first-child{
    width: 50px;
    color: #666666;
    text-align: right;
    padding-right: 5px;
}
.bottom-view .bottom-footer .code-box .code-line .item:last-child{
    width: calc(100% - 50px);
}
.bottom-view .bottom-footer .code-box .code-line.current{
    color: #5e4eff;
}
</style>
