## Decorators

Los decoradores son funciones que permiten alterar el comportamiento de métodos, propiedades y clases en javascript. El patrón decorador es un paradigma de programación usado en gran variedad de lenguages y que aporta una sintaxis simple para modificar funciones.

```javascript
class Universe {
  @readonly
  all: 42
}
```

A bajo nivel, un decorador no es más que una función que envuelve el método, propiedad o clase sobre el que se especifica y permite alterar su funcionamiento. En el ejemplo anterior se ejecutará el decorador `readonly`.

```javascript
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
```

Asimismo, es posible especificar decoradores que se configuren en tiempo de ejecución.

```javascript
class Legacy {
  @deprecated('Remove this call right now!')
  ancient() {
    // my ancient code
  }
}

function deprecated(warning) {
  return function(target, key, descriptor) {
    const func = descriptor.value;

    descriptor.value = function(...args) {
      console.warn(warning);
      return func.apply(target, args);
    };

    return descriptor;
  };
}
```

Esta funcionalidad aun esta en estado de propuesta `proposal`, sin embargo, utilizando plugins para los transpiladores es posible utilizarlos.

La librería [core-decorators](https://github.com/jayphelps/core-decorators.js) contiene una gran variedad de ellos ya implementados y listos para usar.




