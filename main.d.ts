type Token = {
    type: string,
    value: string,
    line: number,
    col: number
}

type ErrorData = {
    name: string,
    details?: string,
    tip?: string
}

type StyleList = {
    [index: string]: any;
}

type Param = {
    key: string;
    value: string[];
    type: string;
}

type Block = 
    (Param | SelStyle | StyleUse)[];


type StyleUse = {
    type: string;
    styles: string;
    token: Token;
}

type StyleDef = {
    name: string;
    styles: Block;
}

type SelStyle = {
    type: string;
    selector: string;
    styles: Block;
}


declare var styles: StyleList;
declare var lines: string[];