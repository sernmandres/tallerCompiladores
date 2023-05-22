// //Entrada
const matrizAFND = [
    ["null","2","4","null"],
    ["A","AC","BD","0"],
    ["B","ERROR","CD","0"],
    ["C","AD","ERROR", "1"],
    ["D","D","ERROR","0"]
]

// const matriz2 = [
//     ["null","2","4","null"],
//     ["AC","ACD","BD","1"],
//     ["BD","D","CD","0"],
//     ["ACD","ACD","BD", "1"],
//     ["D","D","ERROR","0"],
//     ["CD","AD","ERROR","1"],
//     ["AD","ACD","BD","0"],
//     ["ERROR","ERROR","ERROR","0"]
// ]


//Proceso
let matrizAFD = []
let matrizInicial = matrizAFND[1]

console.log("matrizInicial " , matrizInicial)
matrizAFD.push(matrizInicial)


for(let i= 1; i < 8; i++) {
  let simboloIncio = matrizAFD[0][i]
  console.log("simboloIncio " , simboloIncio)

}


function crearMatrizAFD(){
  
}


console.log("Matriz resultado matrizAFD " , matrizAFD)

function quitarLetrasRepetidas(cadena) {
    const letrasUnicas = new Set(cadena);
    return Array.from(letrasUnicas).join('');
  }



//Salida