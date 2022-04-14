# & Selector

When a selector starts with `&`, the transpiler will remove the space before it.

To understand this better, let's look at an example
```css
@style someStyle {
    :hover {
        color: red;
    }
}
```
Because there is no `&` at the beggining, so the output will be
```css
.someStyle :hover {
    color: red;
}
```
And this won't work. Just add the `&` to remove the space.
```css
@style someStyle {
    &:hover {
        color: red;
    }
}
```
```css
.someStyle:hover {
    color: red;
}
```