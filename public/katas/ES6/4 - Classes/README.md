# Classes

Con motivo del aburrimiento que sufres al haberte tocado la lotería decides construir un zoo de nerds.
Hasta ahora nunca has abierto tu propio negocio y encima no tienes experiencia con los frikis salvo que conoces los conceptos básicos de todo bicho viviente:
  - Tiene un nombre.
  - Necesita comer y beber.
  - Pueden hablar.

Partiendo de la siguiente clase `Human`:

```javascript
class Human {
  constructor(name) {
    this.food = 100;
    this.name = name;
  }

  talk(word) {
    // ????????
  }
}
```

Construye la clase hija `Nerd` con las siguientes funcionalidades:
  - Cuando se llame a la función `talk` debe decir lo mismo que diría una persona añadiendo al principio `Hola k ase`.
  - El constructor de la clase `Nerd` recibirá como primer parámetro `food` (un **int** que sobreescribirá el valor de `food`) y como segundo parámetro `name` el nombre del friki.
  - Una función `isHungry` que devolverá true si el valor de `food` es menor de 25.
