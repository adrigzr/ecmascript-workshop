# Computed properties

Ahora vamos a completar un poco más la clase anterior para añadirle alguna propiedad computada.

## Ejercicio 1

¿Te acuerdas de la función `isHungry`?
Esta devolvía `true` si el valor de `food` era menor de 25. El ejercicio de ahora consiste en crear un getter para esa función, de tal manera que podamos consultar su valor sin necesidad de invocar a una función.

## Ejercicio 2

El segundo ejercicio consiste en crear una propiedad computada que al llamarse nos devuelva la frase `I'm {{this.name}}`.
La gracia es que esa propiedad tiene que poderse llamar con el valor que va a tener la variable  `computedName`.

Ejemplo:

```javascript
const computedName = 'talk';
const foo = new Nerd(90, 'foo');

console.log(foo.talk) // I'm foo
```
