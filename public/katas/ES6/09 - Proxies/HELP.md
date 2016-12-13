## Proxies

Los proxies son objetos utilizados para personalizar el comportamiento de los operadores fundamentales (p.e. acceso a propiedades, asignaciones, enumeraciones, invocación de funciones, etc).

```javascript
var p = new Proxy(target, handler);
```

*handler*
  Objeto capturador.

*target*
  Objeto destino.

El objeto capturador *handler* puede definir una serie de métodos para alterar el comportamiento del objeto destino *target*.

Estos métodos son opcionales. Si alguno no está definido, se empleará el comportamiento por defecto del objeto destino.

`handler.getPrototypeOf()`
  Captura Object.getPrototypeOf.

`handler.setPrototypeOf()`
  Captura Object.setPrototypeOf.

`handler.isExtensible()`
  Captura Object.isExtensible.

`handler.preventExtensions()`
  Captura Object.preventExtensions.

`handler.getOwnPropertyDescriptor()`
  Captura Object.getOwnPropertyDescriptor.

`handler.defineProperty()`
  Captura Object.defineProperty.

`handler.has()`
  Captura the in operator.

`handler.get()`
  Captura getting property values.

`handler.set()`
  Captura setting property values.

`handler.deleteProperty()`
  Captura the delete operator.

`handler.ownKeys()`
  Captura Object.getOwnPropertyNames.

`handler.apply()`
  Captura a function call.

`handler.construct()`
  Captura the new operator.

