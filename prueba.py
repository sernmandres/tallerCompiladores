import pandas as pd

nfa = {}
n = int(input("Numero de estados: "))
t = int(input("Numero de caminos: "))
for i in range(n):
    state = input("Introduce el nombre del estado: ")
    nfa[state] = {}
    for j in range(t):
        path = input("Introduce el camino: ")
        print("Introduce el estado fnal desde el estado {} por el camino {}:" .format(state,path))
        reaching_state = [x for x in input().split()]
        nfa[state][path] = reaching_state
        
print("\nImprimir el AFND en tabla:- ")
nfa_table = pd.DataFrame(nfa)
print(nfa_table.transpose())

print("Introducir el estad de aceptacion del AFND: ")
nfa_final_state = [x for x in input().split()]

new_states_list = []
dfa = {}
keys_list = list(list(nfa.keys())[0])
path_list = list(nfa[keys_list[0]].keys())

#################################################3

dfa[keys_list[0]] = {}

for y in range(t):
    var = "".join(nfa[keys_list[0]][path_list[y]])
    dfa[keys_list[0]][path_list[y]] = var
    if var not in keys_list:
        new_states_list.append(var)
        keys_list.append(var)
        
###################################################

while len(new_states_list) != 0:
    dfa[new_states_list[0]] = {}
    for _ in range(len(new_states_list[0])):
        for i in range(len(path_list)):
            temp = []
            for j in range(len(new_states_list[0])):
                temp += nfa[new_states_list[0][j]][path_list[i]]
            s = ""
            s = s.join(temp)
            if s not in keys_list:
                new_states_list.append(s)
                keys_list.append(s)
            dfa[new_states_list[0]][path_list[i]] = s
                
    new_states_list.remove(new_states_list[0])
        
        
#########################################################

#imprimre el automata finito

print("\nImprimir tabla AFD:- ")
dfa_table = pd.DataFrame(dfa)
print(dfa_table.transpose())

dfa_states_list = list(dfa.keys())
dfa_final_states = []

for x in dfa_states_list:
    for i in x:
        if i in nfa_final_state:
            dfa_final_states.append(x)
            break
        
print("\n Estados de aceptacion del nuevo automata(AFND): ",dfa_final_states) #Imprime los estados de aceptacion del automata