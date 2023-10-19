<template>
    <div class="simulation-view">
        <div id="world" class="simulation-box"></div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, nextTick} from "vue";
import * as icons from "@element-plus/icons";
import Simulation from "../../../package/simulation";
export default defineComponent({
    name: "SimulationConsole",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onSimulation(){
            if(!(window as any).simulation){
                (window as any).simulation = new Simulation((message: any)=>{
                    console.log(message);
                });
                (window as any).simulation.InitEngine();
                (window as any).simulation.onloadCode("/static/gcode/test.gcode");
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {
            nextTick(()=>{
                onSimulation();
            });
        });

        onBeforeUnmount(() => {
            if((window as any).simulation){
                (window as any).simulation.onEngineDestroy();
                (window as any).simulation = false;
            }
        });

        onUnmounted(() => {});

        return {
            props,
            icons
        }
    }
});
</script>

<style scoped>
.simulation-view{
    width: 100%;
    height: 100%;
    position: relative;
}
.simulation-view .simulation-box{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}
.simulation-view .simulation-box:deep(canvas){
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(30, 31, 34, 1);
}
</style>
