<template>
    <div class="right-view">
        <div class="right-axis">
            <el-table class="cnc" empty-text="没有相关数据" :data="props.cnc.console.right.axes" stripe style="width: 100%">
                <el-table-column label="轴" width="50">
                    <template #default="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="坐标(mm)">
                    <template #default="scope">{{scope.row.position.toFixed(3)}}</template>
                </el-table-column>
                <el-table-column label="回零" width="80">
                    <template #default="scope">
                        <el-icon :class="scope.row.home === 1 ? 'homed' : ''" @click="onHome(scope.row.index + '')"><LocationFilled /></el-icon>
                    </template>
                </el-table-column>
                <el-table-column label="原点偏移" width="100">
                    <template #default="scope">
                        <div class="el-cnc-input" @click="setAxesOffset(parseFloat(props.cnc.console.left.simulation.g5x_offset[scope.row.index]).toFixed(3), scope.row.index)">{{parseFloat(props.cnc.console.left.simulation.g5x_offset[scope.row.index]).toFixed(3)}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="right-tools" v-if="props.cnc.device.machine.info">
            <div class="right-tools-item">
                <el-button class="cnc" :class="props.cnc.console.right.home" :disabled="props.cnc.console.right.home === 'disabled'" type="warning" :icon="icons.LocationFilled" @click="onHome('all')">全部回零</el-button>
            </div>
            <div class="right-tools-item">
                <div class="el-cnc-select" ref="cncSelect" @click="setOffset">
                    <div class="value">{{props.cnc.console.right.offset.options[props.cnc.console.right.offset.index - 1].label}}</div>
                    <div class="icon"><el-icon><ArrowDown /></el-icon></div>
                </div>
            </div>
            <div class="right-tools-item">
                <el-button class="cnc" :class="props.cnc.console.right.relative_offset" :disabled="props.cnc.console.right.relative_offset === 'disabled' || !props.cnc.console.right.homed" type="warning" :icon="icons.MapLocation" @click="setRelativeOffset('all')">设置原点</el-button>
            </div>
        </div>
        <div class="right-step">
            <div class="title">步进长度({{props.cnc.device.machine.linear_units}})</div>
            <div class="box">
                <el-row :gutter="5">
                    <el-col :span="4" v-for="(item, index) in props.cnc.console.right.step.items" :key="index">
                        <div class="step" :class="props.cnc.console.right.step.value === item.value ? 'select' : ''" @click="setStep(item)">{{item.label}}</div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="right-rocker">
            <div class="rocker-box">
                <el-row :gutter="5">
                    <el-col :span="6" v-for="(item, index) in props.cnc.console.right.rocker" :key="index">
                        <div class="channel" :class="item.hide ? 'hide' : ''" @mousedown="handleRockerDown($event, item.value)" @mouseup="handleRockerUp($event, item.value)">
                            <div class="icon">
                                <el-icon v-if="item.arrow === 'up'"><ArrowUp /></el-icon>
                                <el-icon v-if="item.arrow === 'down'"><ArrowDown /></el-icon>
                                <el-icon v-if="item.arrow === 'left'"><ArrowLeft /></el-icon>
                                <el-icon v-if="item.arrow === 'right'"><ArrowRight /></el-icon>
                            </div>
                            <div class="name">{{item.name}}</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="right-configure">
            <div class="configure-tools">
                <div class="configure-tools-item">
                    <el-button class="cnc" type="primary" :class="props.cnc.console.right.spindle.direction === -1 ? 'active' : ''" :disabled="props.cnc.header.right.enabled === 'disabled'" :icon="icons.DArrowLeft" @click="setSpindleRight">反转</el-button>
                </div>
                <div class="configure-tools-item">
                    <el-button class="cnc" type="primary" :class="props.cnc.console.right.spindle.enabled === 1 ? 'active' : ''" :disabled="props.cnc.header.right.enabled === 'disabled'" :icon="icons.TurnOff" @click="setSpindleEnabled">启动主轴</el-button>
                </div>
                <div class="configure-tools-item">
                    <el-button class="cnc" type="primary" :class="props.cnc.console.right.spindle.direction === 1 ? 'active' : ''" :disabled="props.cnc.header.right.enabled === 'disabled'" :icon="icons.DArrowRight" @click="setSpindleLeft">正转</el-button>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">主轴转速({{props.cnc.device.machine.angular_units}}/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" v-model="props.cnc.console.right.spindle.velocity" :step="100" :min="props.cnc.console.right.spindle.min_velocity" :max="props.cnc.console.right.spindle.max_velocity" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input" @click="updateSpindleVelocity(props.cnc.console.right.spindle.velocity, props.cnc.console.right.spindle.min_velocity, props.cnc.console.right.spindle.max_velocity)">{{props.cnc.console.right.spindle.velocity}}</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">主轴转速倍率(%)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" v-model="props.cnc.console.right.spindle.override" :step="1" :min="props.cnc.console.right.spindle.min_override" :max="props.cnc.console.right.spindle.max_override" :show-input-controls="false" @change="setSpindleOverride"/>
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input" @click="updateSpindleOverride(props.cnc.console.right.spindle.override, props.cnc.console.right.spindle.min_override, props.cnc.console.right.spindle.max_override)">{{props.cnc.console.right.spindle.override}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-configure">
            <div class="configure-group">
                <div class="group-title">最大速度({{props.cnc.device.machine.linear_units}}/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" v-model="props.cnc.console.right.max_velocity" :step="1" :min="0" :max="props.cnc.console.right.max_linear_velocity" :show-input-controls="false" @change="setMaxVelocity" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input" @click="updateMaxVelocity(props.cnc.console.right.max_velocity, 0, props.cnc.console.right.max_linear_velocity)">{{props.cnc.console.right.max_velocity}}</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">进给倍率(%)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" v-model="props.cnc.console.right.feed.override" :step="1" :min="0" :max="props.cnc.console.right.feed.max_override" :show-input-controls="false" @change="setFeedRate"/>
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input" @click="updateFeedOverride(props.cnc.console.right.feed.override, 0, props.cnc.console.right.feed.max_override)">{{props.cnc.console.right.feed.override}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-configure">
            <div class="configure-group">
                <div class="group-title">点动速度({{props.cnc.device.machine.linear_units}}/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" v-model="props.cnc.console.right.default_linear_velocity" :step="1" :min="0" :max="props.cnc.console.right.max_linear_velocity" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input" @click="updateDefaultLinearVelocity(props.cnc.console.right.default_linear_velocity, 0, props.cnc.console.right.max_linear_velocity)">{{props.cnc.console.right.default_linear_velocity}}</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">点动转速({{props.cnc.device.machine.angular_units}}/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" v-model="props.cnc.console.right.default_angular_velocity" :step="1" :min="0" :max="props.cnc.console.right.max_angular_velocity" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input" @click="updateDefaultAngularVelocity(props.cnc.console.right.default_angular_velocity, 0, props.cnc.console.right.max_angular_velocity)">{{props.cnc.console.right.default_angular_velocity}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {ArrowRight, Bottom} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
export default defineComponent({
    name: "RightConsole",
    emits: [],
    props: ["cnc"],
    components: {
        ArrowRight,
        Bottom
    },
    setup(props, context) {

        function setAxesOffset(data: any, index: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: data,
                set: data,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.left.simulation.g5x_offset[index] = value;
                    setRelativeOffset("");
                }
            }
        }

        function setOffset(){
            if(props.cnc.layer.select){
                props.cnc.layer.select = false;
            }
            props.cnc.layer.select = {
                value: props.cnc.console.right.offset.index,
                options: props.cnc.console.right.offset.options,
                callback: (value: any)=>{
                    let message: any = {command: "desktop:control:set:offset", data: {name: ""}};
                    message.data.name = props.cnc.console.right.offset.options[value - 1].name;
                    props.cnc.device.message.socket.send(JSON.stringify(message));
                    props.cnc.console.right.offset.index = value;
                }
            }
        }

        function onHome(axis: string){
            if (props.cnc.device.machine.info.task_state !== 4 || props.cnc.device.machine.info.state === 2) {
                return;
            }
            ElMessageBox.confirm("是否确认全部回零？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                let message = {command: "desktop:control:device:home", data: axis};
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }).catch(() => {});
        }

        function setRelativeOffset(current: string){
            if (props.cnc.device.machine.info.task_state !== 4 || props.cnc.device.machine.info.state === 2 || !props.cnc.device.machine.info.user_data.is_homed) {
                return;
            }
            if(current === "all"){
                ElMessageBox.confirm("是否确认设置原点？", "操作确认", {
                    draggable: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning",
                    customClass: "cnc"
                }).then(() => {
                    let message: any = {command: "desktop:control:relative:offset", data: {name: "", x: 0.000, y: 0.000, z: 0.000}};
                    message.data.name = props.cnc.console.right.offset.options[props.cnc.console.right.offset.index - 1].p_name;
                    message.data.x = parseFloat("0.000").toFixed(3);
                    message.data.y = parseFloat("0.000").toFixed(3);
                    message.data.z = parseFloat("0.000").toFixed(3);
                    props.cnc.device.message.socket.send(JSON.stringify(message));
                }).catch(() => {});
            }else{
                let message: any = {command: "desktop:control:relative:offset", data: {name: "", x: 0.000, y: 0.000, z: 0.000}};
                message.data.name = props.cnc.console.right.offset.options[props.cnc.console.right.offset.index - 1].p_name;
                message.data.x = "-" + parseFloat(props.cnc.console.left.simulation.g5x_offset[0]).toFixed(3);
                message.data.y = "-" + parseFloat(props.cnc.console.left.simulation.g5x_offset[1]).toFixed(3);
                message.data.z = "-" + parseFloat(props.cnc.console.left.simulation.g5x_offset[2]).toFixed(3);
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }
        }

        function setStep(item: any){
            if(props.cnc.console.right.step !== item.value){
                props.cnc.console.right.step.value = item.value;
            }
        }

        function handleRockerDown(event: any, value: string){
            if(props.cnc.header.right.enabled === "active"){
                let axis = value.substr(0,1);
                let direction = value.substr(1,1);
                let speed = 0;
                let increment = props.cnc.console.right.step.value;
                if(["a", "b", "c"].includes(axis)){
                    speed = props.cnc.console.right.default_angular_velocity;
                }else{
                    speed = props.cnc.console.right.default_linear_velocity;
                }
                if(direction === "-"){
                    speed = 0 - speed;
                }
                let message = {command: "desktop:control:jog:start", data: {axis: axis, speed: speed, increment: increment}};
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }
        }

        function handleRockerUp(event: any, value: string) {
            if(props.cnc.header.right.enabled === "active"){
                let axis = value.substr(0, 1);
                let increment = props.cnc.console.right.step.value;
                if (increment === -1) {
                    let message = {command: "desktop:control:jog:stop", data: {axis: axis}};
                    props.cnc.device.message.socket.send(JSON.stringify(message));
                }
            }
        }

        function setSpindleRight(){
            if(props.cnc.header.right.enabled === "active") {
                let message = {command: "desktop:control:spindle", data: {value: 2}};
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }
        }

        function setSpindleEnabled(){
            if(props.cnc.header.right.enabled === "active") {
                if(props.cnc.console.right.spindle.enabled === 0){
                    let message = {command: "desktop:control:spindle", data: {value: 1}};
                    props.cnc.device.message.socket.send(JSON.stringify(message));
                }else{
                    let message = {command: "desktop:control:spindle", data: {value: 5}};
                    props.cnc.device.message.socket.send(JSON.stringify(message));
                }
            }
        }

        function setSpindleLeft(){
            if(props.cnc.header.right.enabled === "active") {
                let message = {command: "desktop:control:spindle", data: {value: 1}};
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }
        }

        function setSpindleOverride(value: any){
            if(props.cnc.header.right.enabled === "active") {
                let message = {command: "desktop:control:spindle:override", data: {value: value}};
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }
        }

        function setMaxVelocity(value: any){
            let message = {command: "desktop:control:max:velocity", data: {value: value}};
            props.cnc.device.message.socket.send(JSON.stringify(message));
        }

        function setFeedRate(value: any){
            let message = {command: "desktop:control:feed:rate", data: {value: value}};
            props.cnc.device.message.socket.send(JSON.stringify(message));
        }

        function updateSpindleVelocity(value: any, min: any, max:any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                min: min,
                max: max,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.right.spindle.velocity = parseInt(value);
                }
            }
        }

        function updateSpindleOverride(value: any, min: any, max:any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                min: min,
                max: max,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.right.spindle.override = parseInt(value);
                    setSpindleOverride(props.cnc.console.right.spindle.override);
                }
            }
        }

        function updateMaxVelocity(value: any, min: any, max:any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                min: min,
                max: max,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.right.max_velocity = parseInt(value);
                    setMaxVelocity(props.cnc.console.right.spindle.override);
                }
            }
        }

        function updateFeedOverride(value: any, min: any, max:any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                min: min,
                max: max,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.right.feed.override = parseInt(value);
                    setFeedRate(props.cnc.console.right.feed.override);
                }
            }
        }

        function updateDefaultLinearVelocity(value: any, min: any, max:any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                min: min,
                max: max,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.right.default_linear_velocity = parseInt(value);;
                }
            }
        }

        function updateDefaultAngularVelocity(value: any, min: any, max:any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                min: min,
                max: max,
                first: true,
                callback: (value: any)=>{
                    props.cnc.console.right.default_angular_velocity = parseInt(value);
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
            setAxesOffset,
            setOffset,
            onHome,
            setRelativeOffset,
            setStep,
            handleRockerDown,
            handleRockerUp,
            setSpindleRight,
            setSpindleEnabled,
            setSpindleLeft,
            setSpindleOverride,
            setMaxVelocity,
            setFeedRate,
            updateSpindleVelocity,
            updateSpindleOverride,
            updateMaxVelocity,
            updateFeedOverride,
            updateDefaultLinearVelocity,
            updateDefaultAngularVelocity
        }
    }
});
</script>

<style scoped>
.right-view{
    width: 100%;
    min-height: 100%;
}
.right-view .right-tools{
    width: 100%;
    margin-bottom: 10px;
    background-color: rgba(30, 31, 34, .3);
    border-radius: 4px;
    padding: 10px;
}
.right-view .right-tools .right-tools-item{
    width: 33.33%;
    display: inline-block;
    vertical-align: top;
    text-align: center;
}
.right-view .right-axis{
    width: 100%;
    margin-bottom: 10px;
}

.right-view .right-axis .el-icon.homed{
    color: #5e4eff;
}
.right-view .right-step{
    width: 100%;
    margin-bottom: 10px;
    background-color: rgba(30, 31, 34, .3);
    border-radius: 4px;
    padding: 10px;
}
.right-view .right-step .title{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    margin-bottom: 10px;
}
.right-view .right-step .box{
    width: 100%;
}
.right-view .right-step .box:deep(.el-col){
    margin-bottom: 5px;
}
.right-view .right-step .box .step{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgba(30, 31, 34, .5);
    border-radius: 4px;
    color: #999999;
}
.right-view .right-step .box .step:hover{
    cursor: pointer;
    color: #ffffff;
}
.right-view .right-step .box .step.select{
    color: #ffffff;
    border-bottom: 4px solid #5e4eff;
}
.right-view .right-rocker{
    width: 100%;
    padding-top: 10px;
    margin-bottom: 10px;
}
.right-view .right-rocker .rocker-box{
    width: 300px;
    margin: 0 auto;
}
.right-view .right-rocker .rocker-box:deep(.el-col){
    height: 50px;
    margin-bottom: 5px;
}
.right-view .right-rocker .rocker-box .channel{
    width: 100%;
    height: 50px;
    text-align: center;
    background-color: rgba(30, 31, 34, .5);
    border-radius: 4px;
    color: #666666;
    padding: 10px;
}
.right-view .right-rocker .rocker-box .channel .icon{
    width: 100%;
    height: 15px;
    line-height: 15px;
}
.right-view .right-rocker .rocker-box .channel .name{
    width: 100%;
    height: 15px;
    line-height: 15px;
}
.right-view .right-rocker .rocker-box .channel:hover{
    color: #ffffff;
    cursor: pointer;
    background-color: rgba(30, 31, 34, .8);
}
.right-view .right-rocker .rocker-box .channel:hover .icon{
    color: #5e4eff;
}
.right-view .right-rocker .rocker-box .channel:active{
    color: #ffffff;
    cursor: pointer;
    box-shadow: inset 0 0 2px 3px rgba(0, 0, 0, .2);
    background-color: rgba(30, 31, 34, .8);
    border: 1px solid rgba(0, 0, 0, .5);
}
.right-view .right-rocker .rocker-box .channel:active .icon{
    color: #5e4eff;
}
.right-view .right-rocker .rocker-box :deep(.el-col):nth-child(1) .channel{
    display: none;
}
.right-view .right-rocker .rocker-box :deep(.el-col):nth-child(3) .channel{
    display: none;
}
.right-view .right-rocker .rocker-box .channel.hide{
    display: none;
}
.right-view .right-configure{
    width: 100%;
    background-color: rgba(30, 31, 34, .2);
    margin-bottom: 10px;
    padding: 10px;
}
.right-view .right-configure .configure-tools{
    width: 100%;
    height: 30px;
    text-align: center;
    margin: 10px 0;
}
.right-view .right-configure .configure-tools .configure-tools-item{
    width: 33.33%;
    height: 30px;
    display: inline-block;
    vertical-align: top;
    padding: 0 10px;
}
.right-view .right-configure .configure-group{
    width: 100%;
    padding: 5px 0;
}
.right-view .right-configure .configure-group .group-title{
    width: 100%;
    height: 24px;
    color: #666666;
}
.right-view .right-configure .configure-group .group-slider{
    width: 100%;
    height: 30px;
    padding: 0 5px;
}
.right-view .right-configure .configure-group .group-slider .slider-item{
    width: calc(100% - 60px);
    display: inline-block;
    vertical-align: middle;
}
.right-view .right-configure .configure-group .group-slider .slider-item:first-child{
    padding-right: 10px;
}
.right-view .right-configure .configure-group .group-slider .slider-item:last-child{
    width: 60px;
}
</style>
