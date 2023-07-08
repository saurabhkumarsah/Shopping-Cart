export const isValidField = (value) => {
    if (typeof value == 'undefined' || typeof value == null) return false
    if (typeof value == 'string' && value.trim().length == 0) return false
    return true
}

export const trimSpace = (value) => {
    if (typeof value == 'string') {
        return value.trim()
    }
    return value
}

export const isValidPhone = (value) => {
    let regex = /^(\+91|\+91\-|0)[6789]\d{9}$/
    return regex.test(value)
}

export const isValidEmail = (value) => {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(value)
}

export const isValidPass = (value) => {
    if (value.length < 8 && value.length > 15) return false
    return true
}

export const isValidSize = (value) => {
    let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    let flag = true;
    if (value.length < 1) return false
    for (let i = 0; i < value.length; i++) {
        if(arr.indexOf(value[i]) == -1) {
            flag = false
            break;
        }
    }
    if (flag) {
        return true
    } else {
        return false
    }
} 
