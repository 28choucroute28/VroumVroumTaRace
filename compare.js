$(document).ready(function () {
    const baseUrl = "https://www.carqueryapi.com/api/0.3/";

    function loadMakes(selectId) {
        $.getJSON(baseUrl + "?callback=?", { cmd: "getMakes" }, function (data) {
            const select = $(selectId);
            select.append('<option value="">Select a Make</option>');
            data.Makes.forEach(make => {
                select.append(`<option value="${make.make_id}">${make.make_display}</option>`);
            });
        });
    }

    function loadModels(makeSelectId, modelSelectId, yearSelectId) {
        $(makeSelectId).on("change", function () {
            const make = $(this).val();
            const modelSelect = $(modelSelectId);
            const yearSelect = $(yearSelectId);
            modelSelect.empty().append('<option value="">Select a Model</option>');
            yearSelect.empty().append('<option value="">Select a Year</option>');
            
            if (make) {
                $.getJSON(baseUrl + "?callback=?", { cmd: "getModels", make }, function (data) {
                    data.Models.forEach(model => {
                        modelSelect.append(`<option value="${model.model_name}">${model.model_name}</option>`);
                    });
                });
            }
        });
    }

    function loadYears(makeSelectId, modelSelectId, yearSelectId) {
        $(modelSelectId).on("change", function () {
            const make = $(makeSelectId).val();
            const model = $(this).val();
            const yearSelect = $(yearSelectId);
            yearSelect.empty().append('<option value="">Select a Year</option>');
            
            if (make && model) {
                $.getJSON(baseUrl + "?callback=?", { cmd: "getTrims", make, model }, function (data) {
                    const years = new Set();
                    data.Trims.forEach(trim => years.add(trim.model_year));
                    Array.from(years).sort((a, b) => b - a).forEach(year => {
                        yearSelect.append(`<option value="${year}">${year}</option>`);
                    });
                });
            }
        });
    }

    loadMakes("#make-1");
    loadMakes("#make-2");
    loadModels("#make-1", "#model-1", "#year-1");
    loadModels("#make-2", "#model-2", "#year-2");
    loadYears("#make-1", "#model-1", "#year-1");
    loadYears("#make-2", "#model-2", "#year-2");

    $("#compare-btn").on("click", function () {
        const make1 = $("#make-1").val(), model1 = $("#model-1").val(), year1 = $("#year-1").val();
        const make2 = $("#make-2").val(), model2 = $("#model-2").val(), year2 = $("#year-2").val();
        
        if (!make1 || !model1 || !year1 || !make2 || !model2 || !year2) {
            alert("Please select both vehicles completely.");
            return;
        }
        
        Promise.all([
            $.getJSON(baseUrl + "?callback=?", { cmd: "getTrims", make: make1, model: model1, year: year1 }),
            $.getJSON(baseUrl + "?callback=?", { cmd: "getTrims", make: make2, model: model2, year: year2 })
        ]).then(([data1, data2]) => {
            const details1 = data1.Trims[0] || {};
            const details2 = data2.Trims[0] || {};
            
            $("#comparison-results").html(`
                <h2>Comparison Results</h2>
                <table border="1">
                    <tr><th>Feature</th><th>${details1.model_name || "N/A"}</th><th>${details2.model_name || "N/A"}</th></tr>
                    <tr><td>Engine</td><td>${details1.model_engine_cc || "N/A"}cc</td><td>${details2.model_engine_cc || "N/A"}cc</td></tr>
                    <tr><td>Power</td><td>${details1.model_engine_power_ps || "N/A"} PS</td><td>${details2.model_engine_power_ps || "N/A"} PS</td></tr>
                    <tr><td>Body</td><td>${details1.model_body || "N/A"}</td><td>${details2.model_body || "N/A"}</td></tr>
                    <tr><td>Transmission</td><td>${details1.model_transmission_type || "N/A"}</td><td>${details2.model_transmission_type || "N/A"}</td></tr>
                    <tr><td>Drive</td><td>${details1.model_drive || "N/A"}</td><td>${details2.model_drive || "N/A"}</td></tr>
                </table>
            `);
        }).catch(() => {
            $("#comparison-results").html("<p>Error retrieving comparison data.</p>");
        });
    });
});
