var baset = 10
var alturat = 5
var areat = (baset * alturat) / 2
console.log('area del traiangulo es: ' + areat)

var baser = 5
var alturar = 2
var arearec = baser * alturar
console.log('area del rectangulo es: ' + arearec)

var radio = 10
var volues = (4 / 3) * Math.PI * Math.pow(radio, 3)
console.log('El Volumen De La Esfera es: ' + volues)

// generar nombre
var mensaje = 'hola mi nombre es'

function muestraMensaje() {
    mensaje = 'Enrique'
    console.log(mensaje)
}

console.log(mensaje)
muestraMensaje()

// variable global
var nombre = 'Enrique' // variable 
function saludar() {
    if (true) {
        var nombre = 'Eric' // la esta super poniendo dentro de la variable global osea la de arriba
    }

    console.log('hola ' + nombre)
}
//
function saludar10() {
    let i = 0;
    for (i; i < 10; i++) {
        console.log(`hola ${nombre}`);
    }

    console.log(`El valor de i es: ${i}`);
}