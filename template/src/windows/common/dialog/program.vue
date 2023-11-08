<template>
    <el-dialog class="cnc" v-model="props.cnc.dialog.status" :title="props.cnc.dialog.config.title" :width="props.cnc.dialog.config.width" draggable :modal="true" title="" :show-close="props.cnc.dialog.config.close" :before-close="dialogClose" :lock-scroll="true" :closeOnClickModal="false" :closeOnPressEscape="false" :destroy-on-close="true">
        <div class="program-dialog">
            <div class="loading-view" v-if="props.cnc.dialog.form.loading">
                <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <div class="program-view" v-else>
                <div class="program-box" v-if="props.cnc.dialog.form.items.length > 0">
                    <div class="program-item" :class="props.cnc.device.machine.file === item.path ? 'current' : ''" v-for="(item, index) in props.cnc.dialog.form.items" :key="index" @click="onSelect(item)">
                        <div class="name">{{item.name}}</div>
                        <div class="describe">{{item.describe}}</div>
                        <div class="program-loading" v-if="item.loading">
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
export default defineComponent({
    name: "ProgramDialog",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        (window as any).runtime.EventsOn("dialog_close", (message: any) => {
            if(props.cnc.dialog.config.type === "program"){
                dialogClose(false);
            }
        });

        function onSelect(item: any){
            if(item.path !== props.cnc.device.machine.file && !props.cnc.dialog.form.item){
                props.cnc.dialog.form.item = item;
                props.cnc.dialog.form.item.loading = true;
                let message = {command: "desktop:program:open", data: item.path};
                props.cnc.device.message.socket.send(JSON.stringify(message));
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
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/code/select", "GET", {}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            props.cnc.dialog.form.items = response.data.code;
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
.program-dialog{
    width: 100%;
    height: 400px;
}
.program-dialog .program-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.program-dialog .program-view .program-box{
    width: 100%;
}
.program-dialog .program-view .program-box .program-item{
    width: 100%;
    font-size: 12px;
    padding: 10px;
    border-bottom: solid 1px rgba(30, 31, 34, .2);
    position: relative;
}
.program-dialog .program-view .program-box .program-item:hover{
    cursor: pointer;
    background-color: rgba(30, 31, 34, .2);
}
.program-dialog .program-view .program-box .program-item.current{
    background-color: rgba(30, 31, 34, .5);
}
.program-dialog .program-view .program-box .program-item .name{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.program-dialog .program-view .program-box .program-item:hover .name{
    color: #ffffff;
}
.program-dialog .program-view .program-box .program-item.current .name{
    color: #5e4eff;
}
.program-dialog .program-view .program-box .program-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.program-dialog .program-view .program-box .program-item .program-loading{
    width: 24px;
    height: 24px;
    line-height: 24px;
    position: absolute;
    top: 10px;
    right: 10px;
    text-align: center;
}
</style>