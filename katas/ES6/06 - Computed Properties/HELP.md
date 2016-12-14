# Computed properties

Esto es una nueva característica del lenguaje, aunque no deja de ser algo que podíamos hacer anteriormente de una manera un poco más rebuscada.

Se trata de crear un literal de objeto donde el nombre de una de sus propiedades es computado, es decir, una o varias de sus propiedades tienen nombres que son definidos en función del contenido de variables, en tiempo de ejecución.

```javascript
var elemento = 'agua'
var modalidad = 'mariposa'
function deporte(){
   return 'natacion';
}
```

```javascript
var registroDeporte = {
  [deporte()]: elemento,
  [modalidad + '100m']: 'Esta es la modalidad de 100 metros mariposa',
  [modalidad + '200m']: 'Esta es la modalidad de 200 metros mariposa',
}
```

Esto produciría un objeto como el siguiente:

```javascript
{
  mariposa100m: "Esta es la modalidad de 100 metros mariposa",
  mariposa200m: "Esta es la modalidad de 200 metros mariposa",
  natacion: "agua"
}
```
