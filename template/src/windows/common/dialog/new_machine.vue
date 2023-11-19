<template>
    <el-dialog class="cnc" v-model="props.cnc.dialog.status" :title="props.cnc.dialog.config.title" :width="props.cnc.dialog.config.width" draggable :modal="true" title="" :show-close="props.cnc.dialog.config.close" :before-close="dialogClose" :lock-scroll="true" :closeOnClickModal="false" :closeOnPressEscape="false" :destroy-on-close="true">
        <div class="new-machine-dialog">
            <div class="item">
                <div class="box" @click="onUpdateZip" v-if="!props.cnc.dialog.form.upload_loading">上传ZIP文件</div>
                <div class="box" v-else>
                    <div class="loading-view" style="height: 60px;line-height: 64px">
                        <el-icon class="is-loading" style="padding: 0;"><Loading /></el-icon>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="box" @click="onNewMachine">手动配置</div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "NewMachineDialog",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onUpdateZip(){
            (window as any).go.StartWindows.Api.OpenFile("选择文件", "Zip Files (*.zip)", "*.zip").then((file: string)=>{
                if(file !== ""){
                    props.cnc.dialog.form.upload_loading = true;
                    (window as any).go.StartWindows.Api.DeviceUpload(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/upload", "POST", file).then((response: any)=>{
                        if(response.code === 0){
                            if(response.data){
                                dialogClose(false);
                                (window as any).runtime.EventsEmit("event_page", {type: "page_machine"});
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "上传成功",
                                    type: "success",
                                    customClass: "cnc"
                                });
                            }else{
                                props.cnc.dialog.form.upload_loading = false;
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "上传失败，请重新尝试",
                                    type: "warning",
                                    customClass: "cnc"
                                });
                            }
                        }else{
                            props.cnc.dialog.form.upload_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "上传失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    });
                }
            });
        }

        function onNewMachine(){
            if(props.cnc.dialog.form.new_callback){
                dialogClose(false);
                props.cnc.dialog.form.new_callback();
            }
        }

        function dialogClose(close: any){
            if(close){
                close();
            }
            props.cnc.dialog.status = false;
            setTimeout(()=>{
                props.cnc.dialog.config.type = "";
                props.cnc.dialog.form = false;
            }, 20);
        }

        onMounted(() => {});

        onBeforeUnmount(() => {});

        return {
            props,
            onUpdateZip,
            onNewMachine,
            dialogClose
        }
    }
});
</script>

<style scoped>
.new-machine-dialog{
    width: 100%;
    padding: 20px;
}
.new-machine-dialog .item{
    width: 50%;
    height: 60px;
    font-size: 12px;
    display: inline-block;
    vertical-align: top;
    padding: 0 10px;
}
.new-machine-dialog .item .box{
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: rgba(30, 31, 34, 1);
    border-radius: 4px;
    text-align: center;
}
.new-machine-dialog .item:hover .box{
    cursor: pointer;
    color: #999999;
}
</style>