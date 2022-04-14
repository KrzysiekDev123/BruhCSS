import { StyleObjectToString } from './util';
import GenerateProperty from './GenerateProperty';

/**
 * Transpile list of styles
 * @param {object} styleuse Styleuse object
 * @returns {string} Transpiled styles
*/
function TranspileStyleUse(styleuse: StyleUse): {result: StyleList, nested: any} {
    let result: StyleList = {};
    let nested: any = [];
    // Transpile every style in @(style1, style2, style3, ...);
    for (let style of styleuse.styles) {
        // If style is defined

        if (global.styles[style]) {
            result = {...result, ...styles[style].style}

            if (styles[style].nested)
                nested = nested.concat(styles[style].nested)
        } else {
            // If is is not,
            // Try to generate the style
            let gen = GenerateProperty(style);

            if (gen) {
                result = {...result, ...gen};
            } else {
                // TODO: Formatowanie
                console.error(`Style "${style}" is not defined!`);
                console.error('UndefinedReferenceError at line ' + styleuse.token.line)
                process.exit(1);
            }
        }
    }

    return {
        result: result,
        nested: nested
    }
}

/**
 * Transpile a code block
 * @param {object[]} block Parent style definition or selector style
 * @returns {object} An object, containing string (style) and a list of nested declarations (nested)
*/
function TranspileBlock(block: Block): {result: StyleList, nested: any} {
    let result: StyleList = {};
    let nested: any[] = [];

    for (let x of block) {
        if (x.type == 'styleuse') {
            x = x as StyleUse;
            let content = TranspileStyleUse(x);
            result = {...result, ...content.result};
            nested = nested.concat(content.nested);
        }

        if (x.type == 'param') {
            x = x as Param;
            result[x.key] = x.value.join(' ');
        }

        if (x.type == 'selstyle') {
            x = x as SelStyle;
            nested.push(TranspileSelectorStyle(x));
        }
    }

    return {
        result: result,
        nested: nested
    }
}


/**
 * Transpile (inner or normal) selector style
 * @param {object} selstyle Selector style object
 * @returns {object} Object containing the style, and nested properties
 */
function TranspileSelectorStyle(selstyle: SelStyle): {result: StyleList, nested: any, data: string, selector: string} {
    let block = TranspileBlock(selstyle.styles);
    let nested: any[] = [];
    let sel = selstyle.selector.trim();
    let res = '';

    res += ` {\n`;
    res += StyleObjectToString(block.result);
    res += '}';

    nested = nested.concat(block.nested);
    
    return {
        result: block.result,
        nested: nested,
        data: res,
        selector: sel
    }
}


export { TranspileBlock, TranspileSelectorStyle };