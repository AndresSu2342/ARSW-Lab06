### Escuela Colombiana de Ingeniería
### Arquiecturas de Software
### Autores: Joan Acevedo y Cesar Borray

---

## Construción de un cliente 'grueso' con un API REST, HTML5, Javascript y CSS3. Parte I.

### Trabajo individual o en parejas. A quienes tuvieron malos resultados en el parcial anterior se les recomienda hacerlo individualmente.

---

![](img/mock.png)

* Al oprimir 'Get blueprints', consulta los planos del usuario dado en el formulario. Por ahora, si la consulta genera un error, sencillamente no se mostrará nada.
* Al hacer una consulta exitosa, se debe mostrar un mensaje que incluya el nombre del autor, y una tabla con: el nombre de cada plano de autor, el número de puntos del mismo, y un botón para abrirlo. Al final, se debe mostrar el total de puntos de todos los planos (suponga, por ejemplo, que la aplicación tienen un modelo de pago que requiere dicha información).
* Al seleccionar uno de los planos, se debe mostrar el dibujo del mismo. Por ahora, el dibujo será simplemente una secuencia de segmentos de recta realizada en el mismo orden en el que vengan los puntos.

---

## Ajustes Backend

1. Trabaje sobre la base del proyecto anterior (en el que se hizo el API REST).

   Pasamos toda la carpeta src y archivos maven del proyecto anterior

   ![Image](https://github.com/user-attachments/assets/ac49c681-1e14-47ef-a074-51f74e9e796e)

   Ejecutamos el proyecto y verificamos que todo funcione

   ![Image](https://github.com/user-attachments/assets/2baa1cdc-40f2-4b27-9aaa-4ee3c5a42af6)

2. Incluya dentro de las dependencias de Maven los 'webjars' de jQuery y Bootstrap (esto permite tener localmente dichas librerías de JavaScript al momento de construír el proyecto):

    ```xml
    <dependency>
        <groupId>org.webjars</groupId>
        <artifactId>webjars-locator</artifactId>
    </dependency>

    <dependency>
        <groupId>org.webjars</groupId>
        <artifactId>bootstrap</artifactId>
        <version>3.3.7</version>
    </dependency>

    <dependency>
        <groupId>org.webjars</groupId>
        <artifactId>jquery</artifactId>
        <version>3.1.0</version>
    </dependency>                

    ```

   Agregamos las dependencias a nuestro pom

   ![Image](https://github.com/user-attachments/assets/317dad7d-ab6c-4ec9-8c0c-6615505ce5bc)

---

## Front-End - Vistas

1. Cree el directorio donde residirá la aplicación JavaScript. Como se está usando SpringBoot, la ruta para poner en el mismo contenido estático (páginas Web estáticas, aplicaciones HTML5/JS, etc) es:

    ```
    src/main/resources/static
    ```
    
   Como se indica en el enunciado, procedemos a crear el directorio donde tendremos nuestro html
   
   ![Image](https://github.com/user-attachments/assets/d1641587-ef36-429f-9a0f-15dec814f3f1)

2. Cree, en el directorio anterior, la página index.html, sólo con lo básico: título, campo para la captura del autor, botón de 'Get blueprints', campo <div> donde se mostrará el nombre del autor seleccionado, [la tabla HTML](https://www.w3schools.com/html/html_tables.asp) donde se mostrará el listado de planos (con sólo los encabezados), y un campo <div> donde se mostrará el total de puntos de los planos del autor. Recuerde asociarle identificadores a dichos componentes para facilitar su búsqueda mediante selectores.

   El formato basico que decidimos darle a nuestro html es el siguiente:
   
   ```html
   <style>
           body {
               font-family: Arial, sans-serif;
               margin: 20px;
           }
           table {
               width: 100%;
               border-collapse: collapse;
               margin-top: 20px;
           }
           th, td {
               border: 1px solid #ddd;
               padding: 8px;
               text-align: center;
           }
           th {
               background-color: #f2f2f2;
           }
           #total-puntos {
               margin-top: 20px;
               font-weight: bold;
           }
       </style>
   </head>
   <body>
   
   <h1>Blueprints</h1>
   
   <div>
       <label for="input-autor">Author: </label>
       <input type="text" id="input-autor">
       <button id="btn-get-blueprints">Get blueprints</button>
   </div>
   
   <h3 id="autor-seleccionado"></h3>
   
   <table id="tabla-blueprints">
       <thead>
       <tr>
           <th>Blueprint name</th>
           <th>Number of points</th>
       </tr>
       </thead>
       <tbody>
       <!-- Aquí se mostrarían los planos en el futuro -->
       </tbody>
   </table>
   
   <div id="total-puntos">
       Total user points: <span id="total">0</span>
   </div>
   
   ```

3. En el elemento \<head\> de la página, agregue las referencia a las librerías de jQuery, Bootstrap y a la hoja de estilos de Bootstrap.
     
    ```html
    <head>
        <title>Blueprints</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script src="/webjars/jquery/jquery.min.js"></script>
        <script src="/webjars/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <link rel="stylesheet"
          href="/webjars/bootstrap/3.3.7/css/bootstrap.min.css" />
    </head>
    ```

   Ya con el html creado, procedemos a agregar las referencias a las librerías de jQuery, Bootstrap y a la hoja de estilos de Bootstrap.
   
   ![Image](https://github.com/user-attachments/assets/639b49e3-c6a8-444f-9ee0-7569891db076)


4. Suba la aplicación (mvn spring-boot:run), y rectifique:
   1. Que la página sea accesible desde:
    ```
    http://localhost:8080/index.html
    ```
   2. Al abrir la consola de desarrollador del navegador, NO deben aparecer mensajes de error 404 (es decir, que las librerías de JavaScript se cargaron correctamente).

   Finalmente, a continuación podemos observar lo que se encuentra en nuestra página de forma local:
   
   ![Image](https://github.com/user-attachments/assets/04c807f2-5d2a-4841-9b5d-47dfdfda5efc)

---

## Front-End - Lógica

1. Ahora, va a crear un Módulo JavaScript que, a manera de controlador, mantenga los estados y ofrezca las operaciones requeridas por la vista. Para esto tenga en cuenta el [patrón Módulo de JavaScript](https://toddmotto.com/mastering-the-module-pattern/), y cree un módulo en la ruta static/js/app.js .

Procedemos a crear el archivo `app.js` en el directorio `src/main/resources/static/js/app.js`:

![Image](https://github.com/user-attachments/assets/e15c23a1-a175-48db-b2e2-222bf6b58738)

2. Copie el módulo provisto (apimock.js) en la misma ruta del módulo antes creado. En éste agréguele más planos (con más puntos) a los autores 'quemados' en el código.

Ya con el JS creado, agregamos una copia del código brindado por el JS `apimock.js`, donde agregamos más planos a los autores "quemados" en código:

```java
    mockdata["johnconnor"] = [
        { author: "johnconnor", points: [{ x: 150, y: 120 }, { x: 215, y: 115 }], name: "house" },
        { author: "johnconnor", points: [{ x: 340, y: 240 }, { x: 15, y: 215 }], name: "gear" },
        { author: "maryweyland", points: [{ x: 145, y: 145 }, { x: 111, y: 111 }], name: "fabric" },
        { author: "maryweyland", points: [{ x: 141, y: 141 }, { x: 69, y: 69 }], name: "building" }
        ];

    mockdata["maryweyland"] = [
        { author: "maryweyland", points: [{ x: 140, y: 140 }, { x: 115, y: 115 }], name: "house2" },
        { author: "maryweyland", points: [{ x: 140, y: 140 }, { x: 115, y: 115 }], name: "gear2" },
        { author: "maryweyland", points: [{ x: 160, y: 160 }, { x: 80, y: 80 }], name: "fabric2" },
        { author: "maryweyland", points: [{ x: 100, y: 100 }, { x: 185, y: 185 }], name: "building2" }
        ];
```

3. Agregue la importación de los dos nuevos módulos a la página HTML (después de las importaciones de las librerías de jQuery y Bootstrap):
    ```html
    <script src="js/apimock.js"></script>
    <script src="js/app.js"></script>
    ```

Procedemos a importar los nuevos dos módulos a la página HTML `index.html` en el orden que nos indica el enunciado:

![Image](https://github.com/user-attachments/assets/c54f7d8a-670c-4899-bba7-0729afd72a93)

4. Haga que el módulo antes creado mantenga de forma privada:
   * El nombre del autor seleccionado.

Para ello agregamos la siguiente linea de código:

```java
var selectedAuthor = null;
```

   * El listado de nombre y tamaño de los planos del autor seleccionado. Es decir, una lista objetos, donde cada objeto tendrá dos propiedades: nombre de plano, y número de puntos del plano.

Para lograr esto, creamos la variable `blueprintsInfo` y agregamos la función privada `updateBlueprintsInfo`:

```java
    var blueprintsInfo = [];

    function updateBlueprintsInfo() {
        if (selectedAuthor && mockdata[selectedAuthor]) {
            blueprintsInfo = mockdata[selectedAuthor].map(bp => ({
                name: bp.name,
                pointsCount: bp.points.length
            }));
        } else {
            blueprintsInfo = [];
        }
    }
```

   * Junto con una operación pública que permita cambiar el nombre del autor actualmente seleccionado.

Para lograr una función publica que haga esto, la debemos agregar en el `return`, ya que solo las funciones y variables expuestas en este espacio pueden ser accedidas desde fuera del módulo:

```java
return {
        getBlueprintsByAuthor: function (authname) {
            selectedAuthor = authname;
        }
    };
```


5. Agregue al módulo 'app.js' una operación pública que permita actualizar el listado de los planos, a partir del nombre de su autor (dado como parámetro). Para hacer esto, dicha operación debe invocar la operación 'getBlueprintsByAuthor' del módulo 'apimock' provisto, enviándole como _callback_ una función que:

   * Tome el listado de los planos, y le aplique una función 'map' que convierta sus elementos a objetos con sólo el nombre y el número de puntos.

   * Sobre el listado resultante, haga otro 'map', que tome cada uno de estos elementos, y a través de jQuery agregue un elemento \<tr\> (con los respectvos \<td\>) a la tabla creada en el punto 4. Tenga en cuenta los [selectores de jQuery](https://www.w3schools.com/JQuery/jquery_ref_selectors.asp) y [los tutoriales disponibles en línea](https://www.tutorialrepublic.com/codelab.php?topic=faq&file=jquery-append-and-remove-table-row-dynamically). Por ahora no agregue botones a las filas generadas.

   * Sobre cualquiera de los dos listados (el original, o el transformado mediante 'map'), aplique un 'reduce' que calcule el número de puntos. Con este valor, use jQuery para actualizar el campo correspondiente dentro del DOM.

Para lograr esto, propusimos el la siguiente `function`:

```java
function updateBlueprintsInfo(blueprints) {
     console.log("Datos recibidos de apimock:", blueprints); // Para depuración

     if (!Array.isArray(blueprints) || blueprints.length === 0) {
         console.log("No hay planos para este autor.");
         $("#tabla-blueprints tbody").empty();
         $("#total").text("0");
         $("#autor-seleccionado").text("No blueprints found.");
         return;
     }
     
     $("#tabla-blueprints tbody").empty();
     
     blueprints.forEach(bp => {
         let row = `<tr>
             <td>${bp.name}</td>
             <td>${bp.points.length}</td>
         </tr>`;
         $("#tabla-blueprints tbody").append(row);
     });
     
     let totalPoints = blueprints.reduce((sum, bp) => sum + bp.points.length, 0);
     $("#total").text(totalPoints);
     
     $("#autor-seleccionado").text(`Blueprints by: ${selectedAuthor}`);
 }
```

Y el siguiente `return`:

```java
return {
     getBlueprintsByAuthor: function (authname) {
         selectedAuthor = authname;
         console.log(`Solicitando planos para el autor: ${authname}`);

         apimock.getBlueprintsByAuthor(authname, function (blueprints) {
             if (!blueprints) {
                 console.log("El API Mock devolvió un valor nulo o indefinido.");
                 updateBlueprintsInfo([]);
             } else {
                 updateBlueprintsInfo(blueprints);
             }
         });
     }
 };
```

6. Asocie la operación antes creada (la de app.js) al evento 'on-click' del botón de consulta de la página.

Para esto, decidimos dejar esta funcion en `app.js` ya que consideramos que es mejor practica hacerlo de esta manera, para ello agregamos el siguiente código al final de `app.js`

```java
$(document).ready(function () {
    $("#btn-get-blueprints").click(function () {
        let autor = $("#input-autor").val().trim();
        if (autor !== "") {
            app.getBlueprintsByAuthor(autor);
        } else {
            console.log("Ingrese un autor válido.");
        }
    });
});
```

7. Verifique el funcionamiento de la aplicación. Inicie el servidor, abra la aplicación HTML5/JavaScript, y rectifique que al ingresar un usuario existente, se cargue el listado del mismo.

Al probar el funcionamiento de manera local, vemos que los resultados son los esperados:

![Image](https://github.com/user-attachments/assets/bee9066c-45ec-41c6-80c2-9f9978d65a7d)

---

**Nota**

Al momento de ejecutar el código, observamos que habia un error con los scrips propuestos para cargar el `JQuery` y el `Bootstrap` asi que decidimos cambiarlos por los siguientes:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
```

---

## Para la próxima semana

8. A la página, agregue un [elemento de tipo Canvas](https://www.w3schools.com/html/html5_canvas.asp), con su respectivo identificador. Haga que sus dimensiones no sean demasiado grandes para dejar espacio para los otros componentes, pero lo suficiente para poder 'dibujar' los planos.

Para lograr esto, implementamos el siguiente código en el html:

```html
<div id="blueprint-canvas-container">
    <h3>Blueprint Preview</h3>
    <canvas id="myCanvas" width="500" height="300" style="border:2px solid #000000;"> </canvas>
</div>
```

Además de agregarle las siguientes caracteristicas en la sección de `estilos` del código:

```html
#blueprint-canvas-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   margin-top: 20px;
}
```

Finalmente obtenemos el siguiente resultado en la página:

![Image](https://github.com/user-attachments/assets/070b5900-a93d-4d15-8e39-4dc2710c5ed7)

9. Al módulo app.js agregue una operación que, dado el nombre de un autor, y el nombre de uno de sus planos dados como parámetros, haciendo uso del método getBlueprintsByNameAndAuthor de apimock.js y de una función _callback_:
   * Consulte los puntos del plano correspondiente, y con los mismos dibuje consectivamente segmentos de recta, haciendo uso [de los elementos HTML5 (Canvas, 2DContext, etc) disponibles](https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_canvas_tut_path)* Actualice con jQuery el campo <div> donde se muestra el nombre del plano que se está dibujando (si dicho campo no existe, agruéguelo al DOM).

Para ello implementamos el siguiente código en app.js:

En la función `updateBlueprintsInfo(blueprints)`:

```java
blueprints.forEach(bp => {
   let row = `<tr>
       <td>${bp.name}</td>
       <td>${bp.points.length}</td>
       <td><button class="btn-draw" data-bpname="${bp.name}">Draw</button></td>
   </tr>`;
   $("#tabla-blueprints tbody").append(row);
});

$(".btn-draw").click(function () {
   let bpname = $(this).data("bpname");
   app.drawBlueprint(selectedAuthor, bpname);
});
```

También creamos una nueva dunción denominada `drawBlueprint(author, bpname) ` con el siguiente contenido:

```java
console.log(`Dibujando blueprint: ${bpname} de ${author}`);

apimock.getBlueprintsByNameAndAuthor(author, bpname, function (blueprint) {
   if (!blueprint || !blueprint.points) {
       console.log("No se encontraron puntos en el blueprint.");
       return;
   }

   let canvas = document.getElementById("myCanvas");
   let ctx = canvas.getContext("2d");
   ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

   ctx.beginPath();
   let points = blueprint.points;
   ctx.moveTo(points[0].x, points[0].y);

   for (let i = 1; i < points.length; i++) {
       ctx.lineTo(points[i].x, points[i].y);
   }
   ctx.stroke();
});
```

Por otro lado, al final del `return` agregamos `drawBlueprint: drawBlueprint` para hacer que la función sea accesible desde afuera.

10. Verifique que la aplicación ahora, además de mostrar el listado de los planos de un autor, permita seleccionar uno de éstos y graficarlo. Para esto, haga que en las filas generadas para el punto 5 incluyan en la última columna un botón con su evento de clic asociado a la operación hecha anteriormente (enviándo como parámetro los nombres correspondientes).

Esta implementación ya la habiamos hecho en el punto anterior, acá observamos el resultado:

![Image](https://github.com/user-attachments/assets/0af2043b-483e-4f14-b2a5-bc264bacbafc)

11. Verifique que la aplicación ahora permita: consultar los planos de un auto y graficar aquel que se seleccione.

* La siguiente demostración fue en el caso del autor `johnconnor` y del plano `house`:

![Image](https://github.com/user-attachments/assets/94a54fe9-24ff-4c32-a81d-6611765f33e7)

* La siguiente demostración fue en el caso del autor `johnconnor` y del plano `gear`:

![Image](https://github.com/user-attachments/assets/736733b1-1bad-4fc6-8454-785c513b94e0)

12. Una vez funcione la aplicación (sólo front-end), haga un módulo (llámelo 'apiclient') que tenga las mismas operaciones del 'apimock', pero que para las mismas use datos reales consultados del API REST. Para lo anterior revise [cómo hacer peticiones GET con jQuery](https://api.jquery.com/jquery.get/), y cómo se maneja el esquema de _callbacks_ en este contexto.

Acá tenemos nuestro nuevo módulo `apiclient`:

```java
var apiclient = (function () {
    var apiUrl = "http://localhost:8080/blueprints"; // <-------------------------

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            $.get(apiUrl + "/" + authname)
                .done(function (data) {
                    callback(data);
                })
                .fail(function (error) {
                    console.error("Error obteniendo planos del autor:", error);
                });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get(apiUrl + "/" + authname + "/" + bpname)
                .done(function (data) {
                    callback(data);
                })
                .fail(function (error) {
                    console.error("Error obteniendo el plano:", error);
                });
        }
    };
})();

```

13. Modifique el código de app.js de manera que sea posible cambiar entre el 'apimock' y el 'apiclient' con sólo una línea de código.

Para lograr esto agregamos el siguiente código a `app.js`:

* Hicimos que `app.js` inicie por defecto con `apimock;`, para ello agregamos de forma privada la siguiente variable:

```java
var api = apimock;
```

* Posteriormente agregamos la siguiente función que nos permite cambiar dinámicamente la funte de datos de foma pública:

```java
setApi: function (newApi) {
   api = newApi;
}
```

* Para poder cambiar cambiar entre `apimock` y `apiclient` solo basta con ejecutar en la consola del navegador el comando `app.setApi(apiclient);`

---

**Nota**

Nos dimos cuenta de que es muy importante el orden de los scripts que se ejecutan en nuestra HTML, para lograr que funcione correctamente debemos tener los scripts de la siguiente manera:

```html
<script src="js/apimock.js"></script>
<script src="js/apiclient.js"></script>
<script src="js/app.js"></script>
```

---

14. Revise la [documentación y ejemplos de los estilos de Bootstrap](https://v4-alpha.getbootstrap.com/examples/) (ya incluidos en el ejercicio), agregue los elementos necesarios a la página para que sea más vistosa, y más cercana al mock dado al inicio del enunciado.

Finalmente nuestra API visualmente quedaría de la siguiente manera:

![Image](https://github.com/user-attachments/assets/9763a4fd-acc3-4f2f-b00d-21b9220b60b9)