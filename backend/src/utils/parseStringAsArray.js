module.exports = function paserStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim());
}