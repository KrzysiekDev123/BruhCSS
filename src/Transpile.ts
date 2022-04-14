import TranspileStyleDef from './TranspileStyleDef';
import { TranspileSelectorStyle } from './TranspileBlock';

function Transpile(AST: any[]) {
    let result: any[] = [];

    for (let x of AST) {
        if (x.type == 'styledef') {
            result.push(TranspileStyleDef(x));
        }
        
        if (x.type == 'selstyle') {
            let parsed = TranspileSelectorStyle(x);
            let nested: any[] = [];

            function DFS(node: any, path: string, skip?: boolean) {
                if (!skip && node.data != ' {\n}')
                    nested.push(parsed.selector + path + node.data)
                
                for (let x of node.nested) {
                    DFS(x, path + (x.selector.startsWith('&') ? x.selector.slice(1) : ' ' + x.selector));
                }
            }

            DFS(parsed, '', true);
            result.push(parsed.selector + parsed.data);
            result = result.concat(nested)
        }
    }

    return result.join('\n\n');
}

export default Transpile;