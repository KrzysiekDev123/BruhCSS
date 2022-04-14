import moo from 'moo';

const Lexer: moo.Lexer = moo.compile({
    ws: /[ \t]+/,
    keyword: ['@style', '@import', 'from', 'var'],
    styleopen: '@(',
    comma: ',',
    word: /(?:[\!\#\.\$-\:\&\*]+)?[\w-.]+/,
    unit: /(?:[0-9]+\.)?[0-9]+[a-z]+/,
    string: {
        match: /'.*'/,
        value: (x) => x.slice(1, -1)
    },
    sc: ';',
    hex: /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})/,
    number: /[0-9]+/,
    nl: {
        match: /\n/,
        lineBreaks: true
    },
    char: {
        match: /[^]/,
        lineBreaks: true
    }
})

export default function Lex(code: string) {
    Lexer.reset(code);

    let token = Lexer.next();
    let tokens: Token[] = [];

    while (token) {
        if (!['ws', 'nl'].includes(token.type as string))
            tokens.push(token as Token);
        token = Lexer.next();
    }

    return tokens.map(x => {
        return {
            type: x.type,
            value: x.value,
            line: x.line,
            col: x.col
        }
    })
} 
