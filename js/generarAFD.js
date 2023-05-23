class Transition {
  constructor(state, nextStates, symbol) {
    if (!(typeof state === "string" || state instanceof String))
      throw new Error("Expected a single state (string)");

    if (!Array.isArray(nextStates)) {
      console.warn("Expected nextStates in transition to be an array");
      let arr = [];
      arr.push(nextStates.toString());
      nextStates = arr;
    }

    if (!(typeof symbol === "string" || symbol instanceof String))
      throw new Error("Expected a string symbol");

    this.state = state;
    this.nextStates = nextStates;
    this.symbol = symbol;
  }
}

//Empieza la generacion de objeto NFA
class NFA {
  constructor(initialState, finalStates, states, alphabet, transitions) {
    if (!(typeof initialState === "string" || initialState instanceof String))
      throw new Error("Expected a single initial state (string)");

    if (!Array.isArray(finalStates)) {
      console.warn("Expected finalStates in NFA to be an array");
      let arr = [];
      arr.push(finalStates.toString());
      finalStates = arr;
    }

    if (!Array.isArray(alphabet)) {
      console.warn("Expected alphabet in NFA to be an array");
      let arr = [];
      arr.push(alphabet.toString());
      alphabet = arr;
    }

    if (!Array.isArray(transitions)) {
      console.warn("Expected transitions in NFA to be an array");
      let arr = [];
      arr.push(transitions);
      transitions = arr;
    }

    //Make sure states cannot be named INITIAL_STATE
    this.initialState = initialState;
    this.finalStates = finalStates;
    this.states = states;
    this.alphabet = alphabet;
    this.transitions = transitions;
  }

  toDotString() {
    let dotStr = " digraph fsm { \n";
    dotStr += " rankdir=LR; \n";
    dotStr += ' size="8,5"; \n';

    //Todos los estados de aceptacion

    let matrizResultado = []
    let estadoActual;
    let estadoTransicion = ""

    if (!this.finalStates.includes(this.formatDotState(this.initialState))) {
      dotStr +=
        " node [shape = doublecircle]; " + this.finalStates.join(" ,") + " \n";    
      dotStr += " node [shape = circle];\n"; 
      dotStr += "Inicio[shape = box]"   
    } else {
      dotStr +=
        " node [shape = doublecircle]; " +
        this.formatDotState(this.initialState) +
        " \n";
      dotStr +=
        " node [shape = doublecircle]; " + this.finalStates.join(" ,") + " \n";
      dotStr += " node [shape = circle];\n";
    }
    
    dotStr += " Inicio -> " + this.formatDotState(this.initialState) + " \n";

    if (this.transitions.length) {
      for(let x = 0; x < this.transitions.length; x++) {
        estadoActual = this.transitions[x]
        estadoTransicion = ""
        // [ [estado,[estados a los que va], acepta / recahza]]
        matrizResultado.push([this.transitions[x].state,this.transitions[x].nextStates])
      }
      for (let i = 0; i < this.transitions.length; i++) {
        let t = this.transitions[i];
        dotStr +=
          " " +
          this.formatDotState(t.state) +
          " -> " +
          this.formatDotState(t.nextStates) +
          " [label= " +
          t.symbol +
          "] \n";

          estadoTransicion += this.formatDotState(t.nextStates)
      }

      console.log("matrizResultado " , matrizResultado)

      generarMatrizAFD(matrizResultado, this.finalStates, this.alphabet)
     
    } 

    let agregarEstadoError = false
    for(let i =0; i < matrizResultado.length; i++) {
      let recorrerTransiciones = matrizResultado[i][1]
      if(recorrerTransiciones[0] == "ERROR") {
        agregarEstadoError= true
      }
    }

    if(agregarEstadoError) {
      for(let a= 0; a < this.alphabet.length; a++ ) {
        dotStr += `ERROR -> ERROR [label= ${this.alphabet[a]}] \n`
      }  
    }
    
    dotStr += " }";
    return dotStr;
  }


  formatDotState(state_str) {
    state_str = state_str.toString();
    if (state_str.includes(",")) {
      state_str = state_str.replaceAll(",", "");
      return state_str;
    } else {
      return state_str;
    }
  }
}

//Finaliza objeto
function eClosureOfState(state, transitions) {


  if (!(typeof state === "string" || state instanceof String))
    throw new Error("Expected a single state input as a string");

  if (!Array.isArray(transitions))
    throw new Error("Expected transitions parameter to be an array");

  let e_closure = [];
  e_closure.push(state);

  for (let i = 0; i < transitions.length; i++) {
    let t = transitions[i];;
    if (t.symbol.trim() === "" || t.symbol === "\u03B5") {

      if (state === t.state) {
        if (!Array.isArray(t.nextStates))
          throw new Error("Expected nextStates in NFA to be an array");

        for (let j = 0; j < t.nextStates.length; j++) {
          if (!e_closure.includes(t.nextStates[j])) {
            e_closure.push(t.nextStates[j]);
            let sub_e_closure = eClosureOfState(t.nextStates[j], transitions);
            for (let z = 0; z < sub_e_closure.length; z++) {
              if (!e_closure.includes(sub_e_closure[z])) {
                e_closure.push(sub_e_closure[z]);
              }
            }
          }
        }
      }
    }
  }

  return e_closure;
}

function generateDFA(nfa) {

  // State es A. El primer estado del automata
  let state = nfa.initialState;

  let initial_closure = eClosureOfState(state, nfa.transitions);
  // The initial state of our DFA is the eclosure of the initial state of the NFA
  let dfa_initialState = initial_closure.join();
  let dfa_states = [];

  //We add the initial state of our DFA to the states of the DFA.
  dfa_states.push(dfa_initialState);
  let dfa_transitions = [];
  let dfa_final_states = [];

  //An array with states that i have to check for nextStates
  let dfa_stack = [];
  dfa_stack.push(dfa_initialState);

  let initial_is_final = false;
  for (let i = 0; i < nfa.finalStates.length; i++) {
    if (initial_closure.includes(nfa.finalStates[i])) {
      //dfa_final_states.push(dfa_initialState);
      initial_is_final = true;
    }
  }

  if (initial_is_final) {
    dfa_final_states.push(dfa_initialState);
  }
  //------------------------------------------------------------------
  while (dfa_stack.length > 0) {
    // As long as we have states to check
    let state = dfa_stack.pop(); // We take the next state we have to check

    // Siempre va hacer falso, a este punto ya no es un arreglo sino que es un string
    if (Array.isArray(state)) {
      state = state.join(",");
      state = state.split(",");
    } else {
      state = state.split(",");
    }

    //Valida siempre los estados que existen: en este caso 2 y 4
    for (let j = 0; j < nfa.alphabet.length; j++) {
      //We see where we are going with each symbol for each state in the state ([q0,q1,q2,q3]).
      let next_states_union = []; //where we are going with the symbol we choose.
      let to_state = []; // where we are finally going E{qi} U E{qj} U ...

      //Recorre cada uno de los estados separados ejemplos : ["A" ,"C"]
      for (let x = 0; x < state.length; x++) {
        // We find the next states.

        let ns = findNextStates(state[x], nfa.alphabet[j], nfa.transitions);
        for (let k = 0; k < ns.length; k++) {
          if (!next_states_union.includes(ns[k])) {
            next_states_union.push(ns[k]);
          }
        }
      }

      for (let v = 0; v < next_states_union.length; v++) {
        if (next_states_union[v] == "ERROR" && next_states_union.length != 1) {
           next_states_union.splice(v, 1)
        }
      
       
      }

      if (next_states_union.length > 0) {
        // if we have next states we are findind the E{q} of them, we add a new transition, a new state if need.
        for (let p = 0; p < next_states_union.length; p++) {
          to_state = to_state.concat(
            eClosureOfState(next_states_union[p], nfa.transitions)
          );
        }
        to_state = [...new Set(to_state)];
        to_state = to_state.sort().join(); // we combine the states (q1,q2 = q1q2)
        dfa_transitions.push(
          new Transition(state.join(), to_state, nfa.alphabet[j])
        );
        // We add if needed the stateto our dfa_states
        if (!dfa_states.includes(to_state)) {
          dfa_states.push(to_state);
          dfa_stack.push(to_state);
        }

        // We check if the new state is a final state
        to_state = to_state.split(",");

        for (let w = 0; w < nfa.finalStates.length; w++) {
          if (to_state.includes(nfa.finalStates[w])) {
            dfa_final_states.push(to_state.join());
          }
        }
        dfa_final_states = [...new Set(dfa_final_states)]; // We remove the duplicates
      }
    }
  }

  dfa_states = [...new Set(dfa_states)];
  for (let l = 0; l < dfa_final_states.length; l++) {
    dfa_final_states[l] = dfa_final_states[l].replaceAll(",", "");
  }

  return new NFA(
    dfa_initialState,
    dfa_final_states,
    dfa_states,
    nfa.alphabet,
    dfa_transitions
  );
}

//To find the next states of a given state with a specific symbol
function findNextStates(state, symbol, transitions) {
  let next_states = [];

  for (let i = 0; i < transitions.length; i++) {
    let t = transitions[i];

    if (t.state === state && t.symbol === symbol) {

      for (let j = 0; j < t.nextStates.length; j++) {
        if (!next_states.includes(t.nextStates[j])) {
          next_states.push(t.nextStates[j]);
        }
      }
    }
  }

  return next_states;
}
