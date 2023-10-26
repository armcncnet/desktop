<template>
    <div class="right-view">
        <div class="right-axis">
            <el-table class="cnc" :data="props.cnc.console.right.axis" stripe style="width: 100%">
                <el-table-column label="轴" width="50">
                    <template #default="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="坐标(mm)">
                    <template #default="scope">{{scope.row.value.toFixed(2)}}</template>
                </el-table-column>
                <el-table-column label="回零" width="80">
                    <template #default="scope">
                        <el-icon @click="onHome(scope.row.index + '')"><LocationFilled /></el-icon>
                    </template>
                </el-table-column>
                <el-table-column label="零点偏移" width="80">
                    <template #default="scope">
                        <el-icon><MapLocation /></el-icon>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="right-tools">
            <div class="right-tools-item">
                <div class="el-cnc-select" ref="cncSelect" @click="setCoordinate">
                    <div class="value">{{props.cnc.console.right.coordinate.options[props.cnc.console.right.coordinate.value].label}}</div>
                    <div class="icon"><el-icon><ArrowDown /></el-icon></div>
                </div>
            </div>
            <div class="right-tools-item">
                <el-button class="cnc" :class="props.cnc.console.right.home" :disabled="props.cnc.console.right.home === ''" type="danger" :icon="icons.LocationFilled" @click="onHome('all')">全部回零</el-button>
            </div>
            <div class="right-tools-item">
                <el-button class="cnc" :class="props.cnc.console.right.zero" :disabled="props.cnc.console.right.zero === ''" type="danger" :icon="icons.MapLocation" >重置零点</el-button>
            </div>
        </div>
        <div class="right-step">
            <div class="title">步进长度(mm)</div>
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
                    <el-col :span="6">
                        <div class="channel"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'y+')" @mouseup="handleRockerUp($event, 'y+')">
                            <div class="icon">
                                <el-icon><ArrowUp /></el-icon>
                            </div>
                            <div class="name">Y</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'z+')" @mouseup="handleRockerUp($event, 'z+')">
                            <div class="icon">
                                <el-icon><ArrowUp /></el-icon>
                            </div>
                            <div class="name">Z</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'x-')" @mouseup="handleRockerUp($event, 'x-')">
                            <div class="icon">
                                <el-icon><ArrowLeft /></el-icon>
                            </div>
                            <div class="name">X</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'y-')" @mouseup="handleRockerUp($event, 'y-')">
                            <div class="icon">
                                <el-icon><ArrowDown /></el-icon>
                            </div>
                            <div class="name">Y</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'x+')" @mouseup="handleRockerUp($event, 'x+')">
                            <div class="icon">
                                <el-icon><ArrowRight /></el-icon>
                            </div>
                            <div class="name">X</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'z-')" @mouseup="handleRockerUp($event, 'z-')">
                            <div class="icon">
                                <el-icon><ArrowDown /></el-icon>
                            </div>
                            <div class="name">Z</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'b-')" @mouseup="handleRockerUp($event, 'b-')">
                            <div class="icon">
                                <el-icon><ArrowLeft /></el-icon>
                            </div>
                            <div class="name">B</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'b+')" @mouseup="handleRockerUp($event, 'b+')">
                            <div class="icon">
                                <el-icon><ArrowRight /></el-icon>
                            </div>
                            <div class="name">B</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'c-')" @mouseup="handleRockerUp($event, 'c-')">
                            <div class="icon">
                                <el-icon><ArrowLeft /></el-icon>
                            </div>
                            <div class="name">C</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="channel" @mousedown="handleRockerDown($event, 'c+')" @mouseup="handleRockerUp($event, 'c+')">
                            <div class="icon">
                                <el-icon><ArrowRight /></el-icon>
                            </div>
                            <div class="name">C</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="right-configure">
            <div class="configure-group">
                <div class="group-title">主轴转速(degree/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input">0</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">主轴转速倍率(%)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input">0</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">主轴进给倍率(%)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input">0</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-configure">
            <div class="configure-group">
                <div class="group-title">点动速度(mm/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input">0</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">最大速度(mm/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input">0</div>
                    </div>
                </div>
            </div>
            <div class="configure-group">
                <div class="group-title">点动转速(degree/min)</div>
                <div class="group-slider">
                    <div class="slider-item">
                        <el-slider class="cnc" size="small" :show-input-controls="false" />
                    </div>
                    <div class="slider-item">
                        <div class="el-cnc-input">0</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {Bottom} from "@element-plus/icons-vue";
export default defineComponent({
    name: "RightConsole",
    emits: [],
    props: ["cnc"],
    components: {
        Bottom
    },
    setup(props, context) {

        function setCoordinate(){
            if(props.cnc.layer.select){
                props.cnc.layer.select = false;
            }else{
                props.cnc.layer.select = {
                    value: props.cnc.console.right.coordinate.value,
                    options: props.cnc.console.right.coordinate.options,
                    callback: (value: any)=>{
                        props.cnc.console.right.coordinate.value = value;
                    }
                }
            }
        }

        function onHome(axis: string){
            let message = {command: "desktop:control:device:home", data: axis}
            props.cnc.device.message.socket.send(JSON.stringify(message));
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
                    speed = 240;
                }else{
                    speed = 1200;
                }
                if(direction === "-"){
                    speed = 0 - speed;
                }

                let message = {command: "desktop:control:jog:start", data: {axis: axis, speed: speed, increment: increment}}
                props.cnc.device.message.socket.send(JSON.stringify(message));
            }
        }

        function handleRockerUp(event: any, value: string){
            let axis = value.substr(0,1);
            let message = {command: "desktop:control:jog:stop", data: {axis: axis}}
            props.cnc.device.message.socket.send(JSON.stringify(message));
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            setCoordinate,
            onHome,
            setStep,
            handleRockerDown,
            handleRockerUp
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
.right-view .right-rocker .rocker-box :deep(.el-col):nth-child(1) .channel{
    display: none;
}
.right-view .right-rocker .rocker-box :deep(.el-col):nth-child(3) .channel{
    display: none;
}
.right-view .right-configure{
    width: 100%;
    background-color: rgba(30, 31, 34, .2);
    margin-bottom: 10px;
    padding: 10px;
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
