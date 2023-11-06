<template>
    <el-dialog class="cnc" v-model="props.cnc.dialog.status" :title="props.cnc.dialog.config.title" :width="props.cnc.dialog.config.width" draggable :modal="true" title="" :show-close="props.cnc.dialog.config.close" :before-close="dialogClose" :lock-scroll="true" :closeOnClickModal="false" :closeOnPressEscape="false" :destroy-on-close="true">
        <div class="new-device-dialog">
            <el-form class="cnc" :model="props.cnc.dialog.form" label-width="80px">
                <el-form-item label="设备IP地址">
                    <el-input class="cnc" v-model="props.cnc.dialog.form.ip" placeholder="请输入设备的IP地址" maxlength="140" autocomplete="off" spellcheck="false" style="width: 200px" />
                </el-form-item>
                <el-form-item label="">
                    <el-button color="#5e4eff" :loading="props.cnc.dialog.form_loading" type="primary" @click="onDevice">连接设备</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted} from "vue";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "DeviceDialog",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onDevice(){
            if(props.cnc.dialog.form.ip === "" && (props.cnc.dialog.form.ip.replace(/\n|\r/g, "")).trim().length === 0){
                ElMessage.closeAll();
                ElMessage({
                    message: "设备IP地址错误",
                    type: "warning",
                    customClass: "cnc"
                });
                return;
            }
            props.cnc.dialog.form_loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.dialog.form.ip + ":" + props.cnc.device.message.port, "/config/index", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.device.ip = props.cnc.dialog.form.ip;
                        props.cnc.device.machine.path = response.data.machine;
                        if(props.cnc.device.ips.length > 0){
                            let check = false;
                            props.cnc.device.ips.forEach((item: any, index: any, array: any)=>{
                                if(item.ip === props.cnc.device.ip){
                                    check = true;
                                }
                            });
                            if(!check){
                                props.cnc.device.ips.push({name: response.data.name, ip: props.cnc.dialog.form.ip, version: response.data.version});
                                localStorage.setItem("cnc:device:ips", JSON.stringify(props.cnc.device.ips));
                            }
                        }else{
                            props.cnc.device.ips.push({name: response.data.name, ip: props.cnc.dialog.form.ip, version: response.data.version});
                            localStorage.setItem("cnc:device:ips", JSON.stringify(props.cnc.device.ips));
                        }
                        (window as any).runtime.EventsEmit("event_message", {type: "connected_device"});
                        dialogClose(false);
                    }else{
                        props.cnc.dialog.form_loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "设备连接失败，请检查后重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    props.cnc.dialog.form_loading = false;
                    ElMessage.closeAll();
                    ElMessage({
                        message: "设备连接失败，请检查后重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function dialogClose(close: any){
            if(close){
                close();
            }
            props.cnc.dialog.status = false;
            props.cnc.dialog.form.loading = false;
            setTimeout(()=>{
                props.cnc.dialog.config.type = "";
                props.cnc.dialog.form = {
                    loading: false
                };
            }, 20);
        }

        onMounted(() => {});

        onBeforeUnmount(() => {});

        return {
            props,
            onDevice,
            dialogClose
        }
    }
});
</script>

<style scoped>
.new-device-dialog{
    width: 100%;
    padding: 20px;
}
</style>