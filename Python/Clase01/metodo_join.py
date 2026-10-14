
# help(str.join)

tupla_strings = ("Hola", "Mundo", "Python")
mensaje_unido = " ".join(tupla_strings)
print(mensaje_unido)

lista_strings = ["Hola", "Mundo", "Python"]
mensaje_unido_lista = " ".join(lista_strings)
print(mensaje_unido_lista)

"""
El método join() se utiliza para unir los elementos de un iterable (como una lista o una tupla) en un solo string, utilizando un separador especificado.
"""

cadena = "Python"
mensaje_unido_cadena = "-".join(cadena)
print(mensaje_unido_cadena)

diccionario = {"a": 1, "b": 2, "c": 3}
llaves = "-".join(diccionario.keys())
valores = "-".join(diccionario.values())
print(f"LLaves: {llaves}; tipo: {type(llaves)}")
print(f"Valores: {valores}; tipo: {type(valores)}")

"""
El método join() solo funciona con iterables que contengan elementos de tipo string. Si se intenta unir un iterable que contenga elementos de otro tipo, se producirá un error.
"""