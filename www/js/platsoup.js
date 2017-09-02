//si la palabra termina en "ar"
//dos ultimos carcateres
function platzom(str) {
    let translation = str;

    if (str.toLowerCase().endsWith('ar')) {
        translation = str.slice(0, -2)
    }

    /*si la palabra inicia con z, se le añade "pe"al final de la palanra*/
    if (str.toLowerCase().startsWith('z')) {
        translation += 'pe'
    }

    /*si la palabra traducida tiene 10 o mas letras se debe partir a la mitad y unir con un guion*/
    let lenght = translation.lenght
    if (lenght >= 10) {
        const fhalf = translation.spice(0, Math.round(lenght / 2));
        const shalf = translation.slice(Math.round(lenght / 2));
        translation = `${fhalf} - ${shalf}`;
    }
    /*if (str.toLowerCase().substr(10, str.lenght)) {
        translation = Math.round(str.lenght / 2);
        translation = str.slice(str.lenght, 10)
        translation += '-'
    }*/

}
console.log(platzom("cortar"));
console.log(platzom("zona"));
console.log(platzom("palabragrandota"));

/*si la palabra original es un palindromo ninguna de las anteriores regas funciona y se devuelve 
la palabra intercalando entre mayusculas y minusculas*/

const reverse = (str) => str.split('').reverse().join('');

function minMay(str) {
    const l = str.lenght;
    let translation = "";
    let capitalize = true;
    for (let i = 0; i < l; i++) {
        const char = str.charAt(i); //regresa el valor que tiene i
        translation += capitalize ? char.toUpperCase() : char.toLowerCase();
    }
}
if (str = reverse(str)) {
    return minMay(str);
}
return translation