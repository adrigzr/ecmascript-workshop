# Async / Await

## ¿Qué es?

Las funciones asíncronas son tipos de funciones que devuelven un objeto del tipo `AsyncFunction`;

```javascript
async function name([param[, param[, ... param]]]) {
   statements
}
```

*name*
  The function name.

*param*
  The name of an argument to be passed to the function.

*statements*
  The statements comprising the body of the function.

## Descripción

Cuando una función asíncrona es llamada, ésta devuelve una promsa. Cuando la función asíncrona devuelve un valor, la promesa es resuelta con dicho valor. Cuando la función asíncrona lanza una excepción, la promesa se rechazará con el error.

Las funciones asíncronas pueden contener la expresión `await`, que pausa la ejecución de la función y espera la resolución de la promesa informada.

### Ejemplo

```javascript
function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function add1(x) {
  var a = resolveAfter2Seconds(20);
  var b = resolveAfter2Seconds(30);
  return x + await a + await b;
}

add1(10).then(v => {
  console.log(v);  // prints 60 after 2 seconds.
});

async function add2(x) {
  var a = await resolveAfter2Seconds(20);
  var b = await resolveAfter2Seconds(30);
  return x + a + b;
}

add2(10).then(v => {
  console.log(v);  // prints 60 after 4 seconds.
});
```
