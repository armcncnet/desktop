<template>
    <div class="update-view">
        <div class="update-main">
            <el-form class="cnc" :model="props.cnc.settings" label-width="120px">
                <el-form-item label="ARMCNC">
                    <div class="update-item">
                        <div class="item">
                            <el-icon class="is-loading" v-if="props.cnc.settings.update.loading"><Loading /></el-icon>
                            <el-icon color="#5e4eff" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.armcnc !== '-'"><SuccessFilled /></el-icon>
                            <el-icon color="#E6A23C" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.armcnc === '-'"><WarningFilled /></el-icon>
                        </div>
                        <div class="item">{{props.cnc.settings.update.armcnc}}</div>
                        <div class="item"></div>
                    </div>
                </el-form-item>
                <el-form-item label="Python SDK">
                    <div class="update-item">
                        <div class="item">
                            <el-icon class="is-loading" v-if="props.cnc.settings.update.loading"><Loading /></el-icon>
                            <el-icon color="#5e4eff" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.sdk !== '-'"><SuccessFilled /></el-icon>
                            <el-icon color="#E6A23C" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.sdk === '-'"><WarningFilled /></el-icon>
                        </div>
                        <div class="item">{{props.cnc.settings.update.sdk}}</div>
                        <div class="item"></div>
                    </div>
                </el-form-item>
                <el-form-item label="LinuxCNC">
                    <div class="update-item">
                        <div class="item">
                            <el-icon class="is-loading" v-if="props.cnc.settings.update.loading"><Loading /></el-icon>
                            <el-icon color="#5e4eff" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.linuxcnc !== '-'"><SuccessFilled /></el-icon>
                            <el-icon color="#E6A23C" v-if="!props.cnc.settings.update.loading && props.cnc.settings.update.linuxcnc === '-'"><WarningFilled /></el-icon>
                        </div>
                        <div class="item">{{props.cnc.settings.update.linuxcnc}}</div>
                        <div class="item"></div>
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
export default defineComponent({
    name: "UpdateSettings",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onCheck(){
            props.cnc.settings.update.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/version/check", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.settings.update.loading = false;
                        props.cnc.settings.update.armcnc = response.data.armcnc;
                        props.cnc.settings.update.linuxcnc = response.data.linuxcnc;
                        props.cnc.settings.update.sdk = response.data.sdk;
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
            icons
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
</style>
