<template>
    <div class="tool-view">
        <div class="tool-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="换刀方式">
                        <el-radio-group class="cnc max">
                            <el-radio-button label="MANUAL">手动</el-radio-button>
                            <el-radio-button label="AUTO">自动</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="box-item">
                <div class="title">对刀台配置</div>
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="对刀台高度">
                        <el-input class="cnc"  style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="X轴位置">
                        <el-input class="cnc"  style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Y轴位置">
                        <el-input class="cnc"  style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Z轴位置">
                        <el-input class="cnc"  style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大搜索距离">
                        <el-input class="cnc"  style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="二次搜索距离">
                        <el-input class="cnc"  style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="搜索速度">
                        <el-input class="cnc"  style="width: 180px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="二次搜索速度">
                        <el-input class="cnc"  style="width: 180px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <div class="title">刀袋配置</div>
                </el-form>
            </div>
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <div class="title">刀具配置</div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "ToolMachine",
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
.tool-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.tool-view .tool-box{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
}
.tool-view .tool-box .box-item{
    width: 100%;
    padding: 30px 20px;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 20px;
    border-radius: 4px;
}
.tool-view .tool-box .box-item .title{
    color: #999999;
    margin-bottom: 20px;
}
</style>
