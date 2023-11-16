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
    name: "LaunchMachine",
    emits: [],
    props: ["cnc", "item"],
    components: {},
    setup(props, context) {

        const editor = ref(null);
        let editor_data: any = false;
        function InitEditor(content: string){
            editor_data = monaco.editor.create((editor as any).value, {
                value: content,
                language: "python",
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

            editor_data.onKeyDown((key: any)=>{
                if (key.code === "KeyS" && key.ctrlKey) {
                    let code = editor_data.getValue();
                    (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/update/launch", "POST", {path: props.cnc.machine.item.path, content: code}).then((response: any)=>{
                        if(response.code === 0){
                            if(response.data){
                                props.cnc.machine.item.launch = code;
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "保存成功",
                                    type: "success",
                                    customClass: "cnc"
                                });
                            }else{
                                ElMessage.closeAll();
                                ElMessage({
                                    message: "保存失败，请重新尝试",
                                    type: "warning",
                                    customClass: "studio"
                                });
                            }
                        }else{
                            ElMessage.closeAll();
                            ElMessage({
                                message: "保存失败，请重新尝试",
                                type: "warning",
                                customClass: "studio"
                            });
                        }
                    });
                }
            });
        }

        onBeforeMount(() => {});

        onMounted(() => {
            nextTick(()=>{
                InitEditor(props.cnc.machine.item.launch);
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
            editor
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
