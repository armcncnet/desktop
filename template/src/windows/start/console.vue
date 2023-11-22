<template>
    <DeviceConsole ref="deviceConsole" :cnc="props.cnc" v-if="!props.cnc.device.message.status && props.cnc.navigation.select === 'console'" />
    <div class="console-view" :class="props.cnc.navigation.select" v-else>
        <div class="console-item">
            <div class="console-main-item">
                <SimulationConsole ref="simulationConsole" :cnc="props.cnc" />
            </div>
            <div class="console-main-item">
                <BottomConsole ref="bottomConsole" :cnc="props.cnc" />
            </div>
        </div>
        <div class="console-item">
            <RightConsole ref="rightConsole" :cnc="props.cnc" />
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import DeviceConsole from "./console/device.vue";
import SimulationConsole from "./console/simulation.vue";
import BottomConsole from "./console/bottom.vue";
import RightConsole from "./console/right.vue";
export default defineComponent({
    name: "ConsoleStart",
    emits: [],
    props: ["cnc"],
    components: {
        DeviceConsole,
        SimulationConsole,
        BottomConsole,
        RightConsole
    },
    setup(props, context) {

        onBeforeMount(() => {});

        onMounted(() => {

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
.console-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    z-index: 100;
    display: none;
}
.console-view.console{
    display: block;
}
.console-view .console-item{
    width: calc(100% - 400px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.console-view .console-item:last-child{
    width: 400px;
    padding: 10px;
    background-color: rgba(43, 45, 48, 1);
    border-left: solid 1px rgba(30, 31, 34, 1);
    overflow-y: auto;
}
.console-view .console-item .console-main-item{
    width: 100%;
    height: calc(100% - 240px);
}
.console-view .console-item .console-main-item:last-child{
    height: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-top: solid 1px rgba(30, 31, 34, .8);
}
</style>
