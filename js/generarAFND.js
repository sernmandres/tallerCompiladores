let new_table = '<tbody>'
let matriz= []
let generateFlag = true
let num_estados = isNaN 
let num_simbolos= isNaN 
let Matriz = []
let resultado = false

generarTabla=() => {
    let simbolos = document.querySelector('input[name="txtSimbolos"]').value 
    console.log("simbolos " , simbolos)
    document.querySelector('td[name="simbolos_entrada"]').outerHTML = '<td name="simbolos_entrada" colspan="'+simbolos+'">Simbolos de entrada</td>'

    if(generateFlag){ 
        num_estados = parseInt(document.querySelector('input[name="txtEstados"]').value)
        num_simbolos = parseInt(document.querySelector('input[name="txtSimbolos"]').value)
        if(isNaN(num_estados) || isNaN(num_simbolos)) {
            alert("Agregar cuantos simbolos y cuantas estados tiene el autómata")
            return 
        }
        console.log("num_estados " , num_estados)
        console.log("num_simbolos " , num_simbolos)
        firtsRow(num_simbolos)

        if(matriz.length == 0){
            var array = []
            matriz.push(array)
        }
        for (let index = 0; index < num_estados; index++) {
            
            var rows="<td><input type='text' onchange='generarMatriz()' style='width: 95%; font-size:16px; font-weight: 600; text-align: center; border: transparent; background-color: rgb(228, 225, 225);'/></td>".repeat(parseInt(num_simbolos)+2)
            
            new_table+="<tr id='"+(index+1)+"'>"+rows+"</tr><hr onclick='eliminarRow("+(index+1)+")'>"
        }
        new_table+='</tbody>'
        document.querySelector('table > tbody').innerHTML =  new_table
        generateFlag = false
    }
    else if(num_estados.length == 0 || num_simbolos.length == 0){
        alert("Debe agregar los datos correctamente")
    }
}

agregarRow=()=>{
    //generar la matriz para guardarla
    generarMatriz()
    //crear el nuevo row
    num_estados++
    let rows="<td><input onchange='generarMatriz()' type='text' style='width: 95%;  font-size:16px; font-weight: 600; text-align: center; background-color: rgb(228, 225, 225);'/></td>".repeat(num_simbolos+2)
    let newTr="<tr id='"+num_estados+"'>"+rows+"</tr><hr onclick='eliminarRow("+num_estados+")'>"
    new_table = new_table.replace("</tbody>", newTr+'</tbody>')
    document.querySelector('table > tbody').innerHTML =  new_table
    //pintar la matriz en tabla
    pintarMatriz()
    generarMatriz()
    pintarMatriz()
}

eliminarRow=(id)=>{
    if(id!=0){
        matriz = matriz.filter((word, index) => index != id);
        document.querySelector('input[name="txtEstados"]').value = matriz.length -1
        new_table = '<tbody>'
        generateFlag = true
        generarTabla()
        pintarMatriz()
    }
}

firtsRow=(number_columns)=>{
    var simbolos_entrada_rows = "<td><input type='text' onchange='generarMatriz()' style='width: 95%;  font-size:16px; font-weight: 600; text-align: center; border: transparent; background-color: rgb(228, 225, 225);'/></td>".repeat(number_columns)
        var rowinit = "<tr id='0'>"+
        "<td><input type='text' value='null' style='display: none;'></td>"
        var rowend =
        "<td><input type='text' value='null' style='display: none;'></td>"+
        "</tr>"
        var nRow = rowinit+simbolos_entrada_rows+rowend
        new_table+=nRow
}

generarMatriz = () =>{
    let pos = 3
    var tdElements = document.querySelectorAll("td")
    for (let index = 0; index < num_estados+1; index++) {
        //console.log("index"+index)
        var array = []
       for (let j = 0; j < num_simbolos+2; j++) {
        //console.log("j"+j)
        let val = tdElements[pos].querySelector('input').value

        if(val != ''){
            array[j] = val
        }else{
            array[j] = null
        }
        pos++
       }
       matriz[index] = array
    }
}

pintarMatriz=()=>{
    matriz.forEach(function(row, index) {
        let htmlRow = document.querySelector("tr[id='"+index+"']");
        row.forEach((it, indexChild) =>{
            htmlRow.querySelectorAll("input")[indexChild].value = it
        })
      })
}

retornarMatriz=()=>{
    Matriz = []
    matriz.forEach((row,index)=>{
        if(index==0) {
            Matriz.push(row)
        }else{
            tempArray = []
            tempRow = []
            row.forEach((it,ind)=>{   
                if(ind!=row.length-1 && ind!=0){
                    if(it==null){
                        it='null'
                    }
                    tempArray.push(it.split(","))
                } 
            })
            tempRow.push(row[0])
            tempRow.push(tempArray)
            tempRow.push(row[row.length-1])
            Matriz.push(tempRow)
        }
    })

    console.log("Matriz resultado " , Matriz)
    if(!isNaN(num_estados) || !isNaN(num_simbolos)) {
        if(validarAFND()){
            alert("Es un automata no deterministico")
            let botonGraficar = document.getElementById("btnGraficar");
            botonGraficar.disabled = false;
        } else {
            alert("Es un automata deterministico")
        let botonGraficar = document.getElementById("btnGraficar");
        botonGraficar.disabled = true;
        }
    }else {
        alert("Debes de primero llenar todo los valores del automata")
        return 
    }

}

function validarAFND() {
    let resultado = false
    for (let i = 1; i < Matriz.length; i++) {
        for (let j = 0; j < Matriz[i][1].length; j++) {
            let temporal = Matriz[i][1][j];
            console.log("temporal = Matriz[i][1][j]; " , temporal = Matriz[i][1][j])
            for (let k = 0; k < temporal.length; k++) {
                let temporalInterno = temporal[k];
                if (temporalInterno === "null") {
                    temporal[k] = "ERROR";
                    resultado = true;
                }

                if(temporal.length > 1 && temporalInterno != "ERROR"){
                    resultado = true;
                }
            }
        }

    }

    console.log("Matriz Matriz ", Matriz)
    return resultado
}
