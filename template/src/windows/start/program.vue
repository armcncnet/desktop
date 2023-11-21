<template>
    <div class="program-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-header">
                <div class="item-header-item">
                    <el-input class="cnc none" v-model="props.cnc.program.search_keyword" placeholder="请输入关键词" maxlength="140" autocomplete="off" spellcheck="false" clearable />
                </div>
                <div class="item-header-item">
                    <el-tooltip popper-class="cnc" effect="dark" content="创建程序" placement="bottom">
                        <el-button class="cnc" :icon="icons.Plus" @click="newProgram"></el-button>
                    </el-tooltip>
                </div>
            </div>
            <div class="item-footer">
                <div class="item-footer-box" v-if="!props.cnc.program.loading">
                    <div class="program-item" :class="props.cnc.program.item && props.cnc.program.item.path === item.path ? 'select' : ''" v-for="(item, index) in props.cnc.program.items" :key="index" v-if="props.cnc.program.items.length > 0" @click="onSelect(item)">
                        <div class="title">{{item.name}}</div>
                        <div class="describe">{{item.describe}}</div>
                    </div>
                    <el-empty class="cnc none" :image-size="30" v-else/>
                </div>
                <div class="loading-view" v-else>
                    <el-icon class="is-loading"><Loading /></el-icon>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="loading-view" v-if="props.cnc.program.tab.loading">
                <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <el-empty class="cnc none" :image-size="30" v-if="!props.cnc.program.item && !props.cnc.program.tab.loading"/>
            <div class="program-box" v-if="!props.cnc.program.tab.loading && props.cnc.program.item">
                <el-tabs v-model="props.cnc.program.tab.value" type="card" class="cnc">
                    <el-tab-pane class="cnc" :closable="item.close" v-for="(item, index) in props.cnc.program.tab.items" :key="index" :label="item.name" :name="item.id">
                        <CodeProgram ref="codeProgram" :cnc="props.cnc" :item="item"/>
                    </el-tab-pane>
                </el-tabs>
                <div class="program-button">
                    <el-tooltip popper-class="cnc" effect="dark" content="下载程序" placement="top" v-if="props.cnc.program.item.path !== ''">
                        <el-button class="info" type="primary" :icon="icons.Download" @click="onDownloadProgram" circle v-if="!props.cnc.program.download_loading"></el-button>
                        <el-button class="info" type="primary" circle v-else>
                            <el-icon class="is-loading"><Loading /></el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-button class="info" type="primary" :icon="icons.Delete" @click="onDeleteProgram" circle v-if="!props.cnc.program.item.is_default && props.cnc.program.item.path !== ''"></el-button>
                    <el-button color="#5e4eff" type="primary" :loading="props.cnc.program.update_loading" @click="onUpdateProgram">保存程序</el-button>
                </div>
            </div>
        </div>
    </div>
    <NewProgramDialog ref="newProgramDialog" :cnc="props.cnc" v-if="props.cnc.dialog.config.type === 'new_program'"/>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage, ElMessageBox} from "element-plus";
import NewProgramDialog from "../common/dialog/new_program.vue";
import CodeProgram from "./program/code.vue";
export default defineComponent({
    name: "ProgramStart",
    emits: [],
    props: ["cnc"],
    components: {
        NewProgramDialog,
        CodeProgram,
    },
    setup(props, context) {

        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_program"){
                onCloseSelect();
                onData();
            }
        });

        function onData(){
            props.cnc.program.items = [];
            props.cnc.program.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/program/select", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.program.items = response.data.code;
                        props.cnc.program.loading = false;
                    }else{
                        props.cnc.program.loading = false;
                    }
                }else{
                    props.cnc.program.loading = false;
                }
            });
        }

        function newProgram(){
            props.cnc.dialog.config.type = "new_program";
            props.cnc.dialog.config.title = "新增程序";
            props.cnc.dialog.config.width = "350px";
            props.cnc.dialog.config.close = true;
            props.cnc.dialog.form = {
                upload_loading: false,
                new_callback: ()=>{
                    onCloseSelect();
                    props.cnc.program.item = false;
                    setTimeout(()=>{
                        props.cnc.program.item = {name: "新程序", describe: "程序描述", version: "1.0.0"};
                        props.cnc.program.item.content = "(" + JSON.stringify(props.cnc.program.item) + ")";
                        props.cnc.program.item.line = [];
                        props.cnc.program.item.path = "";
                        props.cnc.program.tab.items = [];
                        let tabs = [
                            {name: props.cnc.program.item.name, id: "new"}
                        ];
                        props.cnc.program.tab.items.push(...tabs);
                        props.cnc.program.tab.value = "new";
                    }, 200);
                }
            }
            props.cnc.dialog.status = true;
        }

        function onSelect(item: any){
            if(props.cnc.program.item && props.cnc.program.item.path === item.path || props.cnc.program.tab.loading){
                return;
            }
            props.cnc.program.tab.loading = true;
            props.cnc.program.item = item;
            props.cnc.program.tab.items = [];
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/program/read/content", "GET", {file_name: item.path}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.program.item = JSON.parse(JSON.stringify(item));
                        props.cnc.program.item.content = response.data.content;
                        props.cnc.program.item.is_default = response.data.is_default;
                        let tabs = [
                            {name: props.cnc.program.item.name, id: props.cnc.program.item.path}
                        ];
                        props.cnc.program.tab.items.push(...tabs);
                        props.cnc.program.tab.value = props.cnc.program.item.path;
                        props.cnc.program.tab.loading = false;
                        props.cnc.program.update_loading = false;
                        props.cnc.program.download_loading = false;
                    }else{
                        props.cnc.program.tab.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "请求失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    props.cnc.program.tab.loading = false;
                    ElMessage.closeAll();
                    ElMessage({
                        message: "请求失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function onDownloadProgram(){
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/program/download", "GET", {file_name: props.cnc.program.item.path}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.program.download_loading = true;
                        (window as any).go.StartWindows.Api.SaveFile("保存文件", response.data.file).then((path: string)=>{
                            if(path !== ""){
                                (window as any).go.StartWindows.Api.DownloadFile(props.cnc.device.ip + ":" + props.cnc.device.message.port + "/programs/" + response.data.file, path).then((status: string)=>{
                                    if(status){
                                        props.cnc.program.download_loading = false;
                                        ElMessage.closeAll();
                                        ElMessage({
                                            message: "下载完成",
                                            type: "success",
                                            customClass: "cnc"
                                        });
                                    }else{
                                        props.cnc.program.download_loading = false;
                                        ElMessage.closeAll();
                                        ElMessage({
                                            message: "下载失败，请重新尝试",
                                            type: "warning",
                                            customClass: "cnc"
                                        });
                                    }
                                });
                            }else{
                                props.cnc.program.download_loading = false;
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "下载失败，请重新尝试",
                                    type: "warning",
                                    customClass: "cnc"
                                });
                            }
                        });
                    }else{
                        props.cnc.program.download_loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "下载失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    props.cnc.program.download_loading = false;
                    ElMessage.closeAll();
                    ElMessage({
                        message: "下载失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function onDeleteProgram(){
            ElMessageBox.confirm("是否确认删除程序？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/program/delete", "GET", {file_name: props.cnc.program.item.path}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            onCloseSelect();
                            (window as any).runtime.EventsEmit("event_page", {type: "page_program"});
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

        const codeProgram = ref(null);
        function onUpdateProgram(){
            if(!props.cnc.program.update_loading){
                if((codeProgram as any).value){
                    props.cnc.program.update_loading = true;
                    (codeProgram as any).value[0].onSaveProgram();
                }
            }
        }

        function onCloseSelect(){
            props.cnc.program.tab.items = [];
            props.cnc.program.tab.value = "";
            props.cnc.program.tab.loading = false;
            props.cnc.program.update_loading = false;
            props.cnc.program.download_loading = false;
            props.cnc.program.item = false;
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            codeProgram,
            newProgram,
            onSelect,
            onDownloadProgram,
            onDeleteProgram,
            onUpdateProgram
        }
    }
});
</script>

<style scoped>
.program-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.program-view.program{
    display: block;
}
.program-view .item{
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.program-view .item:first-child{
    width: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-right: solid 1px rgba(30, 31, 34, 1);
}
.program-view .item .item-header{
    width: 100%;
    height: 40px;
    background-color: rgba(43, 45, 48, .5);
    border-bottom: solid 1px rgba(30, 31, 34, 1);
    padding: 5px;
}
.program-view .item .item-header .item-header-item{
    width: calc(100% - 40px);
    height: 30px;
    display: inline-block;
    vertical-align: top;
}
.program-view .item .item-header .item-header-item:first-child{
    padding-right: 5px;
}
.program-view .item .item-header .item-header-item:last-child{
    width: 40px;
}
.program-view .item .item-footer{
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 5px;
}
.program-view .item .item-footer .item-footer-box{
    width: 100%;
}
.program-view .item .item-footer .item-footer-box .program-item{
    width: 100%;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
}
.program-view .item .item-footer .item-footer-box .program-item:hover{
    cursor: pointer;
}
.program-view .item .item-footer .item-footer-box .program-item.select{
    background-color: rgba(43, 45, 48, 1);
}
.program-view .item .item-footer .item-footer-box .program-item .title{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.program-view .item .item-footer .item-footer-box .program-item:hover .title{
    color: #ffffff;
}
.program-view .item .item-footer .item-footer-box .program-item.select .title{
    color: #ffffff;
}
.program-view .item .item-footer .item-footer-box .program-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.program-view .program-box{
    width: 100%;
    height: 100%;
    position: relative;
}
.program-view .program-box .program-button{
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
.program-view .program-box .program-button{
    padding-right: 60px;
}
</style>
