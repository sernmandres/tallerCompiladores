
var new_table = '<tbody>'

generarTabla=()=>{
    let estados = document.querySelector('input[name="txtEstados"]').value 
    let simbolos = document.querySelector('input[name="txtSimbolos"]').value

    console.log("estados " , estados)
    console.log("simbolos " , simbolos)
    
    document.querySelector('td[name="simbolos_entrada"]').outerHTML = '<td name="simbolos_entrada" colspan="'+ simbolos+ '">Simbolos de entrada</td>'

    console.log("estados.length " , estados.length)
    if(estados.length > 0 && simbolos.length > 0){
        firtsRow(simbolos);
        for (let index = 0; index < estados; index++) {
            //alert("number of simbolos"+simbolos+2)
            var rows="<td><input type='text' style='width: 95%;'/></td>".repeat(parseInt(simbolos)+2)
            new_table+="<tr>"+rows+"</tr>"
        }
        document.querySelector('table > tbody').innerHTML =  new_table+'</tbody>'
    }else{
        alert("Debe agregar los datos correctamente")
    }

    new_table = '<tbody>'


}

firtsRow=(number_columns)=>{
    console.log("number_columns " , number_columns)
    var simbolos_entrada_rows = "<td><input type='text' style='width: 95%;'/></td>".repeat(number_columns)
        var rowinit = "<tr>"+
        "<td><input type='text' value='' disabled></td>"
        var rowend =
        "<td><input type='text' value='' disabled></td>"+
        "</tr>"
        var nRow = rowinit+simbolos_entrada_rows+rowend
        new_table+=nRow    
}


generarMatriz = () =>{

    let estados = document.querySelector('input[name="txtEstados"]').value
    let simbolos = document.querySelector('input[name="txtSimbolos"]').value

    let pos = 3

    var tdElements = document.querySelectorAll("td")
    var matriz= []

    
    for (let index = 0; index < parseInt(estados)+1; index++) {
        //console.log("index"+index)
        var array = []
       for (let j = 0; j < parseInt(simbolos)+2; j++) {
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


    matriz.forEach(function(entry) {
        console.log(entry)
      });

    console.log("Forma de los datos ")
    console.log("matriz  " , matriz)
}
