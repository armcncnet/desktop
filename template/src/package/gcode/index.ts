// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import {BufferGeometry, FileLoader, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments, Loader, SplineCurve} from "three";
import * as mathjs from "mathjs";

class GCODE extends Loader {

    constructor(manager: any) {
        super(manager);
        const _this: any = this;
        _this.splitLayer = false;
    }

    load(url: string, onLoad: any, onProgress: any, onError: any ) {
        const scope: any = this;

        const loader = new FileLoader(scope.manager);
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
        let state: any = {x: 0, y: 0, z: 0, e: 0, f: 0,i:0,j:0, extruding: false, relative: false};
        let currentLayer: any = undefined;
        let cmd;
        const args: any = {};
        const object = new Group();
        object.name = "gcode";
        object.userData.dimensions = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
            minZ: Infinity,
            maxZ: -Infinity
        };

        const pathMaterial = new LineBasicMaterial({color: 0x5E4EFF});
        pathMaterial.name = "path";

        const extrudingMaterial = new LineBasicMaterial({color: 0x00FF00});
        extrudingMaterial.name = "extruded";

        function newLayer(line: any) {
            currentLayer = {vertex: [], pathVertex: [], z: line.z};
            layers.push(currentLayer);
        }

        function addSegment(p1: any, p2: any) {
            if (currentLayer === undefined) {
                newLayer(p1);
            }
            if (state.extruding) {
                currentLayer.vertex.push(p1.x, p1.y, p1.z);
                currentLayer.vertex.push(p2.x, p2.y, p2.z);
            }else{
                currentLayer.pathVertex.push(p1.x, p1.y, p1.z);
                currentLayer.pathVertex.push(p2.x, p2.y, p2.z);
            }

            object.userData.dimensions.minX = Math.min(object.userData.dimensions.minX, p2.x);
            object.userData.dimensions.maxX = Math.max(object.userData.dimensions.maxX, p2.x);
            object.userData.dimensions.minY = Math.min(object.userData.dimensions.minY, p2.y);
            object.userData.dimensions.maxY = Math.max(object.userData.dimensions.maxY, p2.y);
            object.userData.dimensions.minZ = Math.min(object.userData.dimensions.minZ, p2.z);
            object.userData.dimensions.maxZ = Math.max(object.userData.dimensions.maxZ, p2.z);
        }

        function delta(v1: any, v2: any) {
            return state.relative ? v2 : v2 - v1;
        }

        function absolute(v1: any, v2: any) {
            return state.relative ? v1 + v2 : v2;
        }

        for ( let i = 0; i < lines.length; i ++ ) {
            const tokens = lines[i].split(' ');
            cmd = tokens[0].toUpperCase();
            tokens.splice(0).forEach((token: any)=>{
                if (token[0] !== undefined) {
                    const key = token[0].toLowerCase();
                    args[key] = parseFloat(token.substring(1));
                }
            });
            if (cmd === "G00" || cmd === "G0" || cmd === "G01" || cmd === "G1" || /(([XxYyZzIiJj]) *(-?\d+.?\d*)) *(([XxYyZzIiJj]) *(-?\d+.?\d*))? *(([XxYyZzIiJj]) *(-?\d+.?\d*))?/g.test(cmd)) {
                const line = {
                    x: args.x !== undefined ? absolute(state.x, args.x) : state.x,
                    y: args.y !== undefined ? absolute(state.y, args.y) : state.y,
                    z: args.z !== undefined ? absolute(state.z, args.z) : state.z,
                    e: args.e !== undefined ? absolute(state.e, args.e) : state.e,
                    f: args.f !== undefined ? absolute(state.f, args.f) : state.f,
                }
                if (delta(state.e, line.e) > 0) {
                    state.extruding = delta(state.e, line.e) > 0;
                    if ( currentLayer == undefined || line.z != currentLayer.z ) {
                        newLayer(line);
                    }
                }
                addSegment(state,line);
                state = line;
            } else if (cmd === "G02" || cmd === "G2" || cmd === "G03" || cmd === "G3") {
                const line = {
                    x: args.x !== undefined ? absolute(state.x, args.x) : state.x,
                    y: args.y !== undefined ? absolute(state.y, args.y) : state.y,
                    z: args.z !== undefined ? absolute(state.z, args.z) : state.z,
                    i: args.i !== undefined ? absolute(state.i, args.i) : state.i,
                    j: args.j !== undefined ? absolute(state.j, args.j) : state.j,
                    e: args.e !== undefined ? absolute(state.e, args.e) : state.e,
                    f: args.f !== undefined ? absolute(state.f, args.f) : state.f,
                };
                if (delta(state.e, line.e) > 0) {
                    state.extruding = delta(state.e, line.e) > 0;
                    if (currentLayer == undefined || line.z != currentLayer.z) {
                        newLayer(line);
                    }
                }
                addSegment(state,line);
                state = line;
            } else if (cmd === "G90") {
                state.relative = false;
            } else if (cmd === "G91") {
                state.relative = true;
            } else if (cmd === "G92") {
                const line = state;
                line.x = args.x !== undefined ? args.x : line.x;
                line.y = args.y !== undefined ? args.y : line.y;
                line.z = args.z !== undefined ? args.z : line.z;
                line.e = args.e !== undefined ? args.e : line.e;
                state = line;
            } else {}
        }

        function addObject(vertex: any, extruding: any, i: any ,cmd: any) {
            if(cmd != "G02" || cmd != "G03" || cmd != "G2" || cmd != "G3"){
                const geometry = new BufferGeometry();
                geometry.setAttribute("position", new Float32BufferAttribute(vertex, 3));
                const segments = new LineSegments(geometry, extruding ? extrudingMaterial : pathMaterial);
                segments.name = "layer" + i;
                object.add(segments);
            } else {
                if(args.i !== undefined && args.j !== undefined) {
                    const centerX = state.x + args.i;
                    const centerY = state.y + args.j;
                    const radius = Math.sqrt(args.i ** 2 + args.j ** 2);
                    const startAngle = Math.atan2(state.y - centerY, state.x - centerX);
                    let endAngle = Math.atan2(args.y - centerY, args.x - centerX);
                    if (cmd === "G02" || cmd === "G2") {
                        if (endAngle >= startAngle) {
                            endAngle -= 2 * Math.PI;
                        }
                    }else{
                        if (endAngle <= startAngle) {
                            endAngle += 2 * Math.PI;
                        }
                    }
                    const curve = new THREE.ArcCurve(
                        centerX, centerY,
                        radius,
                        startAngle,
                        endAngle,
                        (cmd === "G03" || cmd === "G3")
                    );
                    const points = curve.getPoints(50);
                    const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p: any) => new THREE.Vector3(p.x, p.y, state.z)));
                    const material = extruding ? extrudingMaterial : pathMaterial;
                    const arcLine = new THREE.Line(geometry, material);
                    arcLine.name = "layer" + i;
                    object.add(arcLine);
                }else{
                    const curve = new THREE.SplineCurve( [
                        new THREE.Vector2(state.x, state.y),
                        new THREE.Vector2(args.x, args.y)
                    ]);
                    const points = curve.getPoints(50);
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const ellipse = new THREE.Line(geometry, extruding ? extrudingMaterial : pathMaterial);
                    ellipse.name = "layer" + i;
                    object.add(ellipse);
                }
            }
        }

        if (scope.splitLayer) {
            for ( let i = 0; i < layers.length; i ++ ) {
                const layer = layers[i];
                // addObject(layer.vertex, true, i ,cmd);
                addObject(layer.pathVertex, false, i ,cmd);
            }
        }else{
            const vertex = [], pathVertex = [];
            for ( let i = 0; i < layers.length; i ++ ) {
                const layer = layers[i];
                const layerVertex = layer.vertex;
                const layerPathVertex = layer.pathVertex;
                for ( let j = 0; j < layerVertex.length; j ++ ) {
                    vertex.push(layerVertex[j]);
                }
                for ( let j = 0; j < layerPathVertex.length; j ++ ) {
                    pathVertex.push(layerPathVertex[j]);
                }
            }
            // addObject(vertex, true, layers.length ,cmd);
            addObject(pathVertex, false, layers.length ,cmd);
        }
        object.scale.set(0.1, 0.1, 0.1);
        return object;
    }

    formatCode(gcode: any) {
        const scope: any = this;
        const lines = gcode.split('\n');
        let variables: any = {};
        const variablePattern = /#<(\w+)>=(.*)|(#\d+)=(.*)|(#\w+)=(.*)/;
        for (let line of lines) {
            if (line !== "") {
                line = line.split(';')[0].trim();
                line = line.split('(')[0].trim();
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
                    return match
                }
            });
        });
    }
}

export {GCODE};