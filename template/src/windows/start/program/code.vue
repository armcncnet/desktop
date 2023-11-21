<template>
    <div class="editor-view">
        <div class="editor" ref="editor"></div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref, nextTick} from "vue";
import {ElMessage} from "element-plus";
import * as icons from "@element-plus/icons";
import * as monaco from "monaco-editor";
export default defineComponent({
    name: "CodeProgram",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        const editor = ref(null);
        let editor_data: any = false;
        function InitEditor(content: string){
            editor_data = monaco.editor.create((editor as any).value, {
                value: content,
                language: "sb",
                theme: "vs-dark",
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true,
                glyphMargin: true,
                useTabStops: false,
                fontSize: 12,
                lineHeight: 22,
                quickSuggestionsDelay: 100,
                scrollBeyondLastLine: false,
                foldingStrategy: "indentation",
                lineNumbersMinChars: 5,
                lineDecorationsWidth: 0,
                mouseWheelZoom: false,
                colorDecorators: false,
                contextmenu: true,
            });
        }

        function onSaveProgram(){
            let code = editor_data.getValue();
            const model = editor_data.getModel();
            if (!model) {
                props.cnc.program.update_loading = false;
                ElMessage.closeAll();
                ElMessage({
                    message: "保存失败，请重新尝试",
                    type: "warning",
                    customClass: "cnc"
                });
                return;
            }
            const firstLine = model.getLineContent(1);
            if(firstLine === ""){
                props.cnc.program.update_loading = false;
                ElMessage.closeAll();
                ElMessage({
                    message: "缺少程序基本信息",
                    type: "warning",
                    customClass: "cnc"
                });
                return;
            }
            if(!firstLine.includes("({") || !firstLine.includes("})")){
                props.cnc.program.update_loading = false;
                ElMessage.closeAll();
                ElMessage({
                    message: "缺少程序基本信息",
                    type: "warning",
                    customClass: "cnc"
                });
                return;
            }
            const firstJson = JSON.parse(firstLine.replace("(", "").replace(")", ""));
            if(firstJson.name && firstJson.name !== "" && firstJson.describe && firstJson.describe !== "" && firstJson.version && firstJson.version !==""){
                (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/program/update/content", "POST", {file_name: props.cnc.program.item.path, content: code}).then((response: any)=>{
                    if(response.code === 0){
                        if(response.data){
                            if(props.cnc.program.item.path !== ""){
                                props.cnc.program.item.name = firstJson.name;
                                props.cnc.program.item.version = firstJson.version;
                                props.cnc.program.item.content = code;
                                props.cnc.program.tab.items[0].name = firstJson.name;
                                props.cnc.program.items.forEach((item: any, index: any, array: any)=>{
                                    if(item.path === props.cnc.program.item.path){
                                        props.cnc.program.items[index].name = firstJson.name;
                                        props.cnc.program.items[index].describe = firstJson.describe;
                                        props.cnc.program.items[index].version = firstJson.version;
                                    }
                                });
                            }
                            if(props.cnc.program.item.path === ""){
                                (window as any).runtime.EventsEmit("event_page", {type: "page_program"});
                            }
                            props.cnc.program.update_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存成功",
                                type: "success",
                                customClass: "cnc"
                            });
                        }else{
                            props.cnc.program.update_loading = false;
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存失败，请重新尝试",
                                type: "warning",
                                customClass: "cnc"
                            });
                        }
                    }else{
                        props.cnc.program.update_loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "保存失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
            }else{
                ElMessage.closeAll();
                ElMessage({
                    message: "缺少程序基本信息",
                    type: "warning",
                    customClass: "cnc"
                });
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {
            nextTick(()=>{
                InitEditor(props.cnc.program.item.content);
            });
        });

        onBeforeUnmount(() => {
            if(editor_data) {
                editor_data.dispose();
            }
        });

        onUnmounted(() => {});

        return {
            props,
            icons,
            editor,
            onSaveProgram
        }
    }
});
</script>

<style scoped>
.editor-view{
    width: 100%;
    height: 100%;
}
.editor-view .editor{
    width: 100%;
    height: 100%;
}
</style>
