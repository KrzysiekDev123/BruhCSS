#!/usr/bin/env node

import { program } from 'commander';
import Parser from './parser';
import process from 'process';
import Transpile from './Transpile';
import Lex from './lexer';
import fs from 'fs';

global.styles = {
    'flex': { style: { 'display': 'flex' } },
    'flex-col': { style: { 'flex-direction': 'column' } },
    'flex-row': { style: {'flex-direction': 'row' } },
    'fn-sans-serif': { style: { 'font-family': 'sans-serif' } },
    'bold': { style: { 'font-weight': 'bold' } },
    'round': { style: { 'border-radius': '0.3em' } }
}

program
  .option('-w, --watch')
  .option('-o, --outfile <filename>')
  .parse();

const opts = program.opts();
const file = program.args[0];

if (!file) {
    console.error('Error: File not specified!');
    process.exit(1);
}

if (opts.watch)
    console.warn('Warning: --watch is not implemented yet!');

if (fs.existsSync(file)) {
    const main = fs.readFileSync(file, {encoding: 'utf8'})
    const parser = new Parser(Lex(main), main.split('\n'));
    const AST = parser.parse();

    let transpiled: string = Transpile(AST).trim();

    fs.writeFileSync(opts.outfile || 'main.css', transpiled)
} else {
    console.error('Error: Couldn\'t find file ' + file);
    process.exit(1);
}