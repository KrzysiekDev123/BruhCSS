# Styles

A *style* is a set of rules, that shows how does an element look. 
It can contain normal CSS properties, [styleuses](./Styleuse.md), and nested properties with selectors (hereinafter referred to as *selector styles*).

A style definition starts with the `@style` keyword, followed by the style name, and finally - curly brackets, between which there are its styles.

Example:
```css
@style myStyle {
    color: red;
    background-color: blue;

    &:hover {
        color: blue;
        background-color: red;
    }
}
```

Output:
```css
.myStyle {
    color: red;
    background-color: blue;
}

.myStyle:hover {
    color: blue;
    background-color: red;
}
```