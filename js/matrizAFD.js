let bodyMatrizFDA = "<tbody"

let estadosAcepta = []

function generarMatrizAFD(matrizResultado, finalStates, alphabet) {


    estadosAcepta = finalStates

    let nSimbolos = parseInt(document.querySelector('input[name="txtSimbolos"]').value)

    document.querySelector('#tablaAFD td[name="simbolos_entrada"]').outerHTML = '<td name="simbolos_entrada" colspan="' + nSimbolos + '">Simbolos de entrada</td>'

    firtsRowAFD(alphabet)
    joined = []
    matrizFDA = []

    //agrupar estados
    for (let index = 0; index < matrizResultado.length; index += nSimbolos) {
        let temporal = []
        for (let j = index; j < (index+nSimbolos); j++) {
            temporal.push(matrizResultado[j])
        }
        joined.push(temporal)
    }


    //crearMatriz
    joined.forEach(it => {
        estados = ""
        items = []
        it.forEach((item,index)=>{
            estado = item[0]
            items.push(item[1])
        })

        row = [estado, items]
        matrizFDA.push(row)
    })

    //crear tbody repecto a la matriz

    matrizFDA.forEach((it, index) => {
        let state = it[0].split(",").join("")
        var rows = "<td>" + state + "</td>"
        it[1].forEach((item) => {
            text = item.toString().split(",").join("")
            let row = "<td>" + text + "</td>"
            rows += row
        })


        estadosAcepta.includes(state) ? rows +="<td>"+1+"</td>"  : rows +="<td>"+0+"</td>"

        //rows +="<td>"+1+"</td>"
        bodyMatrizFDA += "<tr id='" + (index + 1) + "'>" + rows + "</tr>"
    })

    //mostrarMatriz
    document.querySelector('#tablaAFD > tbody').innerHTML = bodyMatrizFDA
}


firtsRowAFD = (alphabet) => {

    var simbolos_entrada_rows = ""


    alphabet.forEach(it=>{

        simbolos_entrada_rows+="<td>"+it+"</td>"
    })
    var rowinit = "<tr id='1'>" +
        "<td></td>"
    var rowend =
        "<td></td>" +
        "</tr>"
    var nRow = rowinit + simbolos_entrada_rows + rowend
    bodyMatrizFDA += nRow
}
