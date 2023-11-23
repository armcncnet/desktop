<template>
    <div class="base-view">
        <div class="base-box">
            <div class="box-item">
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="控制类型">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.user.Base.Control">
                            <el-radio-button label="0">仿真模拟</el-radio-button>
                            <el-radio-button label="1">GPIO</el-radio-button>
                            <el-radio-button label="3">MACH3</el-radio-button>
                            <el-radio-button label="4">EtherCAT</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input class="cnc" v-model="props.cnc.machine.item.user.Base.Name" style="width: 300px" maxlength="12" show-word-limit @focus="setBaseName(props.cnc.machine.item.user.Base.Name)"/>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input class="cnc" v-model="props.cnc.machine.item.user.Base.Describe" style="width: 400px" maxlength="30" show-word-limit @focus="setBaseDescribe(props.cnc.machine.item.user.Base.Describe)"/>
                    </el-form-item>
                    <el-form-item label="单位">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini.Traj.LinearUnits">
                            <el-radio-button label="mm">mm</el-radio-button>
                            <el-radio-button label="inch">inch</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="步长选项">
                        <el-input class="cnc" v-model="props.cnc.machine.item.ini.Display.Increments" style="width: 500px" @focus="setDisplayIncrements(props.cnc.machine.item.ini.Display.Increments)"/>
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
    name: "BaseMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        function setBaseName(value: any){
            if(props.cnc.layer.string){
                props.cnc.layer.string = false;
            }
            props.cnc.layer.string = {
                value: value,
                set: value,
                capslock: false,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Base.Name = value;
                }
            }
        }

        function setBaseDescribe(value: any){
            if(props.cnc.layer.string){
                props.cnc.layer.string = false;
            }
            props.cnc.layer.string = {
                value: value,
                set: value,
                capslock: false,
                callback: (value: any)=>{
                    props.cnc.machine.item.user.Base.Describe = value;
                }
            }
        }

        function setDisplayIncrements(value: any){
            if(props.cnc.layer.string){
                props.cnc.layer.string = false;
            }
            props.cnc.layer.string = {
                value: value,
                set: value,
                capslock: false,
                callback: (value: any)=>{
                    props.cnc.machine.item.ini.Display.Increments = value;
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
            setBaseName,
            setBaseDescribe,
            setDisplayIncrements
        }
    }
});
</script>

<style scoped>
.base-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.base-view .base-box{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
}
.base-view .base-box .box-item{
    width: 100%;
    padding: 30px 20px;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 20px;
    border-radius: 4px;
}
.base-view .base-box .box-item .title{
    color: #999999;
    margin-bottom: 20px;
}
</style>
