# Template strings

## ¿Qué es?

Las plantillas de texto (template strings) son literales que habilitan el uso de expresiones incrustadas.

Es posible utilizar cadenas de texto de más de una línea, y funcionalidades de interpolación de cadenas de texto con ellas.

```javascript
`cadena de texto`

`línea 1 de la cadena de texto
 línea 2 de la cadena de texto`

`cadena de texto ${expresión} texto`

tag `cadena de texto ${expresión} texto`
```

Las plantillas de cadena de texto se delimitan con el caracter de comillas o tildes invertidas en lugar de las comillas simples o dobles.

Las plantillas de cadena de texto pueden contener marcadores, indentificados por el signo del dólar, y envueltos en llaves (`${expresión}`).

## Plantillas de cadena de texto con postprocesador

Una forma más avanzada de plantillas de cadenas de texto son aquellas que contienen una función de postprocesado.

Con ellas es posible modificar la salida de las plantillas, usando una función. El primer argumento contiene un array con las cadenas de texto de la plantilla ("Hola" y "mundo" en el ejemplo). El segundo y subsiguientes argumentos con los valores procesados de las expresiones de la plantilla (en este caso "15" y "50").

 Finalmente, la función devuelve la cadena de texto manipulada.

```javascript
var a = 5;
var b = 10;

function tag(strings, ...values) {
  console.log(strings[0]); // "Hola "
  console.log(strings[1]); // " mundo "
  console.log(values[0]);  // 15
  console.log(values[1]);  // 50

  return "Bazinga!";
}

tag`Hola ${a + b} mundo ${a * b}`;
// "Bazinga!"
```

## Cadenas en crudo (raw)

La propiedad especial raw, disponible en el primer argumento de las plantillas de cadenas de texto postprocesadas, nos permite acceder a las cadenas de texto tal como fueron ingresadas.

```javascript
function tag(strings, ...values) {
  console.log(strings.raw[0]);
  // "linea 1 de cadena de texto \\n línea 2 de cadena de texto"
}

tag`línea 1 de cadena de texto \n línea 2 de cadena de texto`;
```

Adicionalmente, el método  String.raw() permite crear cadenas de texto en crudo tal como serían generadas por la función por defecto de plantilla, concatenando sus partes.


```javascript
String.raw`Hola\n${2+3}!`;
// "Hola\\n5!"
```
