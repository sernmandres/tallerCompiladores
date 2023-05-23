//Matriz para probar que funciona sin necesidad de llenar todo el formulario

// let Matriz = [
//     ["null", "2", "4", "null"],
//     ["A", [["A", "C"], ["B", "D"],], "0",],
//     ["B", [["null"], ["C", "D"]], "0"],
//     ["C", [["A", "D"], ["null"]], "1"],
//     ["D", [["D"], ["null"]], "0"],
// ];

function validar() {
    console.log("validarAFND() " , validarAFND())
    if (validarAFND()) {
        console.log("Entro en validar() nfa")
        //Estados del automata
        let NFAFinal = {};
        let states = estadosNoRepetidos()
        let alphabet = alfabetos()
        let finalStates = estadosAceptacion()
        let transitions = estadosTransicion(alphabet)

        console.log("alphabet alphabet " , alphabet)
        let initialState = Matriz[1][0]

        NFAFinal.initialState = initialState
        NFAFinal.finalStates = finalStates
        NFAFinal.states = states
        NFAFinal.alphabet = alphabet
        NFAFinal.transitions = transitions

        console.log("NFAFinal NFAFinal" , NFAFinal)

        let dfa = generateDFA(
            new NFA(
              NFAFinal.initialState,
              NFAFinal.finalStates,
              NFAFinal.states,
              NFAFinal.alphabet,
              NFAFinal.transitions
            )
          );
            
        return {
            existe: true,
            dfa: dfa
        }
        // graficar(dfa)
        
       

    } else {
        console.log("El automata es deterministico, no se puede realizar")
        return {
            existe: false
        }
    }
}

function estadosNoRepetidos() {
    states = []
    let error_counter = 0

    Matriz.forEach((row, index) => {
        if (index != 0) {
            states.push(row[0])
            let len = row.length
            console.log("rowwwww " , row)
            row.forEach((it, indexit) => {
                if (indexit != 0 && indexit != len - 1) {
                    console.log("valor de it " , it)
                    it.forEach(item => {
                        if (!item.includes("ERROR")) {
                            if (item.length == 1) {
                                states.push(item[0])
                            } else {
                                states.push(item)
                            }

                        } else {
                            error_counter++
                        }
                    })
                }
            })
        }
    })
    if (error_counter > 0) states.push("ERROR")
    states = [... new Set(states)]

    return states
}

function alfabetos() {
    let temporalAlfabeto = [];

    for (let i = 0; i < Matriz[0].length; i++) {
        if (Matriz[0][i] != "null") {
            temporalAlfabeto.push(Matriz[0][i]);
        }
    }

    return temporalAlfabeto
}

function estadosAceptacion() {
    let temporalEstadosFinales = [];
    for (let i = 1; i < Matriz.length; i++) {
        if (Matriz[i][2] === "1") {
            temporalEstadosFinales.push(Matriz[i][0]);
        }
    }

    return temporalEstadosFinales;
}

function estadosTransicion(alphabet) {
    let transicion = []

    for (let i = 1; i < Matriz.length; i++) {
        console.log(" Matriz Matriz ", Matriz[i])
        //Ir a cada transicion
        for (let j = 0; j < Matriz[i][1].length; j++) {
            transicion.push(
                {
                    nextStates: Matriz[i][1][j],
                    state: Matriz[i][0],
                    symbol: alphabet[j]
                }
            )
        }
    }

    return transicion
}