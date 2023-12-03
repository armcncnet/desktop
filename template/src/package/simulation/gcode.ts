// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import {mergeGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as mathjs from "mathjs";

export default class Gcode {

    constructor() {
        const _this: any = this;
        _this.splitLayer = false;
        _this.state = {cmd: "", x: 0, y: 0, z: 0, e: 0, f: 0, i:0, j:0};
        _this.material = new THREE.LineBasicMaterial({color: 0x5E4EFF});
        _this.last_position = false;
        _this.object = new THREE.Group();
    }

    load(lines: any, callback: any) {
        const _this: any = this;
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
        callback(_this.parse(_this.replaceVariables(lines, variables)));
    }

    parse(lines: any){
        const _this: any = this;
        const layers: any = [];
        _this.splitLayer = false;
        _this.state = {cmd: "", x: 0, y: 0, z: 0, e: 0, f: 0, i:0, j:0};
        _this.material = new THREE.LineBasicMaterial({color: 0x5E4EFF});
        _this.last_position = false;
        _this.object = new THREE.Group();
        _this.object.name = "gcode";
        _this.object.userData.dimensions = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
            minZ: Infinity,
            maxZ: -Infinity
        };

        _this.object.userData.segments = [];

        _this.material.name = "path";

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
                        args[key] = parseFloat(item.substring(1));
                    }
                });
                const line = {
                    cmd: cmd,
                    x: args.x ? args.x : _this.state.x,
                    y: args.y ? args.y : _this.state.y,
                    z: args.z ? args.z : _this.state.z,
                    e: args.e ? args.e : _this.state.e,
                    f: args.f ? args.f : _this.state.f,
                    i: args.i ? args.i : _this.state.i,
                    j: args.j ? args.j : _this.state.j
                }
                layers.push(line);
                _this.state = line;
                let geometry = _this.addLine(line);
                geometries.push(geometry);
            }
        }

        const mergedGeometry = mergeGeometries(geometries, true);
        let line = new THREE.Line(mergedGeometry, _this.material);
        line.name = "layer";
        _this.object.userData.segments.push({segment: line, passed: false});
        _this.object.add(line);
        _this.object.scale.set(0.1, 0.1, 0.1);
        return _this.object;
    }

    addLine(line: any){
        const _this: any = this;
        let geometry = _this.addObject(line);
        _this.object.userData.dimensions.minX = Math.min(_this.object.userData.dimensions.minX, line.x);
        _this.object.userData.dimensions.maxX = Math.max(_this.object.userData.dimensions.maxX, line.x);
        _this.object.userData.dimensions.minY = Math.min(_this.object.userData.dimensions.minY, line.y);
        _this.object.userData.dimensions.maxY = Math.max(_this.object.userData.dimensions.maxY, line.y);
        _this.object.userData.dimensions.minZ = Math.min(_this.object.userData.dimensions.minZ, line.z);
        _this.object.userData.dimensions.maxZ = Math.max(_this.object.userData.dimensions.maxZ, line.z);
        return geometry;
    }

    addObject(layer: any){
        const _this: any = this;
        const geometry = new THREE.BufferGeometry();
        if(!_this.last_position){
            _this.last_position = new THREE.Vector3(layer.x, layer.y, layer.z);
        }
        if(layer.cmd === "G2" || layer.cmd === "G3"){
            const start = new THREE.Vector3(_this.last_position.x, _this.last_position.y, _this.last_position.z);
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
            _this.last_position = end;
        }else{
            const vertices = [_this.last_position.x, _this.last_position.y, _this.last_position.z, layer.x, layer.y, layer.z];
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            _this.last_position.set(layer.x, layer.y, layer.z);
        }
        return geometry;
    }

    replaceVariables(lines: any, variables: any){
        const _this: any = this;
        const variableExpression = /\[([^\]]+)\]/g;
        return lines.map((line: string) => {
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