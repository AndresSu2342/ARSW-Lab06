var app = (function () {

    var selectedAuthor = null;

    function updateBlueprintsInfo(blueprints) {
        console.log("Datos recibidos de apimock:", blueprints); // Para depuración

        if (!Array.isArray(blueprints) || blueprints.length === 0) {
            console.log("No hay planos para este autor.");
            $("#tabla-blueprints tbody").empty();
            $("#total").text("0");
            $("#autor-seleccionado").text("No blueprints found.");
            return;
        }

        // Limpiar la tabla antes de agregar nuevos datos
        $("#tabla-blueprints tbody").empty();

        // Agregar cada blueprint a la tabla
        blueprints.forEach(bp => {
            let row = `<tr>
                <td>${bp.name}</td>
                <td>${bp.points.length}</td>
            </tr>`;
            $("#tabla-blueprints tbody").append(row);
        });

        // Calcular total de puntos
        let totalPoints = blueprints.reduce((sum, bp) => sum + bp.points.length, 0);
        $("#total").text(totalPoints);

        // Mostrar el autor en pantalla
        $("#autor-seleccionado").text(`Blueprints by: ${selectedAuthor}`);
    }

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
})();

// ✅ Evento `click` correctamente definido
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
