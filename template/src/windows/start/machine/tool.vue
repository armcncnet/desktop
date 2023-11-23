<template>
    <div class="tool-view">
        <div class="tool-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="换刀方式">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.user.Tool.Method">
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
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.ZHeight" style="width: 140px" @focus="setToolZHeight(props.cnc.machine.item.user.Tool.ZHeight)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="X轴位置">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.XPosition" style="width: 140px" @focus="setToolXPosition(props.cnc.machine.item.user.Tool.XPosition)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Y轴位置">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.YPosition" style="width: 140px" @focus="setToolYPosition(props.cnc.machine.item.user.Tool.YPosition)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Z轴位置">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.ZPosition" style="width: 140px" @focus="setToolZPosition(props.cnc.machine.item.user.Tool.ZPosition)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最大搜索距离">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.MaxSearchDistance" style="width: 140px" @focus="setToolMaxSearchDistance(props.cnc.machine.item.user.Tool.MaxSearchDistance)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="二次搜索距离">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.LatchSearchDistance" style="width: 140px" @focus="setToolLatchSearchDistance(props.cnc.machine.item.user.Tool.LatchSearchDistance)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="搜索速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.SearchVelocity" style="width: 180px" @focus="setToolSearchVelocity(props.cnc.machine.item.user.Tool.SearchVelocity)">
                            <template #append>
                                <span>{{props.cnc.device.machine.linear_units}}/min</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="二次搜索速度">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Tool.LatchSearchVelocity"  style="width: 180px" @focus="setToolLatchSearchVelocity(props.cnc.machine.item.user.Tool.LatchSearchVelocity)">
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
                    <div class="button">
                        <el-tooltip popper-class="cnc" effect="dark" content="添加刀袋" placement="bottom">
                            <el-button class="cnc" :icon="icons.Plus" @click="addPocket"></el-button>
                        </el-tooltip>
                    </div>
                    <div class="box">
                        <el-table class="cnc" empty-text="没有相关数据" :data="props.cnc.machine.item.user.Tool.Pockets" stripe style="width: 100%">
                            <el-table-column label="编号" width="100">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.id" @focus="setPocketId(scope.$index, scope.row.id)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="X轴坐标" width="150">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.x" @focus="setPocketX(scope.$index, scope.row.x)">
                                        <template #append>
                                            <span>{{props.cnc.device.machine.linear_units}}</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="Y轴坐标" width="150">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.y" @focus="setPocketY(scope.$index, scope.row.y)">
                                        <template #append>
                                            <span>{{props.cnc.device.machine.linear_units}}</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="Z轴坐标" width="150">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.z" @focus="setPocketZ(scope.$index, scope.row.z)">
                                        <template #append>
                                            <span>{{props.cnc.device.machine.linear_units}}</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="">
                                <template #default="scope">
                                    <el-button class="info" type="primary" :icon="icons.LocationFilled" @click="onSetPocket(scope.row)"></el-button>
                                    <el-button class="info" type="primary" :icon="icons.Delete" @click="onRemovePocket(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form>
            </div>
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <div class="title">刀具配置</div>
                    <div class="button">
                        <el-tooltip popper-class="cnc" effect="dark" content="添加刀具" placement="bottom">
                            <el-button class="cnc" :icon="icons.Plus" @click="addTool"></el-button>
                        </el-tooltip>
                    </div>
                    <div class="box">
                        <el-table class="cnc" empty-text="没有相关数据" :data="props.cnc.machine.item.table" stripe style="width: 100%">
                            <el-table-column label="编号" width="100">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.t" @focus="setTableT(scope.$index, scope.row.t)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="刀袋" width="100">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.p" @focus="setTableP(scope.$index, scope.row.p)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="直径" width="130">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.d" @focus="setTableD(scope.$index, scope.row.d)">
                                        <template #append>
                                            <span>mm</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="X轴偏移量" width="130">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.x" @focus="setTableX(scope.$index, scope.row.x)">
                                        <template #append>
                                            <span>{{props.cnc.device.machine.linear_units}}</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="Y轴偏移量" width="130">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.y" @focus="setTableY(scope.$index, scope.row.y)">
                                        <template #append>
                                            <span>{{props.cnc.device.machine.linear_units}}</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="Z轴偏移量" width="130">
                                <template #default="scope">
                                    <el-input class="cnc" :value="scope.row.z" @focus="setTableZ(scope.$index, scope.row.z)">
                                        <template #append>
                                            <span>{{props.cnc.device.machine.linear_units}}</span>
                                        </template>
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="">
                                <template #default="scope">
                                    <el-button class="info" type="primary" :icon="icons.Delete" @click="onRemoveTool(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessageBox} from "element-plus";
export default defineComponent({
    name: "ToolMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        function addPocket(){
            props.cnc.machine.item.user.Tool.Pockets.push(
                {
                    id: "P" + (props.cnc.machine.item.user.Tool.Pockets.length + 1),
                    x: "0.000",
                    y: "0.000",
                    z: "0.000",
                }
            );
        }

        function onSetPocket(pocket: any){
            ElMessageBox.confirm("是否确认将当前坐标设置为刀袋位置？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                props.cnc.console.right.axes.forEach((item: any, index: any)=>{
                    if(item.name === "X"){
                        pocket.x = item.position.toFixed(3);
                    }
                    if(item.name === "Y"){
                        pocket.y = item.position.toFixed(3);
                    }
                    if(item.name === "Z"){
                        pocket.z = item.position.toFixed(3);
                    }
                });
            }).catch(() => {});
        }

        function onRemovePocket(pocket: any){
            ElMessageBox.confirm("是否确认移除刀袋？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                props.cnc.machine.item.user.Tool.Pockets.forEach((item: any, index: any)=>{
                    if(item.id === pocket.id){
                        props.cnc.machine.item.user.Tool.Pockets.splice(index, 1);
                    }
                });
            }).catch(() => {});
        }

        function addTool() {
            props.cnc.machine.item.table.push(
                {
                    id: "" + (props.cnc.machine.item.table.length + 1),
                    t: "T0",
                    p: "P0",
                    d: "0.000",
                    x: "0.000",
                    y: "0.000",
                    z: "0.000",
                }
            );
        }

        function onRemoveTool(tool: any){
            ElMessageBox.confirm("是否确认移除刀具？", "操作确认", {
                draggable: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "cnc"
            }).then(() => {
                props.cnc.machine.item.table.forEach((item: any, index: any)=>{
                    if(item.id === tool.id){
                        props.cnc.machine.item.table.splice(index, 1);
                    }
                });
            }).catch(() => {});
        }

        function setToolZHeight(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.ZHeight = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolXPosition(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.XPosition = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolYPosition(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.YPosition = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolZPosition(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.ZPosition = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolMaxSearchDistance(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.MaxSearchDistance = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolLatchSearchDistance(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.LatchSearchDistance = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolSearchVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.SearchVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setToolLatchSearchVelocity(value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.LatchSearchVelocity = parseFloat(value).toFixed(3);
                }
            }
        }

        function setPocketId(index: any, value: any){

        }

        function setPocketX(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.Pockets[index].x = parseFloat(value).toFixed(3);
                }
            }
        }

        function setPocketY(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.Pockets[index].y = parseFloat(value).toFixed(3);
                }
            }
        }

        function setPocketZ(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Tool.Pockets[index].z = parseFloat(value).toFixed(3);
                }
            }
        }

        function setTableT(index: any, value: any){

        }

        function setTableP(index: any, value: any){

        }

        function setTableD(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.table[index].d = parseFloat(value).toFixed(3);
                }
            }
        }

        function setTableX(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.table[index].x = parseFloat(value).toFixed(3);
                }
            }
        }

        function setTableY(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.table[index].y = parseFloat(value).toFixed(3);
                }
            }
        }

        function setTableZ(index: any, value: any){
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            props.cnc.layer.number = {
                value: value,
                set: value,
                first: true,
                callback: (value: any)=>{
                    props.cnc.machine.item.table[index].z = parseFloat(value).toFixed(3);
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
            addPocket,
            onSetPocket,
            onRemovePocket,
            addTool,
            onRemoveTool,
            setToolZHeight,
            setToolXPosition,
            setToolYPosition,
            setToolZPosition,
            setToolMaxSearchDistance,
            setToolLatchSearchDistance,
            setToolSearchVelocity,
            setToolLatchSearchVelocity,
            setPocketId,
            setPocketX,
            setPocketY,
            setPocketZ,
            setTableT,
            setTableP,
            setTableD,
            setTableX,
            setTableY,
            setTableZ
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
    position: relative;
}
.tool-view .tool-box .box-item .title{
    color: #999999;
    margin-bottom: 20px;
}
.tool-view .tool-box .box-item .button{
    position: absolute;
    top: 24px;
    right: 20px;
}
</style>
