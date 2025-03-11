//@author Joan A. y Cesar B.

apimock = (function () {
    var mockdata = [];

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

    var selectedAuthor = null;
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

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            selectedAuthor = authname;
            updateBlueprintsInfo();
            callback(mockdata[authname]);
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            callback(mockdata[authname]?.find(e => e.name === bpname));
        },

        setSelectedAuthor: function (newAuthor) {
            selectedAuthor = newAuthor;
            updateBlueprintsInfo();
        },

        getSelectedAuthor: function () {
            return selectedAuthor;
        },

        getBlueprintsInfo: function () {
            return blueprintsInfo;
        }
    };
})();

/*
Example of use:
var fun = function (list) {
    console.info(list);
};

apimock.getBlueprintsByAuthor("johnconnor", fun);
console.log(apimock.getSelectedAuthor());  // "johnconnor"
console.log(apimock.getBlueprintsInfo());  // Lista de planos con su cantidad de puntos

apimock.setSelectedAuthor("maryweyland");
console.log(apimock.getSelectedAuthor());  // "maryweyland"
console.log(apimock.getBlueprintsInfo());  // Nueva lista de planos
*/
