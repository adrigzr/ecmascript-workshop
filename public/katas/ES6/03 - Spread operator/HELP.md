# Spread operator

## ¿Qué es?

El operador de propagación, **spread operator**, permite que una expresión sea expandida en situaciones donde se esperan múltiples argumentos.

## Sintaxis:

**LLamadas a funciones:**

```javascript
func(...iterableObj);
```

**Arrays literales:**

```javascript
[...iterableObj, 4, 5, 6]
```

**Destructuring:**

```javascript
[a, b, ...iterableObj] = [1, 2, 3, 4, 5];
```

## Ejemplos:

**Apply**

Es común usar `Function.prototype.apply` en casos donde se require un array como contenedor de los argumentos que se enviarán a una llamada de función:

```javascript
function func(x, y, z) { }

var args = [0, 1, 2];

func.apply(null, args);
```

Con el operador spread de ES6, el ejemplo anterior se puede rescribir como:

```javascript
func.apply(...args);
```

**Construcción de arrays**

Actualmente se debe escribir código imperativo usando una combinación de métodos como push, splice, concat, etc. Con la sintaxis de propagación spread esta tarea resulta mucho mas concisa.

```javascript
var parts = ['shoulder', 'knees'];
var lyrics = ['head', ...parts, 'and', 'toes'];
```
