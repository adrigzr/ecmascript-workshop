# HTML Encoder

Como programador proactivo que eres has decidido crearte tu propio precompilador de HTML (**no hacer en casa**).
Para ello te propones cambiar los caracteres HTML por su valor codificado (` ` === `&nbsp;`).

Tu compilador espera que exista una función `precompile` que haga todo el trabajo sucio y que acepta un único argumento, la cadena de texto con el fichero.

Ten en cuenta que tu entrada puede ser un string literal (`<p>I'm ${name}</p>`).

Tip: **Utiliza la nueva función `replace` de String**
