function StyleObjectToString(obj: any) {
    let keys = Object.keys(obj);
    let result = '';

    for (let key of keys) {
        result += `    ${key}: ${obj[key]};\n`;
    }

    return result;
}

export { StyleObjectToString };