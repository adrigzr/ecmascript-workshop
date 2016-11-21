# Spread operator

Para dominar esta kata deberás creat una función  `spread`, que recibirá:
  - Como primer argumento un objeto con una función `fn` y los parámetros con los que deberá ser llamada `args`.
  - Del segundo hasta el penúltimo son datos que podemos despreciar.
  - Como último argumento un dato que deberá ser devuelto al final de la función.

Utiliza el operador de expansión así como la desestructuración de parámetros para resolverlo de manera sencilla.

## Ejemplo:

```javascript
function spread(obj, ignoreThisVariable, andThis, ..., returnValue) {
  obj.fn.apply(null, obj.args);

  // Do nothing with 'ignoreThisVariable' O_O

  return returnValue;
}
```
