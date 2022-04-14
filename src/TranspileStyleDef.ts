import { TranspileBlock } from './TranspileBlock';
import { StyleObjectToString } from './util';

/**
 * Transpile style definition
 * @param {object} def Style definition object
 * @returns {string} Transpiled style definition
*/
function TranspileStyleDef(def: StyleDef): string {
    let content = TranspileBlock(def.styles);
    let transpiled = '';

    // Declaring a class
    if (Object.keys(content.result).length != 0) {
        transpiled += `.${def.name} {\n`;
        transpiled += StyleObjectToString(content.result);
        transpiled += '}';
    }

    let functions: Function[] = [];
    function DFS(node: { result?: {}; nested: any; data?: any; }, path: string) {
        if (node.data) {
            if (node.data != ' {\n}')
                functions.push((a: string) => a + path + node.data)
        }

        for (let x of node.nested) {
            if (typeof x == 'function') {
                functions.push(x)
                continue;
            }

            DFS(x, path + (x.selector.startsWith('&') ? x.selector.slice(1) : ' ' + x.selector));
        }
    }

    DFS(content, '');

    global.styles[def.name] = {
        style: content.result,
        nested: functions
    }

    if (content.nested.length != 0) {
        transpiled += '\n\n'
    }

    transpiled += functions.map(x => {
        return x('.' + def.name);
    }).join('\n\n');

    return transpiled;
}

export default TranspileStyleDef;