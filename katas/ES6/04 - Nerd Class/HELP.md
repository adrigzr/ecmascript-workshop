# Nerd Class

## ¿Qué es?

Las clases de javascript están introducidas en ECMAScript 6 y permiten de una forma sintáctica sencilla implementar la herencia basada en prototipos de JavaScript. La sintaxis de las clases no introduce un nuevo modelo de herencia orientada a objetos a JavaScript.

Las clases de JavaScript proveen una sintaxis mucho más clara y simple para crear objetos y lidiar con la herencia.

Para la declaración de una clase, es necesario el uso de la palabra reservada class y un nombre para la clase.

```javascript
class Foo {
  // Class content is executed in 'strict mode'.
}
```

## Hoisting

Una importante diferencia entre las declaraciones de funciones y las declaraciones de clases es que las declaraciones de funciones son izadas y las declaraciones de clases no lo son. En primer lugar necesitas declarar tu clase y luego acceder a ella, de otra modo el ejemplo de código siguiente arrojará un ReferenceError:

```javascript
var p = new Foo(); // ReferenceError

class Foo {}
```

## Expresiones de clases

Una expresión de clase es otra manera de definir una clase. Las expresiones de clase pueden ser denominadas o anónimas. El nombre dado a la expresión de clase denominada es local al cuerpo de la misma.

```javascript
// Anonima
var Poligono = class {
  constructor(alto, ancho) {
    this.alto = alto;
    this.ancho = ancho;
  }
};

// Denominada
var Poligono = class Poligono {
  constructor(alto, ancho) {
    this.alto = alto;
    this.ancho = ancho;
  }
};
```

## Constructor

El método constructor es un método especial para crear e inicializar un objeto creado con una clase. Solo puede haber un método especial con el nombre "constructor" en una clase. Si esta contiene mas de una ocurrencia del método constructor, se arrojará un Error SyntaxError

Un constructor puede usar la palabra reservada super para llamar al constructor de una superclase

## Métodos prototipo

Vea también method definitions.

```javascript
class Poligono {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  get area() {
    return this.calcArea();
  }

  calcArea() {
    return this.height * this.width;
  }
}

const cuadrado = new Poligono(10, 10);

console.log(cuadrado.area);
```

## Métodos estáticos

La palabra clave static define un método estático para una clase. Los métodos estáticos son llamados sin instanciar las clases ni son llamables cuando la clase es instanciada. Los métodos estáticos son a menudo usados para crear funciones de utilidad para una aplicación.

```javascript
class Punto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distancia(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx*dx + dy*dy);
    }
}

const p1 = new Punto(5, 5);
const p2 = new Punto(10, 10);

console.log(Punto.distancia(p1, p2));
```

## Subclases con extends

La palabra clave extends es usada en declaraciones de clase o expresiones de clase para crear una clase hija.

```javascript
class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }

  hablar() {
    console.log(this.nombre + ' hace un ruido.');
  }
}

class Perro extends Animal {
  hablar() {
    console.log(this.nombre) + ' ladra.';
  }
}
```

También se pueden extender las clases tradicionales basadas en funciones:

```javascript
function Animal (nombre) {
  this.nombre = nombre;
}
Animal.prototype.hablar = function () {
  console.log(this.nombre + 'hace un ruido.');
}

class Perro extends Animal {
  hablar() {
    super.hablar();
    console.log(this.nombre + ' ladra.');
  }
}

var p = new Perro('Mitzie');
p.hablar();
```
