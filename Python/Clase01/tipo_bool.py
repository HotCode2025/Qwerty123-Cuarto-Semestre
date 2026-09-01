
# Bool contiene los valores de True y False
# Los tipos numéricos, es false para el 0 (cero), true para los demás valores

#Tipos Booleanos

valor = 0
resultado = bool(valor)

print(f"valor : {valor}, Resultado : {resultado}")


valor = 0.1
resultado = bool(valor)

print(f"valor : {valor}, Resultado : {resultado}")

valor = "hola"
resultado= bool(valor)
print(f"Valor: {valor}, Resultado : {resultado}")


#Colecciones

lista=[]
resultado=bool(lista)
print(f"Lista Vacia: {lista}, Resultado : {resultado}")

lista=[2,3,4]
resultado=bool(lista)
print(f"Lista con elementos: {lista}, Resultado : {resultado}")

tupla=()
resultado=bool(tupla)
print(f"Tupla Vacia: {tupla}, Resultado: {resultado}")

tupla=(2,3,4)
resultado=bool(tupla)
print(f"Tupla con elementos: {tupla}, Resultado: {resultado}")


diccionario={}
resultado=bool(diccionario)
print(f"Diccionario Vacio : {diccionario}, Resultado: {resultado}")


diccionario={"Nombre": "Pedro","2do Nombre": "Jose"}
resultado=bool(diccionario)
print(f"Diccionario con elementos : {diccionario}, Resultado: {resultado}")

#Sentencia de Control
if (1,2):
    print("Verdadero") 
else:
    print("Falso")

#Ciclos
variable= 17
while variable:
    print("Verdadero")
    break
else:
    print("Falso")