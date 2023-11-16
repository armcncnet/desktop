<template>
    <div class="wheel-view">
        <div class="wheel-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="是否开启">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.user.HandWheel.Status">
                            <el-radio-button label="NO">否</el-radio-button>
                            <el-radio-button label="YES">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="X轴速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.HandWheel.XVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Y轴速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.HandWheel.YVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Z轴速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.HandWheel.ZVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="A轴速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.HandWheel.AVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="B轴速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.HandWheel.BVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="C轴速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.HandWheel.CVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
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
export default defineComponent({
    name: "WheelMachine",
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
.wheel-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.wheel-view .wheel-box{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
}
.wheel-view .wheel-box .box-item{
    width: 100%;
    padding: 30px 20px;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 20px;
    border-radius: 4px;
}
</style>
