# Destructuring

La sintaxis de **destructuring assignment** es una expresión de JavaScript que hace posible la extracción de datos de **arrays** u **objetos** usando una sintaxis que equivale a la construcción de los mismos.

```javaScript
[a, b] = [1, 2]
[a, b, ...rest] = [1, 2, 3, 4, 5]
{a, b} = {a:1, b:2}
{a, b, ...rest} = {a:1, b:2, c:3, d:4}  //ES7
```

## Ejemplos de array destructuring

**Cambiar el orden de las variables:**

```javascript
var a = 1;
var b = 3;

[a, b] = [b, a];
```

**Múltiples valores de retorno:**

```javascript
const f = () => [1, 2];

[a, b] = f();
```

**Ignorar valores:**

```javascript
const f = () => [1, 2, 'ignored', 3];

[a, b, , c] = f();
```

**Recuperar valored de una RegExp:**

```javascript
var url = "https://developer.mozilla.org/en-US/Web/JavaScript";
var parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
var [, protocol, fullhost, fullpath] = parsedURL;
```

## Ejemplos de object destructuring

**Argumentos por defecto en funciones:**

```javascript
function draw({size = 'big', radius = 25} = {}) {
  // Doing nothing O_O
}
```

**Carga de módulos:**

```javascript
const { Loader, main } = require('toolkit/loader');
import { Loader, main } from 'toolkit/loader';
```

**Iterar objetos:**

```javascript
const people = [
  { name: 'foo' },
  { name: 'bar' }
]
for (var { name: n } of people) {
  // Use 'n'
}
```

**Propiedades computadas:**

```javascript
let key = 'foo';
let { [key]: value } = { foo: 'bar' };

console.log(value); // 'bar'
```
