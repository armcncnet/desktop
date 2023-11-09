<template>
    <div class="configuration-view">
        <div class="configuration-box">
            <div class="box-item">
                <div class="title">基础配置</div>
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="控制类型">
                        <el-radio-group class="cnc max" v-model="props.cnc.machine.item.control">
                            <el-radio-button label="0">仿真模拟</el-radio-button>
                            <el-radio-button label="1">GPIO</el-radio-button>
                            <el-radio-button label="3">MACH3</el-radio-button>
                            <el-radio-button label="4">EtherCAT</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input class="cnc" v-model="props.cnc.machine.item.name" style="width: 300px" maxlength="12" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input class="cnc" v-model="props.cnc.machine.item.describe" style="width: 400px" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item label="">
                        <el-button color="#5e4eff" :loading="props.cnc.machine.item.button_loading" type="primary" @click="onUpdate">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="box-item">
                <div class="title">配置源文件</div>
                <el-form class="cnc" :model="props.cnc.machine.item" label-width="120px">
                    <el-form-item label="源文件">

                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, nextTick} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "ConfigurationMachine",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onInit(){

        }

        function onUpdate(){
            if(!props.cnc.machine.item.button_loading){
                if(props.cnc.machine.item.name === "" || (props.cnc.machine.item.name.replace(/\n|\r/g, "")).trim().length === 0){
                    return;
                }
                let data = {
                    path: props.cnc.machine.item.path,
                    control: parseInt(props.cnc.machine.item.control),
                    name: props.cnc.machine.item.name,
                    describe: props.cnc.machine.item.describe,
                };
                props.cnc.machine.item.button_loading = true;
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/update", "POST", data).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            props.cnc.machine.items.forEach((item: any, index: any, array: any)=>{
                                if(item.path === data.path){
                                    props.cnc.machine.items[index].name = data.name;
                                    props.cnc.machine.items[index].describe = data.describe;
                                    props.cnc.machine.items[index].control = data.control;
                                }
                            });
                            props.cnc.machine.item.button_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存成功",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            props.cnc.machine.item.button_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        props.cnc.machine.item.button_loading = false;
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

        onMounted(() => {
            nextTick(()=>{
                onInit();
            });
        });

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onUpdate
        }
    }
});
</script>

<style scoped>
.configuration-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.configuration-view .configuration-box{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
}
.configuration-view .configuration-box .box-item{
    width: 100%;
    padding: 30px 20px;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 20px;
    border-radius: 4px;
}
.configuration-view .configuration-box .box-item .title{
    color: #999999;
    margin-bottom: 10px;
}
</style>
