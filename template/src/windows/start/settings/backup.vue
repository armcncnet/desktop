<template>
    <div class="backup-view">
        <div class="backup-main">
            <el-form class="cnc" :model="props.cnc.settings" label-width="120px">
                <el-form-item label="选择数据">
                    <el-radio-group class="cnc max" v-model="props.cnc.settings.backup.type">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="machine">机床配置</el-radio-button>
                        <el-radio-button label="program">G程序</el-radio-button>
                        <el-radio-button label="plugin">插件</el-radio-button>
                        <el-radio-button label="script">脚本</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                    <el-button color="#5e4eff" type="primary" :loading="props.cnc.settings.backup.loading" @click="onBackup">开始备份</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="backup-main">
            <el-table class="cnc" empty-text="没有相关数据" :data="props.cnc.settings.backup.items" stripe style="width: 100%">
                <el-table-column label="" width="5"></el-table-column>
                <el-table-column label="备份文件名" width="400">
                    <template #default="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="备份时间" width="200">
                    <template #default="scope">{{scope.row.date}}</template>
                </el-table-column>
                <el-table-column label="">
                    <template #default="scope">
                        <el-tooltip popper-class="cnc" effect="dark" content="恢复备份" placement="top">
                            <el-button class="info" type="primary" :icon="icons.RefreshLeft" @click="onRestore(scope.row)" v-if="!scope.row.restore_loading"></el-button>
                            <el-button class="info" type="primary" v-else>
                                <el-icon class="is-loading"><Loading /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip popper-class="cnc" effect="dark" content="下载备份" placement="top">
                            <el-button class="info" type="primary" :icon="icons.Download" @click="onDownload(scope.row)" v-if="!scope.row.download_loading"></el-button>
                            <el-button class="info" type="primary" v-else>
                                <el-icon class="is-loading"><Loading /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-button class="info" type="primary" :icon="icons.Delete" @click="onDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, nextTick} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage, ElMessageBox} from "element-plus";
export default defineComponent({
    name: "BackupSettings",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onData(){
            props.cnc.settings.backup.type = "all";
            props.cnc.settings.backup.items = [];
            props.cnc.settings.backup.loading = false;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/settings/backup/select", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.settings.backup.items = response.data.backup;
                    }else{
                        ElMessage.closeAll();
                        ElMessage({
                            message: "服务请求失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    ElMessage.closeAll();
                    ElMessage({
                        message: "服务请求失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function onBackup(){
            if(!props.cnc.settings.backup.loading){
                props.cnc.settings.backup.loading = true;
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/settings/backup/pack", "GET", {type: props.cnc.settings.backup.type}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            props.cnc.settings.backup.loading = false;
                            onData();
                            ElMessage.closeAll();
                            ElMessage({
                                message: "备份成功",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            props.cnc.settings.backup.loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "备份失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        props.cnc.settings.backup.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "备份失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
            }
        }

        function onRestore(item: any){
            ElMessageBox.confirm("恢复备份将覆盖当前的相关数据，是否继续？", "操作确认", {
                draggable: true,
                confirmButtonText: "继续",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                item.restore_loading = true;
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/settings/backup/restore", "GET", {file_name: item.path}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            item.restore_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "恢复完成",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            item.restore_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "恢复失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        item.restore_loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "恢复失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
            }).catch(() => {});
        }

        function onDownload(item: any){
            item.download_loading = true;
            (window as any).go.StartWindows.Api.SaveFile("保存文件", item.name).then((path: string)=>{
                if(path !== ""){
                    (window as any).go.StartWindows.Api.DownloadFile(props.cnc.device.ip + ":" + props.cnc.device.message.port + "/backup/" + item.name, path).then((status: string)=>{
                        if(status){
                            item.download_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "下载完成",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            item.download_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "下载失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    });
                }else{
                    item.download_loading = false;
                }
            });
        }

        function onDelete(item: any){
            ElMessageBox.confirm("是否确认删除备份？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/settings/backup/delete", "GET", {file_name: item.path}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            onData();
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

        onMounted(() => {
            nextTick(()=>{
                onData();
            });
        });

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onBackup,
            onRestore,
            onDownload,
            onDelete
        }
    }
});
</script>

<style scoped>
.backup-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.backup-view .backup-main{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
    background-color: rgba(43, 45, 48, .3);
    border-radius: 4px;
    padding: 30px 20px;
}
.backup-view .backup-main{
    margin-bottom: 20px;
}
</style>
