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
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Base.Name" style="width: 300px" maxlength="12" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input class="cnc" :value="props.cnc.machine.item.user.Base.Describe" style="width: 400px" maxlength="40" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="步长可选项">
                        <el-input class="cnc" :value="props.cnc.machine.item.ini.Display.Increments" style="width: 500px"/>
                    </el-form-item>
                    <el-form-item label="单位">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.ini.Traj.LinearUnits">
                            <el-radio-button label="mm">mm</el-radio-button>
                            <el-radio-button label="inch">inch</el-radio-button>
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
    name: "BaseMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        function onUpdateUser(){
            if(!props.item.loading){
                if(props.cnc.machine.item.user.Base.Name === "" || (props.cnc.machine.item.user.Base.Name.replace(/\n|\r/g, "")).trim().length === 0){
                    return;
                }
                props.item.loading = true;
                props.cnc.machine.item.user.Base.Control = parseInt(props.cnc.machine.item.user.Base.Control);
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/update/user", "POST", {path: props.cnc.machine.item.path, user: props.cnc.machine.item.user}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            props.cnc.machine.items.forEach((item: any, index: any, array: any)=>{
                                if(item.path === props.cnc.machine.item.path){
                                    props.cnc.machine.items[index].name = props.cnc.machine.item.user.Base.Name;
                                    props.cnc.machine.items[index].describe = props.cnc.machine.item.user.Base.Describe;
                                    props.cnc.machine.items[index].control = props.cnc.machine.item.user.Base.Control;
                                }
                            });
                            props.item.loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存成功",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            props.item.loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        props.item.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "保存失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onUpdateUser
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
