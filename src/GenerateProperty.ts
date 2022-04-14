function GenerateProperty(property: string) {
    let prop = property.split('-');

    if (prop[0] == 'fn' && prop[1] == 's') {
        if (!prop[2]) return false;
        return { 'font-size': prop[2] }
    }

    if (prop[0] == 'w') {
        if (!prop[1]) return false;
        return { 'width': prop[1] };
    }

    if (prop[0] == 'h') {
        if (!prop[1]) return false;
        return { 'height': prop[1] };
    }

    if (prop[0] == 'm') {
        if (!prop[1] || !prop[2]) return false;

        if (prop[1] == 't') {
            return {'margin-top': prop[2]};
        } else if (prop[1] == 'r') {
            return {'margin-right': prop[2]};
        } else if (prop[1] == 'b') {
            return {'margin-bottom': prop[2]};
        } else if (prop[1] == 'l') {    
            return {'margin-left': prop[2]};
        } else {
            return false;
        }
    }

    if (prop[0] == 'br') {
        if (!prop[1]) return false;
        return {'border-radius': prop[1]};
    }

    if (prop[0] == 'brd') {
        if (!prop[1]) return false;
        return {'border': prop.slice(1).join(' ')};
    }

    if (prop[0] == 'text') {
        if (!prop[1]) return false;

        if (prop[1] == 'c') {
            if (!prop[2]) return false;
            return {'color': prop[2]};
        } else {
            return false;
        }
    }
}

export default GenerateProperty;