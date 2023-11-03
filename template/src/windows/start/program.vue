<template>
    <div class="program-view" :class="props.cnc.navigation.select">
        <el-empty class="cnc" description="program" :image-size="30" />
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "ProgramStart",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        // 消息事件
        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_program"){
                onData();
            }
        });

        function onData(){
            props.cnc.program.items = [];
            props.cnc.program.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/code/select", "GET", {}).then((response: any)=>{
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

        onBeforeMount(() => {});

        onMounted(() => {});

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
.program-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.program-view.program{
    display: block;
}
</style>
