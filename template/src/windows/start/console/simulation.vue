<template>
    <div class="simulation-view">
        <div id="world" class="simulation-box"></div>
        <div class="dro-view">
            <div class="dro-group">
                <div class="dro-line">X 长度: <span>121.050</span></div>
                <div class="dro-line">Y 长度: <span>1.05</span></div>
                <div class="dro-line">Z 最大值: <span>-312.000</span></div>
                <div class="dro-line">Z 最小值: <span>5.00</span></div>
                <div class="dro-line">预计时长: <span>10分钟</span></div>
                <div class="dro-line">剩余时长: <span>10分钟</span></div>
            </div>
            <div class="dro-group">
                <div class="dro-line">速度: <span>0</span></div>
                <div class="dro-line">X 速度: <span>0</span></div>
                <div class="dro-line">Y 速度: <span>0</span></div>
                <div class="dro-line">Z 速度: <span>0</span></div>
                <div class="dro-line">B 速度: <span>0</span></div>
                <div class="dro-line">C 速度: <span>0</span></div>
            </div>
            <div class="dro-group">
                <div class="dro-line">G92 X: <span>0</span></div>
                <div class="dro-line">G92 Y: <span>0</span></div>
                <div class="dro-line">G92 Z: <span>0</span></div>
                <div class="dro-line">G92 B: <span>0</span></div>
                <div class="dro-line">G92 C: <span>0</span></div>
            </div>
            <div class="dro-group">
                <div class="dro-line">G53 X: <span>-100.000</span></div>
                <div class="dro-line">G53 Y: <span>0</span></div>
                <div class="dro-line">G53 Z: <span>0</span></div>
                <div class="dro-line">G53 B: <span>0</span></div>
                <div class="dro-line">G53 C: <span>0</span></div>
            </div>
            <div class="dro-group">
                <div class="dro-line">G53 X: <span>0</span></div>
                <div class="dro-line">G53 Y: <span>0</span></div>
                <div class="dro-line">G53 Z: <span>0</span></div>
                <div class="dro-line">G53 B: <span>0</span></div>
                <div class="dro-line">G53 C: <span>0</span></div>
            </div>
            <div class="dro-group">
                <div class="dro-line">刀具号: <span>0</span></div>
                <div class="dro-line">刀具直径: <span>0</span></div>
                <div class="dro-line">偏移量: <span>0</span></div>
            </div>
        </div>
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
.simulation-view .dro-view{
    width: auto;
    left: 10px;
    bottom: 10px;
    position: absolute;
    z-index: 2;
    font-size: 11px;
}
.simulation-view .dro-view .dro-group{
    width: 90px;
    display: inline-block;
    vertical-align: bottom;
    margin-right: 10px;
}
.simulation-view .dro-view .dro-group:first-child{
    width: 120px;
}
.simulation-view .dro-view .dro-group .dro-line{
    line-height: 18px;
    color: #666666;
}
.simulation-view .dro-view .dro-group .dro-line span{
    color: #999999;
}
</style>
