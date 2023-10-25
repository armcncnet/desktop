<template>
    <div class="right-view">
        <div class="right-axes">
            <el-table class="cnc" :data="props.cnc.console.right.axes" stripe style="width: 100%">
                <el-table-column label="轴" width="50">
                    <template #default="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="坐标(mm)">
                    <template #default="scope">{{scope.row.value.toFixed(2)}}</template>
                </el-table-column>
                <el-table-column label="回零" width="80">
                    <template #default="scope">
                        <el-icon><LocationFilled /></el-icon>
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
                    <div class="value">{{props.cnc.console.right.coordinate.value === "" ? "当前坐标系" : props.cnc.console.right.coordinate.value}}</div>
                    <div class="icon"><el-icon><ArrowDown /></el-icon></div>
                </div>
            </div>
            <div class="right-tools-item">
                <el-button class="cnc" type="danger" :icon="icons.Rank" >全部回零</el-button>
            </div>
            <div class="right-tools-item">
                <el-button class="cnc" type="danger" :icon="icons.MapLocation" >重置零点</el-button>
            </div>
        </div>
        <div class="right-step">
            <div class="title">步宽(mm)</div>
            <div class="box">
                <el-row :gutter="5">
                    <el-col :span="4"><div class="step">12</div></el-col>
                </el-row>
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

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            setCoordinate
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
.right-view .right-axes{
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
    margin-bottom: 5px;
}
.right-view .right-step .box{
    width: 100%;
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
</style>
