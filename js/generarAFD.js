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

    console.log("this.initialState -> ", initialState);
    console.log("this.finalStates -> ", finalStates);
    console.log("this.states -> ", states);
    console.log("this.alphabet -> ", alphabet);
    console.log("this.transitions -> ", transitions);
  }

  toDotString() {
    let dotStr = " digraph fsm { \n";
    dotStr += " rankdir=LR; \n";
    dotStr += ' size="8,5"; \n';

    //Todos los estados de aceptacion
    let prueba = "";

    let matrizResultado = []
    let estadoActual;
    let estadoTransicion = ""




    if (!this.finalStates.includes(this.formatDotState(this.initialState))) {
      dotStr +=
        " node [shape = doublecircle]; " + this.finalStates.join(" ,") + " \n";    
      dotStr += " node [shape = circle];\n"; 
      dotStr += "Inicio[shape=box]"   

      prueba +=" node [shape = doublecircle]; " + this.finalStates.join(" ,") + " \n";
      prueba += " node [shape = circle];\n";

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

    console.log("(this.transitions.length --> " , (this.transitions.length))

    if (this.transitions.length) {
      for(let x = 0; x < this.transitions.length; x++) {
        estadoActual = this.transitions[x]
        estadoTransicion = ""
        // [ [estado,[estados a los que va], acepta / recahza]]
        matrizResultado.push([this.transitions[x].state,this.transitions[x].nextStates])
      }
      console.log("this.transitions.length.. " , this.transitions.length)
      for (let i = 0; i < this.transitions.length; i++) {
        let t = this.transitions[i];
        console.log("t.state, " , t.state)

        dotStr +=
          " " +
          this.formatDotState(t.state) +
          " -> " +
          this.formatDotState(t.nextStates) +
          " [label= " +
          t.symbol +
          "] \n";

          console.log(" this.formatDotState(t.state) "  , this.formatDotState(t.state) )

          console.log(" this.formatDotState(t.nextStates) "  , this.formatDotState(t.nextStates) )
          console.log("estadoActual " , estadoActual)
          console.log("matrizResultado " , matrizResultado)

          estadoTransicion += this.formatDotState(t.nextStates)
          console.log("estadoTransicion " , estadoTransicion)
      }
     
    } 
    console.log("cantidad de estados :: " , this.alphabet)

    for(let a= 0; a < this.alphabet.length; a++ ) {
      console.log("aaaa " , this.alphabet[a])
      dotStr += `ERROR -> ERROR [label= ${this.alphabet[a]}] \n`
    }  

    dotStr += " }";
    console.log("prueba --> " , prueba)
    console.log("dotStr ::::: ", dotStr);
    console.log("dotStr ::::: a ", typeof(dotStr));

    return dotStr;
  }


  formatDotState(state_str) {
    console.log("state_str ", state_str);
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

//To find the E{qi} of each state!
function eClosureOfState(state, transitions) {
  //Ssate: recorre cada una de las posiciones del objeto NFATest.state
  //transitions: recorre cada una de las posiciones del objeto NFATest.transitions
  console.log("eClosureOfState state ", state);
  console.log("eClosureOfState transitions ", transitions);

  if (!(typeof state === "string" || state instanceof String))
    throw new Error("Expected a single state input as a string");

  if (!Array.isArray(transitions))
    throw new Error("Expected transitions parameter to be an array");

  let e_closure = [];

  console.log("Antes e_closure :::: ", e_closure);
  e_closure.push(state);
  console.log("Despues e_closure :::: ", e_closure);

  for (let i = 0; i < transitions.length; i++) {
    let t = transitions[i];
    console.log("transitions[i] --> ", transitions[i]);
    // Epsilon transitions
    console.log("t.symbol.trim() === ", t.symbol.trim() === "");
    console.log("t.symbol.trim() ", t.symbol.trim());
    console.log("t.symbol ", t.symbol);

    //No funciona actualmente - Es para validar que si no se puso el simbolo para donde va los estados
    //o si el simbolo es ese raro \u03B5 haga algo pero no aplica para nosotros. Se puede borrar
    if (t.symbol.trim() === "" || t.symbol === "\u03B5") {
      console.log("entro a evaluar...");
      // We start from state
      if (state === t.state) {
        if (!Array.isArray(t.nextStates))
          throw new Error("Expected nextStates in NFA to be an array");

        for (let j = 0; j < t.nextStates.length; j++) {
          //check if the state is already part of the closure
          if (!e_closure.includes(t.nextStates[j])) {
            //If not we add it!
            e_closure.push(t.nextStates[j]);

            // Then check the closure for the newly added state (recursive)
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

  console.log("return e_closure :: ", e_closure);
  return e_closure;
}

function generateDFA(nfa) {
  console.log("nfa --> ", nfa);

  // State es A. El primer estado del automata
  let state = nfa.initialState;
  console.log("state generateDFA ", state);

  let initial_closure = eClosureOfState(state, nfa.transitions);
  console.log("initial_closure ", initial_closure);
  console.log("type initial_closure ", typeof initial_closure);
  // The initial state of our DFA is the eclosure of the initial state of the NFA
  let dfa_initialState = initial_closure.join();
  console.log("initial_closure.join() ", dfa_initialState);
  console.log("type nitial_closure.join() ", typeof dfa_initialState);
  let dfa_states = [];

  //We add the initial state of our DFA to the states of the DFA.
  dfa_states.push(dfa_initialState);
  console.log("dfa_states.push(dfa_initialState) ", dfa_states);

  let dfa_transitions = [];
  let dfa_final_states = [];

  //An array with states that i have to check for nextStates
  let dfa_stack = [];
  dfa_stack.push(dfa_initialState);

  //Tiene el primer valor que es A
  console.log("dfa_stack.push(dfa_initialState) ", dfa_stack);

  //-----------------------------------------------------------------
  // Check if the initial state is also a final State.
  let initial_is_final = false;
  for (let i = 0; i < nfa.finalStates.length; i++) {
    console.log(
      "if initial_closure.includes(nfa.finalStates[i]) ",
      initial_closure.includes(nfa.finalStates[i])
    );
    console.log(
      "valor initial_closure.includes(nfa.finalStates[i] ",
      nfa.finalStates[i]
    );
    if (initial_closure.includes(nfa.finalStates[i])) {
      //dfa_final_states.push(dfa_initialState);
      initial_is_final = true;
    }
  }

  if (initial_is_final) {
    dfa_final_states.push(dfa_initialState);
  }
  //------------------------------------------------------------------
  console.log("dfa_stack length  ", dfa_stack);
  while (dfa_stack.length > 0) {
    console.log("dentro del while dfa_stack length  ", dfa_stack.length);
    // As long as we have states to check
    let state = dfa_stack.pop(); // We take the next state we have to check
    console.log("Pop despues state ", state);

    // Siempre va hacer falso, a este punto ya no es un arreglo sino que es un string
    console.log("Array.isArray(state) ", state);
    console.log("Array.isArray(state) ", Array.isArray(state));
    if (Array.isArray(state)) {
      state = state.join(",");
      state = state.split(",");
    } else {
      state = state.split(",");
    }
    console.log("estate luego de validar con  Array.isArray(state) ", state);
    console.log("state state state ", state);

    //Valida siempre los estados que existen: en este caso 2 y 4
    console.log("nfa.alphabet ", nfa.alphabet);
    console.log("nfa.alphabet.length ", nfa.alphabet.length);
    for (let j = 0; j < nfa.alphabet.length; j++) {
      //We see where we are going with each symbol for each state in the state ([q0,q1,q2,q3]).
      let next_states_union = []; //where we are going with the symbol we choose.
      let to_state = []; // where we are finally going E{qi} U E{qj} U ...

      //Recorre cada uno de los estados separados ejemplos : ["A" ,"C"]
      for (let x = 0; x < state.length; x++) {
        // We find the next states.

        let ns = findNextStates(state[x], nfa.alphabet[j], nfa.transitions);
        console.log("valor de ns ", ns);

        //aca se puede controlar eso
        console.log("nsssssss ", ns);
        for (let k = 0; k < ns.length; k++) {
          console.log("ns[k ", ns[k]);
          if (!next_states_union.includes(ns[k])) {
            next_states_union.push(ns[k]);
          }
        }
      }
      console.log("next_states_union", next_states_union);

      //Codigo de andres
      for (let v = 0; v < next_states_union.length; v++) {
        if (next_states_union[v] == "ERROR" && next_states_union.length != 1) {
          console.log("Existe un error pero no está solo");
          // next_states_union[v] = " ";
          let valorEliminar = 'ERROR';
          let indiceTemporal = v
          let indice = next_states_union[v].indexOf(valorEliminar);
           next_states_union.splice(v, 1)
          console.log("indice " , indice)
          console.log(
            "next_states_union.slice(v, 1) ", next_states_union.slice(v, 1)
          );
          

          console.log("temporalA ", next_states_union);
          console.log("indiceTemporal ", indiceTemporal);
        }
      
       
      }

      if (next_states_union.length > 0) {
        // if we have next states we are findind the E{q} of them, we add a new transition, a new state if need.
        for (let p = 0; p < next_states_union.length; p++) {
          to_state = to_state.concat(
            eClosureOfState(next_states_union[p], nfa.transitions)
          );

          console.log("FOR to_state ", to_state);
        }
        to_state = [...new Set(to_state)];
        console.log("[...new Set(to_state)] ", to_state);
        to_state = to_state.sort().join(); // we combine the states (q1,q2 = q1q2)
        console.log("to_state.sort().join() ", to_state);

        dfa_transitions.push(
          new Transition(state.join(), to_state, nfa.alphabet[j])
        );
        console.log("dfa_transitions -----", dfa_transitions);

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

        console.log("dfa_final_states ", dfa_final_states);
      }
    }
  }

  dfa_states = [...new Set(dfa_states)];
  console.log("dfa_states fuera del if --> ", dfa_states);

  console.log("perdido dfa_final_states ", dfa_final_states);
  for (let l = 0; l < dfa_final_states.length; l++) {
    dfa_final_states[l] = dfa_final_states[l].replaceAll(",", "");
  }
  console.log("dfa_final_states[l] ", dfa_final_states);

  console.log(dfa_initialState);
  console.log(dfa_final_states);
  console.log(dfa_states);
  console.log(dfa_transitions);

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
  console.log("findNextStates state ", state);
  console.log("findNextStates symbol ", symbol);
  console.log("findNextStates transitions ", transitions);
  let next_states = [];

  for (let i = 0; i < transitions.length; i++) {
    let t = transitions[i];

    if (t.state === state && t.symbol === symbol) {
      console.log("valor de next_State dentro del for i ", next_states);
      for (let j = 0; j < t.nextStates.length; j++) {
        console.log("valor de next_State dentro del for j ", next_states);
        console.log(
          "!next_states.includes(t.nextStates[j]) ",
          !next_states.includes(t.nextStates[j])
        );
        console.log("!next_states.includes(t.nextStates[j]) ", t.nextStates[j]);
        if (!next_states.includes(t.nextStates[j])) {
          console.log("if !next_states.includes(t.nextStates[j])");
          next_states.push(t.nextStates[j]);
        }
      }
    }
  }

  console.log("return next_states ", next_states);
  return next_states;
}
