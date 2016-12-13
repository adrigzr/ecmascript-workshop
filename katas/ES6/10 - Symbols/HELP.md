## Symbols

`Symbol` es un tipo de datos cuyos valores son únicos e immutables. Dichos valores pueden ser utilizados como identificadores (claves) de las propiedades de los objetos. Cada valor del tipo `Symbol` tiene asociado un valor del tipo `String` o `Undefined` que sirve únicamente como descripción del símbolo.

La función `Symbol` es el constructor de valores del tipo `Symbol`. Cuando `Symbol` es llamado como función nos devuelve una nuevo valor del tipo `Symbol`. El constructor `Symbol` no debe ser usado con el operador `new`. Tampoco debe ser extendido mediante clases.

### Sintaxis

```javascript
Symbol([description])
```

*description*
  Es un valor opcional de tipo `String`. Unicamente sirve como descripción del símbolo que puede ser útil para depurar. No permite el acceso al símbolo que describe.

### Descripción

Para crear un nuevo símbolo, simplemente escribimos `Symbol()`, opcionalmente con un argumento de tipo `String` que constituiría la descripción del símbolo:

```javascript
var sym1 = Symbol();
var sym2 = Symbol("foo");
var sym3 = Symbol("foo");
```

El código anterior crea tres símbolos nuevos. Hay que destacar que `Symbol("foo")` no convierte la cadena "foo" en un símbolo, sino que crea un símbolo nuevo que tiene la misma descripción.

```javascript
Symbol("foo") === Symbol("foo"); // false
```

### Símbolos globales

La sintaxis anteriormente descrita que usa la función `Symbol()` no creara un símbolo global disponible para toda el código base. Para crear símbolos accesibles a través de los archivos incluso a través de realms (cada unbo de los cuales tiene su propio global scope) es necesario utilizar los métodos `Symbol.for()` y `Symbol.keyFor()` para crear y acceder a los símbolos desde un registro global de valores del tipo `Symbol`.
