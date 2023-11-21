<template>
    <div class="backup-view">
        <div class="backup-main">
            <el-form class="cnc" :model="props.cnc.settings" label-width="120px">
                <el-form-item label="选择数据">
                    <el-radio-group class="cnc max" v-model="props.cnc.settings.backup.type">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="machine">机床配置</el-radio-button>
                        <el-radio-button label="program">程序</el-radio-button>
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
                <el-table-column label="备份时间" width="250">
                    <template #default="scope">{{scope.row.date}}</template>
                </el-table-column>
                <el-table-column label="">
                    <template #default="scope">

                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, nextTick} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
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
            onBackup
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
