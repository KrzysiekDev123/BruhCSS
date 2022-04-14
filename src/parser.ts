import chalk from 'chalk';

class Parser {
    tokenIndex: number = -1;
    token: Token;
    tokens: Token[];
    lines: string[];
    openingBraceIndex: number = 0;
    nestLevel: number = 0;

    constructor(tokens: Token[], lines: string[]) {
        this.tokens = tokens;
        this.lines = lines;
        this.token = this.next();
    }

    parse() {
        let AST: object[] = [];

        while (this.token) {
            if (this.token.value == '@style') {
                AST.push(this.styledef());
            } else if (!['}', '{', '(', ')', ';'].includes(this.token.value)) {
                AST.push(this.selstyle());
            } else this.ThrowParseError(this.token, {
                name: 'Unexpected character',
                details: 'Sorry, but there should not be any ' + chalk.green('\'' + this.token.value + '\'') + ' here!'
            })

            this.next();
        }


        return AST;
    }

    next() {
        this.tokenIndex++;
        this.token = this.tokens[this.tokenIndex];
        return this.token;
    }

    expect(value: string, highlight?: boolean, types?: string[]) {
        let token = this.token;

        if (value == 'NOTNULL') {
            if (!this.token) this.ThrowParseError(this.tokens[this.tokenIndex - 1], {
                name: 'Unexpected EOF',
                details: 'Well, the file should not end here 🤔'
            })

            return;
        }

        if (token == undefined) this.ThrowParseError(this.tokens[this.tokenIndex - 1], {
            name: 'Syntax error',
            details: 'I expected a ' + (highlight ? chalk.green('\'' + value + '\'') : value) + ', but got EOF 🤔'
        })

        if (types) {
            if (!types.includes(token.type)) this.ThrowParseError(token, {
                name: 'Syntax error',
                details: 'I expected a ' + (highlight ? chalk.green('\'' + value + '\'') : value) + ', but you gave me ' + chalk.green('\'' + token.value + '\'') + ' 🤔'
            })
        } else if (this.token.value != value) {
            this.ThrowParseError(token, {
                name: 'Syntax error',
                details: 'I expected a ' + (highlight ? chalk.green('\'' + value + '\'') : value) + ', but you gave me ' + chalk.green('\'' + token.value + '\'') + ' 🤔'
            })
        }

        this.next();

        return token;
    }



    styledef() {
        this.next();

        let stylename = this.expect('style name', false, ['word'])?.value;

        this.nestLevel++;
        this.openingBraceIndex = this.tokenIndex;

        this.expect('{', true);
        this.expect('NOTNULL');

        return {
            type: 'styledef',
            name: stylename,
            styles: this.block()
        }
    }

    selstyle() {
        let selector: string = `${this.token.value} `;

        this.next();

        if (this.token == undefined) this.ThrowParseError(this.tokens[this.tokenIndex - 1], {
            name: 'Syntax error',
            details: 'Wtf. You literally typed a selector without block. You\'re are so weird.'
        })

        while (this.token.value != '{') {
            if (this.token.type != 'word' && this.token.type != 'comma' && !['>', '*'].includes(this.token.value)) this.ThrowParseError(this.token, {
                name: 'Unexpected character',
                details: 'I expected a ' + chalk.green('\'{\'') + ', but got '  + chalk.green('\'' + this.token.value + '\'') + '.'
            })

            if (this.tokens[this.tokenIndex + 1] != undefined) {
                if (this.tokens[this.tokenIndex + 1].type == 'comma') {
                    selector += this.token.value;
                } else {
                    selector += this.token.value + ' ';
                }
            } else this.ThrowParseError(this.token, {
                name: 'Syntax error',
                details: 'Wtf. You literally typed a selector without block. You\'re so weird.'
            })

            this.next();
        }

        this.nestLevel++;
        this.openingBraceIndex = this.tokenIndex;
        this.next();

        return {
            type: 'selstyle',
            selector: selector.trim(),
            styles: this.block()
        }
    }

    block() {
        let block: any = [];

        if (this.token == undefined) this.ThrowParseError(this.tokens[this.openingBraceIndex], {
            name: 'Unclosed block',
            details: 'Looks like you didn\'t close the block.',
            tip: chalk.blueBright('Tip! Try adding a ' + chalk.green('\'}\'') + ' at line ' + this.tokens[this.tokenIndex - 1].line) + '\n' +
            chalk.gray((this.tokens[this.tokenIndex - 1].line - 1) + '|' ) + this.lines[this.tokens[this.tokenIndex - 1].line - 1]  + '\n' +
            chalk.gray(this.tokens[this.tokenIndex - 1].line + '|') + ' '.repeat((this.nestLevel - 1) * 4) + chalk.green('}') + chalk.yellowBright(' <- here!') 
        })

        if (this.token.value == '@(') {
            block.push(this.styleuse());
            block = block.concat(this.block());
        } else if (this.token.value != '}') {
            if (this.tokens[this.tokenIndex + 1].value == ':') {
                block.push(this.param());
            } else {
                block.push(this.selstyle());
            }

            block = block.concat(this.block());
        } else {
            this.nestLevel--;
            if (this.nestLevel != 0) {
                this.next()
            }
        }

        return block;
    }

    styleuse() {
        this.next();
        let last: null | Token = null;
        let styles: string[] = [];

        while (this.token.value != ')') {
            if (last != null) {
                if (last.type == 'word') {
                    if (this.token.type == 'word') {
                        this.ThrowParseError(this.token, {
                            name: 'Unexpected identifier',
                            details: 'I expected ' + chalk.green('\',\'') + ', but you gave me ' + chalk.green('\'' + this.token.value + '\''),
                            tip: chalk.blueBright('Tip! Try inserting a comma between ') + chalk.green('\'' + last.value + '\'') + chalk.blueBright(' and ') + chalk.green('\'' + this.token.value + '\'')
                        })
                    } 
                } else {
                    if (this.token.type == 'word') {
                        styles.push(this.token.value);
                    } else this.ThrowParseError(this.token, {
                        name: 'Unexpected character',
                        details: 'Unexpected ' + chalk.green('\'' + this.token.value + '\'')
                    })
                }
            } else {
                if (this.token.type == 'word') {
                    styles.push(this.token.value);
                } else this.ThrowParseError(this.token, {
                    name: 'Unexpected character'
                })
            }

            last = this.token;

            this.next();

            if (!this.token) this.ThrowParseError(this.tokens[this.tokenIndex - 1], {
                name: 'Syntax error',
                details: 'I expected a \')\''
            })
        }

        if (this.next().type == 'sc') 
            this.next();

        return {
            type: 'styleuse',
            styles: styles
        }
    }

    param() {
        let key = this.token.value;

        if (this.next().value != ':') this.ThrowParseError(this.token, {
            name: 'Syntax error',
            details: 'I expected a \':\', but you gave me \'' + this.token.value + '\''
        })

        this.next();

        return {
            type: 'param',
            key: key,
            value: (() => {
                let list = [];

                while (this.token.type == 'word' || this.token.type == 'unit') {
                    list.push(this.token.value);
                    this.next();

                    if (this.token == undefined) this.ThrowParseError(this.tokens[this.tokenIndex - 1], {
                        name: 'Syntax error',
                        details: 'I expected a ' + chalk.green('\';\'') + ', but you gave me ' + chalk.green('\'' + this.tokens[this.tokenIndex - 1].value + '\'')
                    }) 
                }
                
                if (this.token.type != 'sc') {
                    let errorToken = this.tokens[this.tokenIndex - 1]
                    this.ThrowParseError(this.token, {
                        name: 'Syntax error',
                        details: 'I expected a ' + chalk.green('\';\'') + ', but you gave me ' + chalk.green('\'' +this.token.value + '\'')
                    })
                } else {
                    this.next();
                }
                
                return list;
            })()
        }
    }

    ThrowParseError(token: Token, data: ErrorData) {
        let lineArt = chalk.gray(token.line + '| ');
        console.error(lineArt + this.lines[token.line - 1]);
        console.error(' '.repeat(token.col - 1 + lineArt.length - 10) + chalk.red('~'.repeat(token.value.length)));
    
        if (data.details)
            console.error(data.details);

    
        console.error('\n' + data.name + ' at line ' + chalk.yellow(token.line) + ', column ' + chalk.yellow(token.col));

        if (data.tip)
            console.error('\n' + data.tip);

        process.exit(1);
    }
}

export default Parser;