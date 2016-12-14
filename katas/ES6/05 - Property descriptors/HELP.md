# Resumen

El método `Object.defineProperty()` define una nueva propiedad sobre un objeto, o modifica una ya existente, y devuelve el objeto modificado.

```javascript
Object.defineProperty(obj, prop, descriptor)
```

##Parámetros

- **obj**
El objeto sobre el cual se define la propiedad.

- **prop**
El nombre de la propiedad a ser definida o modificada.

- **descriptor**
El descriptor de la propiedad que está siendo definida o modificada.

## ¿Qué es?

Este método permite añadir o modificar una propiedad en un objeto.

La adición normal de una propiedad a través de la asignación crea propiedades que aparecen durante la enumeración de propiedades en el bucle (for...in o el método Object.keys), cuyos valores pueden modificarse y pudiendo incluso eliminar la propiedad del objeto mediante el método delete.

Este método nos permite modificar el comportamiento por defecto de las propiedades. Es decir, nos permite definir una propiedad como no enumerable, no modificable o incluso evitar que pueda ser eliminada del objeto.

Existen dos tipos de desciptores: De datos y de acceso. Un descriptor de datos define una propiedad que tiene un valor, el cual puede ser o no modificado. Un descriptor de acceso define una propiedad mediante un par de funciones getter-setter que describe como se obtiene o se modifica el contenido de dicha propiedad.

**Un descriptor debe de ser de uno de estos dos tipos; no puede ser ambos.**

Ambos tipos de descriptores son objetos y comparten las siguientes claves opcionales:

- **configurable**
true si y solo si el tipo de descriptor de propiedad puede modificarse y si la propiedad puede ser eliminada del correspondiente objeto.
Por defecto es false.

- **enumerable**
true si y solo si dicha propiedad se muestra durante la enumeración de las propiedades del objeto correspondiente.
Por defecto es false.

Un descriptor de datos tiene además las siguientes claves opcionales:

- **value**
El valor asociado a la propiedad. Puede ser cualquier tipo valido de JavaScript  (number, object, function, etc).
Por defecto es undefined.

- **writable**
true Indica si el valor de la propiedad puede modificarse con el  operador de asignación.
Defaults to false.

Un descriptor de acceso además tiene las siguientes claves opcionales:

- **get**
Una función cuyo valor retornado será el que se use como valor de la propiedad.
Defaults to undefined.

- **set**
Una función que recibe como único argumento el nuevo valor que se desea asignar a la propiedad y que devuelve el valor que se almacenará finalmente en el objeto.
Defaults to undefined.

Hay que tener en cuenta que estas opciones también pueden heredarse; es decir, las opciones de la propiedad se han podido establecer en el prototipo de una clase de la que hereda el objeto. De modo que si queremos asegurarnos unos valores por defecto tenemos tres opciones: fijar el Object.prototype con `Object.freeze`, definir todas las opciones explicitamente, o establecer a null la propiedad `__proto__`.
