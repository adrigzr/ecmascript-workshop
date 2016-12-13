## Decorators

Los decoradores nos permiten aumentar la funcionalidad de las funciones a las que se añaden para alterar su funcionamiento.

El objetivo de esta kata es crear un decorador `mandatory` que obligue a llamar al método `login` de la clase `Authenticator` con dos parámetros obligatoriamente.

```javascript
class Authenticator {
	@mandatory(2)
	login(user, password) {
		// our business logic.
	}
}
```
