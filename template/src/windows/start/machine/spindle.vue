<template>
    <div class="joint-view">
        <div class="joint-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="最大转速">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Spindle0.MaxForwardVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小转速">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Spindle0.MinForwardVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大倍率">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MaxSpindleOverride" style="width: 100px">
                            <template #append>
                                <span>%</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小倍率">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MinSpindleOverride" style="width: 100px">
                            <template #append>
                                <span>%</span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "SpindleMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

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
.joint-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.joint-view .joint-box{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
}
.joint-view .joint-box .box-item{
    width: 100%;
    padding: 30px 20px;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 20px;
    border-radius: 4px;
}
.joint-view .joint-box .box-item .title{
    color: #999999;
    margin-bottom: 20px;
}
</style>
