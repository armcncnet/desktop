<template>
    <el-dialog class="cnc" v-model="props.cnc.dialog.status" :title="props.cnc.dialog.config.title" :width="props.cnc.dialog.config.width" draggable :modal="true" title="" :show-close="props.cnc.dialog.config.close" :before-close="dialogClose" :lock-scroll="true" :closeOnClickModal="false" :closeOnPressEscape="false" :destroy-on-close="true">
        <div class="machine-dialog">
            <div class="loading-view" v-if="props.cnc.dialog.form.loading">
                <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <div class="machine-view" v-else>
                <div class="machine-box" v-if="props.cnc.dialog.form.items.length > 0">
                    <div class="machine-item" :class="props.cnc.device.machine.path === item.path ? 'current' : ''" v-for="(item, index) in props.cnc.dialog.form.items" :key="index" @click="onSelect(item)">
                        <div class="name">{{item.name}}</div>
                        <div class="describe">{{item.describe}}</div>
                        <div class="machine-loading" v-if="item.loading">
                            <el-icon class="is-loading"><Loading /></el-icon>
                        </div>
                    </div>
                </div>
                <el-empty class="cnc none" :image-size="30" v-else/>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, nextTick, onBeforeUnmount, onMounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "MachineDialog",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onSelect(item: any){
            if(item.path !== props.cnc.device.machine.path && !props.cnc.dialog.form.item){
                props.cnc.dialog.form.item = item;
                props.cnc.dialog.form.item.loading = true;
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/set", "GET", {path: item.path}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            props.cnc.device.machine.path = item.path;
                            props.cnc.dialog.form.item.loading = false;
                            dialogClose(false);
                        }else{
                            props.cnc.dialog.form.item.loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "机床配置设置失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        props.cnc.dialog.form.item.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "机床配置设置失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
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

        onMounted(() => {
            nextTick(()=>{
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/select", "GET", {}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            props.cnc.dialog.form.items = response.data.machine;
                            props.cnc.dialog.form.loading = false;
                        }else{
                            props.cnc.dialog.form.loading = false;
                        }
                    }else{
                        props.cnc.dialog.form.loading = false;
                    }
                });
            });
        });

        onBeforeUnmount(() => {});

        return {
            props,
            onSelect,
            dialogClose
        }
    }
});
</script>

<style scoped>
.machine-dialog{
    width: 100%;
    height: 400px;
}
.machine-dialog .machine-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.machine-dialog .machine-view .machine-box{
    width: 100%;
}
.machine-dialog .machine-view .machine-box .machine-item{
    width: 100%;
    font-size: 12px;
    padding: 10px;
    border-bottom: solid 1px rgba(30, 31, 34, .2);
    position: relative;
}
.machine-dialog .machine-view .machine-box .machine-item:hover{
    cursor: pointer;
    background-color: rgba(30, 31, 34, .2);
}
.machine-dialog .machine-view .machine-box .machine-item.current{
    background-color: rgba(30, 31, 34, .5);
}
.machine-dialog .machine-view .machine-box .machine-item .name{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.machine-dialog .machine-view .machine-box .machine-item:hover .name{
    color: #ffffff;
}
.machine-dialog .machine-view .machine-box .machine-item.current .name{
    color: #5e4eff;
}
.machine-dialog .machine-view .machine-box .machine-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.machine-dialog .machine-view .machine-box .machine-item .machine-loading{
    width: 24px;
    height: 24px;
    line-height: 24px;
    position: absolute;
    top: 10px;
    right: 10px;
    text-align: center;
}
</style>