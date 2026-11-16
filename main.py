numero1 = 8
numero2 = 4
prompt = f"El resultado de"
division = numero1 / numero2
multiplicacion = numero1 * numero2
suma = numero1 + numero2
resta = numero1 - numero2

if numero1 != numero2:
    print(numero1, "si es diferente de ", numero2, "Diferencia de ", numero1 - numero2)
else:
    print(numero1, "es igual a ", numero2)

if numero1 > numero2:
    print(numero1, "es mayor que ", numero2)
else:
    print(numero1, "no es mayor que ", numero2)

if numero2 <= 10:
    print(numero2, "es menor o igual a 10")
else:
    print(numero2, "es mayor a 10")