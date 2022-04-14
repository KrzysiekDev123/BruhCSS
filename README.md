# BruhCSS

<br>

### **Current features:**
1. Defining styles
2. Applying defined styles to other styles
3. Applying defined styles to selector styles
4. Built-in styles
5. Nesting styles

<br>

### **Planned features:**
1. Importing and exporting
2. Private and public style properties
3. Full CSS compatibility
4. Variables
5. Functions
6. Comments (sorry but not implemented yet)
7. Better property overwriting

Yeah so that's a lot of work!

<br>

### **Example code:**
```css
@style buttonStyle {
    @(fn-sans-serif, round, text-white);
    @(w-6em, h-3em);
    background-color: lightgreen;

    &:hover {
        color: green;
        @(bold);
    }
}
```
### **Result**:
```css
.buttonStyle {
    font-family: sans-serif;
    border-radius: 0.3em;
    color: white;
    width: 6em;
    height: 3em;
    background-color: lightgreen;
}

.buttonStyle:hover {
    color: green;
    font-weight: bold;
}
```

<br>
<br>
<br>


## Usage:
1. Download the npm package by `npm i bruhcss`
2. To transpile a file, type in the terminal `npx bruhcss <filename>` . If you want to specify an out file, add the flag `-o <filename>`


**Coming soon: `--watch` flag**



**Bruh**