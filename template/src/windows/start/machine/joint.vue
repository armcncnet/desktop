<template>
    <div class="joint-view">
        <div class="joint-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="轴关节">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Traj.Coordinates" style="width: 150px" maxlength="5" show-word-limit @focus="setTrajCoordinates(props.cnc.machine.item.ini.Traj.Coordinates)"/>
                    </el-form-item>
                    <el-form-item label="最大进给倍率">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MaxFeedOverride" style="width: 100px" @focus="setDisplayMaxFeedOverride(props.cnc.machine.item.ini.Display.MaxFeedOverride)">
                            <template #append>
                                <span>%</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="默认速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.DefaultLinearVelocity" style="width: 160px" @focus="setDisplayDefaultLinearVelocity(props.cnc.machine.item.ini.Display.DefaultLinearVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MinLinearVelocity" style="width: 160px" @focus="setDisplayMinLinearVelocity(props.cnc.machine.item.ini.Display.MinLinearVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MaxLinearVelocity" style="width: 160px" @focus="setDisplayMaxLinearVelocity(props.cnc.machine.item.ini.Display.MaxLinearVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="默认转速">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.DefaultAngularVelocity" style="width: 160px" @focus="setDisplayDefaultAngularVelocity(props.cnc.machine.item.ini.Display.DefaultAngularVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小转速">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MinAngularVelocity" style="width: 160px" @focus="setDisplayMinAngularVelocity(props.cnc.machine.item.ini.Display.MinAngularVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.angular_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大转速">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.MaxAngularVelocity" style="width: 160px" @focus="setDisplayMaxAngularVelocity(props.cnc.machine.item.ini.Display.MaxAngularVelocity)">
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
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Scale" style="width: 180px" @focus="setJointScale(index, props.cnc.machine.item.ini['Joint' + index].Scale)">
                            <template #append>
                                <span>per/{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最小限位">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MinLimit" style="width: 180px" @focus="setJointMinLimit(index, props.cnc.machine.item.ini['Joint' + index].MinLimit)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大限位">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MaxLimit" style="width: 180px" @focus="setJointMaxLimit(index, props.cnc.machine.item.ini['Joint' + index].MaxLimit)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MaxVelocity" style="width: 150px" @focus="setJointMaxVelocity(index, props.cnc.machine.item.ini['Joint' + index].MaxVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="零位">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Home" style="width: 100px" @focus="setJointHome(index, props.cnc.machine.item.ini['Joint' + index].Home)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="回零顺序">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeSequence" style="width: 60px" @focus="setJointHomeSequence(index, props.cnc.machine.item.ini['Joint' + index].HomeSequence)"></el-input>
                    </el-form-item>
                    <el-form-item label="回零开关">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini['Joint' + index].HomeIgnoreLimits">
                            <el-radio-button label="NO">否</el-radio-button>
                            <el-radio-button label="YES">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="零位偏移量">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeOffset" style="width: 120px" @focus="setJointHomeOffset(index, props.cnc.machine.item.ini['Joint' + index].HomeOffset)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="回零搜索速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeSearchVel" style="width: 150px" @focus="setJointHomeSearchVel(index, props.cnc.machine.item.ini['Joint' + index].HomeSearchVel)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="达到锁存速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeLarchVel" style="width: 150px" @focus="setJointHomeLarchVel(index, props.cnc.machine.item.ini['Joint' + index].HomeLarchVel)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="到达零位速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].HomeFinalVel" style="width: 150px" @focus="setJointHomeFinalVel(index, props.cnc.machine.item.ini['Joint' + index].HomeFinalVel)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="背隙补偿">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Backlash" style="width: 120px" @focus="setJointBacklash(index, props.cnc.machine.item.ini['Joint' + index].Backlash)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大加速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].MaxAcceleration" style="width: 140px" @focus="setJointMaxAcceleration(index, props.cnc.machine.item.ini['Joint' + index].MaxAcceleration)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/s²</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="步进加速度限制">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].StepgenMaxaccel" style="width: 140px" @focus="setJointStepgenMaxaccel(index, props.cnc.machine.item.ini['Joint' + index].StepgenMaxaccel)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/s²</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大跟随误差">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini['Joint' + index].Ferror" style="width: 140px" @focus="setJointFerror(index, props.cnc.machine.item.ini['Joint' + index].Ferror)">
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
export default defineComponent({
    name: "JointMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        function setTrajCoordinates(value: any){
            if(props.cnc.layer.string){
                props.cnc.layer.string = false;
            }
            props.cnc.layer.string = {
                value: value,
                set: value,
                capslock: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Traj.Coordinates = value;
                    props.cnc.machine.item.joints = value.split("");
                    props.cnc.machine.item.ini.Kins.Joints = props.cnc.machine.item.joints.length + "";
                    if(props.cnc.machine.item.joints.length !== 5){
                        props.cnc.machine.item.ini.Kins.Kinematics = "trivkins coordinates=" + value.toLowerCase();
                    }else{
                        props.cnc.machine.item.ini.Kins.Kinematics = value.toLowerCase() + "-trt-kins sparm=identityfirst";
                    }
                }
            }
        }

        function setDisplayMaxFeedOverride(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.MaxFeedOverride = parseInt(value) + "";
                }
            }
        }

        function setDisplayDefaultLinearVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.DefaultLinearVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setDisplayMinLinearVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.MinLinearVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setDisplayMaxLinearVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.MaxLinearVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setDisplayDefaultAngularVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.DefaultAngularVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setDisplayMinAngularVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.MinAngularVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setDisplayMaxAngularVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.MaxAngularVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointScale(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].Scale = parseInt(value) + "";
                }
            }
        }

        function setJointMinLimit(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].MinLimit = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointMaxLimit(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].MaxLimit = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointMaxVelocity(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].MaxVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointHome(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].Home = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointHomeSequence(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].HomeSequence = parseInt(value) + "";
                }
            }
        }

        function setJointHomeOffset(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].HomeOffset = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointHomeSearchVel(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].HomeSearchVel = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointHomeLarchVel(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].HomeLarchVel = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointHomeFinalVel(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].HomeFinalVel = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointBacklash(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].Backlash = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointMaxAcceleration(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].MaxAcceleration = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointStepgenMaxaccel(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].StepgenMaxaccel = parseFloat(value).toFixed(3);
                }
            }
        }

        function setJointFerror(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini['Joint' + index].Ferror = parseFloat(value).toFixed(3);
                }
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            setTrajCoordinates,
            setDisplayMaxFeedOverride,
            setDisplayDefaultLinearVelocity,
            setDisplayMinLinearVelocity,
            setDisplayMaxLinearVelocity,
            setDisplayDefaultAngularVelocity,
            setDisplayMinAngularVelocity,
            setDisplayMaxAngularVelocity,
            setJointScale,
            setJointMinLimit,
            setJointMaxLimit,
            setJointMaxVelocity,
            setJointHome,
            setJointHomeSequence,
            setJointHomeOffset,
            setJointHomeSearchVel,
            setJointHomeLarchVel,
            setJointHomeFinalVel,
            setJointBacklash,
            setJointMaxAcceleration,
            setJointStepgenMaxaccel,
            setJointFerror
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
