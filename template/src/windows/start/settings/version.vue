<template>
    <div class="update-view">
        <div class="update-main">
            <el-form class="cnc" :model="props.cnc.settings" label-width="120px">
                <el-form-item label="ARMCNC">
                    <div class="update-item">
                        <div class="item">
                            <el-icon class="is-loading" v-if="props.cnc.settings.update.loading"><Loading /></el-icon>
                            <el-icon color="#5e4eff" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.armcnc !== '-' && props.cnc.settings.update.armcnc === props.cnc.settings.update.armcnc_version"><SuccessFilled /></el-icon>
                            <el-icon color="#E6A23C" v-if="(!props.cnc.settings.update.loading && props.cnc.settings.update.armcnc === '-') || (!props.cnc.settings.update.loading && props.cnc.settings.update.armcnc !== props.cnc.settings.update.armcnc_version)"><WarningFilled /></el-icon>
                        </div>
                        <div class="item">{{props.cnc.settings.update.armcnc}}</div>
                        <div class="item"></div>
                    </div>
                </el-form-item>
                <el-form-item label="Python SDK">
                    <div class="update-item">
                        <div class="item">
                            <el-icon class="is-loading" v-if="props.cnc.settings.update.loading"><Loading /></el-icon>
                            <el-icon color="#5e4eff" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.sdk !== '-' && props.cnc.settings.update.sdk === props.cnc.settings.update.sdk_version"><SuccessFilled /></el-icon>
                            <el-icon color="#E6A23C" v-if="(!props.cnc.settings.update.loading && props.cnc.settings.update.sdk === '-') || (!props.cnc.settings.update.loading && props.cnc.settings.update.sdk !== props.cnc.settings.update.sdk_version)"><WarningFilled /></el-icon>
                        </div>
                        <div class="item">{{props.cnc.settings.update.sdk}}</div>
                        <div class="item"></div>
                    </div>
                </el-form-item>
                <el-form-item label="LinuxCNC">
                    <div class="update-item">
                        <div class="item">
                            <el-icon class="is-loading" v-if="props.cnc.settings.update.loading"><Loading /></el-icon>
                            <el-icon color="#5e4eff" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.linuxcnc !== '-' && props.cnc.settings.update.linuxcnc === props.cnc.settings.update.linuxcnc_version"><SuccessFilled /></el-icon>
                            <el-icon color="#E6A23C" v-if="(!props.cnc.settings.update.loading && props.cnc.settings.update.linuxcnc === '-') || (!props.cnc.settings.update.loading && props.cnc.settings.update.linuxcnc !== props.cnc.settings.update.linuxcnc_version)"><WarningFilled /></el-icon>
                        </div>
                        <div class="item">{{props.cnc.settings.update.linuxcnc}}</div>
                        <div class="item"></div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="update-main" v-if="(!props.cnc.settings.update.loading) && (props.cnc.settings.update.sdk !== props.cnc.settings.update.sdk_version || props.cnc.settings.update.armcnc !== props.cnc.settings.update.armcnc_version)">
            <el-form class="cnc" :model="props.cnc.settings" label-width="120px">
                <el-form-item label="升级指南">
                    <div class="tips">通过SSH登录到设备后执行下面的脚本即可完成升级</div>
                </el-form-item>
                <el-form-item label="升级脚本">
                    <div class="shell-box">
                        <span>sudo apt -y update && sudo apt install -y armcnc</span>
                        <span @click="onCopy('sudo apt -y update && sudo apt install -y armcnc')">
                            <el-icon><DocumentCopy /></el-icon>
                        </span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, nextTick} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
import Network from "../../../package/network/network";
export default defineComponent({
    name: "VersionSettings",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onCheck(){
            props.cnc.settings.update.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/settings/version/check", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.settings.update.loading = false;
                        props.cnc.settings.update.armcnc = response.data.armcnc;
                        props.cnc.settings.update.linuxcnc = response.data.linuxcnc;
                        props.cnc.settings.update.sdk = response.data.sdk;
                        props.cnc.settings.update.armcnc_version = response.data.armcnc;
                        props.cnc.settings.update.linuxcnc_version = response.data.linuxcnc;
                        props.cnc.settings.update.sdk_version = response.data.sdk;
                        let product = [
                            {name: "armcnc", version: response.data.armcnc},
                            {name: "armcnc_sdk", version: response.data.sdk}
                        ];
                        Network.status(()=>{
                            (window as any).go.StartWindows.Api.ServiceRequest("/version/batch", "POST", {product: product}, "").then((service: any)=>{
                                if(service.code === 0){
                                    if(service.data && service.data.product){
                                        service.data.product.forEach((item: any)=>{
                                            if(item.name === "armcnc"){
                                                props.cnc.settings.update.armcnc_version = item.version;
                                            }
                                            if(item.name === "armcnc_sdk"){
                                                props.cnc.settings.update.sdk_version = item.version;
                                            }
                                        });
                                    }else{
                                        props.cnc.settings.update.loading = false;
                                        ElMessage.closeAll();
                                        ElMessage({
                                            message: "云服务请求失败，请重新尝试",
                                            type: "warning",
                                            customClass: "cnc"
                                        });
                                    }
                                }else{
                                    props.cnc.settings.update.loading = false;
                                    ElMessage.closeAll();
                                    ElMessage({
                                        message: "云服务请求失败，请重新尝试",
                                        type: "warning",
                                        customClass: "cnc"
                                    });
                                }
                            });
                        },()=>{
                            props.cnc.settings.update.loading = false;
                        });
                    }else{
                        props.cnc.settings.update.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "服务请求失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                }else{
                    props.cnc.settings.update.loading = false;
                    ElMessage.closeAll();
                    ElMessage({
                        message: "服务请求失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        function onCopy(text: string){
            (window as any).runtime.ClipboardSetText(text).then((status: any)=>{
                if(status){
                    ElMessage.closeAll();
                    ElMessage({
                        message: "已复制到剪贴板",
                        type: "success",
                        customClass: "cnc"
                    });
                }else{
                    ElMessage.closeAll();
                    ElMessage({
                        message: "复制失败，请重新尝试",
                        type: "warning",
                        customClass: "cnc"
                    });
                }
            });
        }

        onBeforeMount(() => {});

        onMounted(() => {
            nextTick(()=>{
                onCheck();
            });
        });

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onCopy
        }
    }
});
</script>

<style scoped>
.update-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.update-view .update-main{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
    background-color: rgba(43, 45, 48, .3);
    border-radius: 4px;
    padding: 30px 20px;
}
.update-view .update-main{
    margin-bottom: 20px;
}
.update-view .update-main .update-item{
    width: auto;
    height: 38px;
    line-height: 38px;
    font-size: 12px;
    color: #666666;
}
.update-view .update-main .update-item .item{
    width: auto;
    height: 38px;
    line-height: 38px;
    display: inline-block;
    vertical-align: top;
    padding: 0 5px;
}
.update-view .update-main .update-item .item:first-child{
    width: 24px;
    line-height: 42px;
    text-align: center;
}
.update-view .update-main .shell-box{
    height: 36px;
    background-color: rgba(30, 31, 34, 1);
    box-shadow: none;
    border: 1px solid rgba(59, 60, 61, .9);
    border-radius: 4px;
    font-size: 12px;
    color: #999999;
    position: relative;
}
.update-view .update-main .shell-box span:first-child{
    padding: 0 10px;
}
.update-view .update-main .shell-box span:last-child{
    width: 40px;
    height: 34px;
    line-height: 36px;
    display: inline-block;
    vertical-align: top;
    border-left: 1px solid rgba(59, 60, 61, .9);
    text-align: center;
}
.update-view .update-main .shell-box span:last-child:hover{
    cursor: pointer;
    color: #ffffff;
}
</style>
