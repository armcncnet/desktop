<template>
    <div class="joint-view">
        <div class="joint-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="轴关节">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Traj.Coordinates" style="width: 150px" maxlength="5" show-word-limit @change="onChangeJoint"/>
                    </el-form-item>
                    <el-form-item label="最大进给倍率">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.MaxFeedOverride" style="width: 100px">
                            <template #append>
                                <span>%</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="默认速度">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.DefaultLinearVelocity" style="width: 160px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小速度">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.MinLinearVelocity" style="width: 160px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大速度">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.MaxLinearVelocity" style="width: 160px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="默认转速">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.DefaultAngularVelocity" style="width: 160px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小转速">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.MinAngularVelocity" style="width: 160px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大转速">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.MaxAngularVelocity" style="width: 160px">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="box-item" v-for="(item, index) in props.cnc.machine.item.joints" :key="index">
                <div class="title">{{item}} 轴关节配置</div>
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="类型">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini['Joint' + index].Type">
                            <el-radio-button label="LINEAR">直线</el-radio-button>
                            <el-radio-button label="ANGULAR">旋转</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="脉冲数">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Scale" style="width: 180px">
                            <template #append>
                                <span>per/{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小限位">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MinLimit" style="width: 180px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大限位">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MaxLimit" style="width: 180px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MaxVelocity" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="零位">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Home" style="width: 100px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="回零顺序">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeSequence" style="width: 60px"></el-input>
                    </el-form-item>
                    <el-form-item label="回零开关">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini['Joint' + index].HomeIgnoreLimits">
                            <el-radio-button label="NO">否</el-radio-button>
                            <el-radio-button label="YES">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="零位偏移量">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeOffset" style="width: 120px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="回零搜索速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeSearchVel" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="达到锁存速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeLarchVel" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="到达零位速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeFinalVel" style="width: 150px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="背隙补偿">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Backlash" style="width: 120px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大加速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MaxAcceleration" style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/s²</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="步进加速度限制">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].StepgenMaxaccel" style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/s²</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大跟随误差">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Ferror" style="width: 140px">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="编码器索引脉冲">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini['Joint' + index].HomeUseIndex">
                            <el-radio-button label="NO">否</el-radio-button>
                            <el-radio-button label="YES">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="保存位置信息">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini['Joint' + index].VolatileHome">
                            <el-radio-button label="0">否</el-radio-button>
                            <el-radio-button label="1">是</el-radio-button>
                        </el-radio-group>
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
    name: "JointMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        function onChangeJoint(value: string){
            props.cnc.machine.item.joints = value.split("");
            props.cnc.machine.item.ini.Kins.Joints = props.cnc.machine.item.joints.length + "";
            if(props.cnc.machine.item.joints.length !== 5){
                props.cnc.machine.item.ini.Kins.Kinematics = "trivkins coordinates=" + value.toLowerCase();
            }else{
                props.cnc.machine.item.ini.Kins.Kinematics = value.toLowerCase() + "-trt-kins sparm=identityfirst";
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onChangeJoint
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
