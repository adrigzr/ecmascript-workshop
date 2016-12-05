# Arrow functions

## ¿Qué es?

La expresión de función flecha dispone de una sintaxis más corta comparada con la expresión de función convencional y vincula contextualmente el valor de this.

**Las Funciones Flecha siempre son anónimas.**

```javascript
(a, b) => { statements }
```

## Características

**Return implícito:**

```javascript
(a,b) => expression // equivalente a:  => { return expression; }
```

**Paréntesis opcionales:**

```javascript
// Los paréntesis son opcionales cuando solo dispone de un argumento
singleParam => { statements }
singleParam => expression
```

**Argumentos opcionales:**

```javascript
// Una función sin argumentos requiere paréntesis
() => { statements }
```

**Devolver objetos:**

```javascript
// Incluir entre paréntesis el cuerpo
params => ({foo: bar})
```

**Parámetros REST:**

```javascript
(param1, param2, ...rest) => { statements }
```
