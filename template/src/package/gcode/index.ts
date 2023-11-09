// @ts-ignore
import * as THREE from "three";
import * as mathjs from "mathjs";
// @ts-ignore
import {mergeGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";

class GCODE extends THREE.Loader {

    constructor(manager: any) {
        super(manager);
        const _this: any = this;
        _this.splitLayer = false;
        _this.state = {cmd: "", x: 0, y: 0, z: 0, e: 0, f: 0, i:0, j:0};
        _this.material = new THREE.LineBasicMaterial({color: 0x5E4EFF});
        _this.last_position = false;
        _this.object = new THREE.Group();
    }

    load(url: string, onLoad: any, onProgress: any, onError: any ) {
        const scope: any = this;
        const loader = new THREE.FileLoader(scope.manager);
        loader.setPath(scope.path);
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, (text: any) => {
            try {
                text = scope.formatCode(text);
                onLoad(scope.parse(text));
            } catch (e) {
                if (onError) {
                    onError(e);
                }
                scope.manager.itemError(url);
            }
        }, onProgress, onError);
    }

    parse(lines: any){
        const scope: any = this;
        const layers: any = [];
        scope.splitLayer = false;
        scope.state = {cmd: "", x: 0, y: 0, z: 0, e: 0, f: 0, i:0, j:0};
        scope.material = new THREE.LineBasicMaterial({color: 0x5E4EFF});
        scope.last_position = false;
        scope.object = new THREE.Group();
        scope.object.name = "gcode";
        scope.object.userData.dimensions = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
            minZ: Infinity,
            maxZ: -Infinity
        };
        scope.object.userData.segments = [];

        scope.material.name = "path";

        const geometries = [];

        for (let line of lines) {
            const token = line.split(" ");
            const args: any = {};
            let cmd: any = "";
            if(token.length > 0){
                cmd = token[0].toUpperCase();
                token.splice(0).forEach((item: any)=>{
                    if(item[0] !== undefined){
                        const key = item[0].toLowerCase();
                        const value = parseFloat(item.substring(1));
                        args[key] = value;
                    }
                });
                if(cmd === "G0" || cmd === "G1"){
                    const line = {
                        cmd: cmd,
                        x: args.x ? args.x : scope.state.x,
                        y: args.y ? args.y : scope.state.y,
                        z: args.z ? args.z : scope.state.z,
                        e: args.e ? args.e : scope.state.e,
                        f: args.f ? args.f : scope.state.f,
                        i: args.i ? args.i : scope.state.i,
                        j: args.j ? args.j : scope.state.j
                    }
                    layers.push(line);
                    scope.state = line;
                    let geometry = scope.addLine(line);
                    geometries.push(geometry);
                }else if(cmd === "G2" || cmd === "G3"){
                    const line = {
                        cmd: cmd,
                        x: args.x ? args.x : scope.state.x,
                        y: args.y ? args.y : scope.state.y,
                        z: args.z ? args.z : scope.state.z,
                        e: args.e ? args.e : scope.state.e,
                        f: args.f ? args.f : scope.state.f,
                        i: args.i ? args.i : scope.state.i,
                        j: args.j ? args.j : scope.state.j
                    }
                    layers.push(line);
                    scope.state = line;
                    let geometry = scope.addLine(line);
                    geometries.push(geometry);
                }else if(cmd === "G92"){
                    const line = {
                        cmd: cmd,
                        x: args.x ? args.x : scope.state.x,
                        y: args.y ? args.y : scope.state.y,
                        z: args.z ? args.z : scope.state.z,
                        e: args.e ? args.e : scope.state.e,
                        f: args.f ? args.f : scope.state.f,
                        i: args.i ? args.i : scope.state.i,
                        j: args.j ? args.j : scope.state.j
                    }
                    layers.push(line);
                    scope.state = line;
                    let geometry = scope.addLine(line);
                    geometries.push(geometry);
                }else{
                    if(cmd.indexOf("N") !== -1){
                        const line = {
                            cmd: cmd,
                            x: args.x ? args.x : scope.state.x,
                            y: args.y ? args.y : scope.state.y,
                            z: args.z ? args.z : scope.state.z,
                            e: args.e ? args.e : scope.state.e,
                            f: args.f ? args.f : scope.state.f,
                            i: args.i ? args.i : scope.state.i,
                            j: args.j ? args.j : scope.state.j
                        }
                        layers.push(line);
                        scope.state = line;
                        let geometry = scope.addLine(line);
                        geometries.push(geometry);
                    }
                }
            }
        }

        const mergedGeometry = mergeGeometries(geometries, false);
        let line = new THREE.Line(mergedGeometry, scope.material);
        line.name = "layer";
        scope.object.userData.segments.push({segment: line, passed: false});
        scope.object.add(line);
        scope.object.scale.set(0.1, 0.1, 0.1);
        return scope.object;
    }

    addLine(line: any){
        const scope: any = this;
        let geometry = scope.addObject(line);
        scope.object.userData.dimensions.minX = Math.min(scope.object.userData.dimensions.minX, line.x);
        scope.object.userData.dimensions.maxX = Math.max(scope.object.userData.dimensions.maxX, line.x);
        scope.object.userData.dimensions.minY = Math.min(scope.object.userData.dimensions.minY, line.y);
        scope.object.userData.dimensions.maxY = Math.max(scope.object.userData.dimensions.maxY, line.y);
        scope.object.userData.dimensions.minZ = Math.min(scope.object.userData.dimensions.minZ, line.z);
        scope.object.userData.dimensions.maxZ = Math.max(scope.object.userData.dimensions.maxZ, line.z);
        return geometry;
    }

    addObject(layer: any){
        const scope: any = this;
        const geometry = new THREE.BufferGeometry();
        if(!scope.last_position){
            scope.last_position = new THREE.Vector3(layer.x, layer.y, layer.z);
        }
        if(layer.cmd === "G2" || layer.cmd === "G3"){
            const start = new THREE.Vector3(scope.last_position.x, scope.last_position.y, scope.last_position.z);
            const end = new THREE.Vector3(layer.x, layer.y, layer.z);
            const offset = new THREE.Vector3(layer.i, layer.j, 0);
            const center = start.clone().add(offset);
            const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
            let endAngle = Math.atan2(end.y - center.y, end.x - center.x);
            const clockwise = layer.cmd === "G2";
            if (clockwise && startAngle < endAngle) {
                endAngle -= 2 * Math.PI;
            }else if (!clockwise && startAngle > endAngle) {
                endAngle += 2 * Math.PI;
            }
            const radius = offset.length();
            const curve = new THREE.EllipseCurve(
                center.x, center.y,
                radius, radius,
                startAngle, endAngle,
                clockwise
            );
            const points = curve.getPoints(50);
            const vertices: any = [];
            points.forEach((point: any) => {
                vertices.push(point.x, point.y, layer.z);
            });
            const verticesArray = new Float32Array(vertices);
            geometry.setAttribute("position", new THREE.BufferAttribute(verticesArray, 3));
            scope.last_position = end;
        }else{
            const vertices = [scope.last_position.x, scope.last_position.y, scope.last_position.z, layer.x, layer.y, layer.z];
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            scope.last_position.set(layer.x, layer.y, layer.z);
        }
        return geometry;
    }

    formatCode(gcode: any) {
        const scope: any = this;
        const lines = gcode.split('\n');
        let variables: any = {};
        const variablePattern = /#<(\w+)>=(.*)|(#\d+)=(.*)|(#\w+)=(.*)/;
        for (let line of lines) {
            if (line !== "") {
                let check_line = line.split('({');
                if(check_line.length === 2){
                    continue
                }
                check_line = line.split(';');
                if(check_line.length > 0 && check_line[0] === ""){
                    continue
                }
                line = line.split(';')[0].trim();
                if (line !== "") {
                    const match = variablePattern.exec(line);
                    if (match) {
                        variablePattern.lastIndex = 0;
                        if (match[1]) {
                            variables["#<" + match[1] + ">"] = parseFloat(match[2]).toFixed(2);
                        }
                        if (match[3]) {
                            variables[match[3]] = parseFloat(match[4]).toFixed(2);
                        }
                        if (match[5]) {
                            variables[match[5]] = parseFloat(match[6]).toFixed(2);
                        }
                    }
                }
            }
        }
        return scope.replaceVariables(gcode, variables);
    }

    replaceVariables(gcode: any, variables: any){
        const scope: any = this;
        const variableExpression = /\[([^\]]+)\]/g;
        return gcode.split('\n').map((line: string) => {
            // @ts-ignore
            return line.replace(variableExpression, (match: any, expression: any) => {
                let replacedExpression = expression;
                for (const [variable, value] of Object.entries(variables)) {
                    replacedExpression = replacedExpression.split(variable).join(value);
                }
                try {
                    return mathjs.evaluate(replacedExpression).toFixed(5);
                } catch (e) {
                    return match;
                }
            });
        });
    }
}

export {GCODE};