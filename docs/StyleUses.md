# Style uses

A *styleuse* copies all properties from one style, to another one. 

<br>

**Warning: id does NOT override _nested_  properties, but I'm gonna fix it soon (most probably in the next release)**
<br>
<br>

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

@style secondStyle {
    @(myStyle);
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

.secondStyle {
    color: red;
    background-color: blue;
}

.secondStyle:hover {
    color: blue;
    background-color: red;
}
```

<br><br>
But, if we want to change the color:

```css 
@style myStyle {
    color: red;
    background-color: blue;

    &:hover {
        color: blue;
        background-color: red;
    }
}

@style secondStyle {
    @(myStyle);
    color: green;
}
```

We will get:
```css
.myStyle {
    color: red;
    background-color: blue;
}

.myStyle:hover {
    color: blue;
    background-color: red;
}

.secondStyle {
    color: green; /* The color has been overriden! */
    background-color: blue;
}

.secondStyle:hover {
    color: blue;
    background-color: red;
}
```

<br><br>
It also works for the selector styles:
```css
@style bgRedAndColorBlue {
    background-color: red;
    color: blue;
}

#averyniceid {
    @(bgRedAndColorBlue);
}
```

```css
.bgRedAndColorBlue {
    background-color: red;
    color: blue;
}

#averyniceid {
    background-color: red;
    color: blue;
}
```