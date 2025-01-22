$(document).ready(function () {
    const baseUrl = "https://www.carqueryapi.com/api/0.3/";

    function loadMakes(selectId) {
        $.getJSON(baseUrl + "?callback=?", { cmd: "getMakes" }, function (data) {
            const select = $(selectId);
            select.empty().append('<option value="">Select a Make</option>');
            data.Makes.forEach(make => {
                select.append(`<option value="${make.make_id}">${make.make_display}</option>`);
            });
        });
    }

    function loadModels(makeSelectId, modelSelectId, yearSelectId, trimSelectId, previewDiv) {
        $(makeSelectId).on("change", function () {
            const make = $(this).val();
            const modelSelect = $(modelSelectId);
            const yearSelect = $(yearSelectId);
            const trimSelect = $(trimSelectId);
            $(previewDiv).empty();
            modelSelect.empty().append('<option value="">Select a Model</option>');
            yearSelect.empty().append('<option value="">Select a Year</option>');
            trimSelect.empty().append('<option value="">Select a Trim</option>');
            
            if (make) {
                $.getJSON(baseUrl + "?callback=?", { cmd: "getModels", make }, function (data) {
                    data.Models.forEach(model => {
                        modelSelect.append(`<option value="${model.model_name}">${model.model_name}</option>`);
                    });
                });
            }
        });
    }

    function loadYears(makeSelectId, modelSelectId, yearSelectId, trimSelectId) {
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

    function loadTrims(makeSelectId, modelSelectId, yearSelectId, trimSelectId, previewDiv) {
        $(yearSelectId).on("change", function () {
            const make = $(makeSelectId).val();
            const model = $(modelSelectId).val();
            const year = $(this).val();
            const trimSelect = $(trimSelectId);
            $(previewDiv).empty();
            trimSelect.empty().append('<option value="">Select a Trim</option>');
            
            if (make && model && year) {
                $.getJSON(baseUrl + "?callback=?", { cmd: "getTrims", make, model, year }, function (data) {
                    data.Trims.forEach(trim => {
                        trimSelect.append(`<option value="${trim.model_id}">${trim.model_name} ${trim.model_trim}</option>`);
                    });
                });
            }
        });
    }

    function showPreview(trimSelectId, previewDiv) {
        $(trimSelectId).on("change", function () {
            const trimId = $(this).val();
            $(previewDiv).empty();
            if (trimId) {
                $.getJSON(baseUrl + "?callback=?", { cmd: "getModel", model: trimId }, function (data) {
                    const details = data[0] || {};
                    $(previewDiv).html(`
                        <strong>${details.model_name} ${details.model_trim} (${details.model_year})</strong><br>
                        Engine: ${details.model_engine_cc}cc, ${details.model_engine_power_hp} HP<br>
                        Torque: ${details.model_engine_torque_nm} Nm<br>
                        Fuel Efficiency: ${details.model_lkm_mixed} L/100km<br>
                        Top Speed: ${details.model_top_speed_kph} km/h<br>
                        Weight: ${details.model_weight_kg} kg
                    `);
                });
            }
        });
    }

    function calculateSportinessScore(details) {
        let score = 0;
        const power = details.model_engine_power_hp || 0;
        const weight = details.model_weight_kg || 0;
        const acceleration = details.model_0_to_100_kph || 0;
        const topSpeed = details.model_top_speed_kph || 0;
        const drive = details.model_drive || "";
        const transmission = details.model_transmission_type || "";
        const rpm = details.model_engine_rpm || 0;
        
        const pwr = (weight > 0) ? (power / weight) * 1000 : 0;
        const normPWR = Math.min((pwr / 0.2) * 30, 30);
        const normAcceleration = (acceleration > 0) ? Math.min((10 / acceleration) * 25, 25) : 0;
        const normTopSpeed = Math.min((topSpeed / 350) * 20, 20);
        
        score += normPWR + normAcceleration + normTopSpeed;
        if (drive.includes("RWD") || drive.includes("AWD")) score += 5;
        if (transmission.includes("Manual")) score += 3;
        if (rpm > 7000) score += 3;
        return Math.min(score, 100);
    }

    $("#compare-btn").on("click", function () {
        const trim1 = $("#trim-1").val();
        const trim2 = $("#trim-2").val();
        
        if (!trim1 || !trim2) {
            alert("Please select both vehicles completely, including trim.");
            return;
        }
        
        Promise.all([
            $.getJSON(baseUrl + "?callback=?", { cmd: "getModel", model: trim1 }),
            $.getJSON(baseUrl + "?callback=?", { cmd: "getModel", model: trim2 })
        ]).then(([data1, data2]) => {
            const details1 = data1[0] || {};
            const details2 = data2[0] || {};
            
            $("#comparison-results").html(`
                <h2>Comparison Results</h2>
                <table border="1">
                    <tr><th>Feature</th><th>${details1.model_name || "N/A"}</th><th>${details2.model_name || "N/A"}</th></tr>
                    <tr><td>Make</td><td>${details1.make_display || "N/A"} (${details1.make_country || "N/A"})</td><td>${details2.make_display || "N/A"} (${details2.make_country || "N/A"})</td></tr>
                    <tr><td>Engine</td><td>${details1.model_engine_cc || "N/A"}cc (${details1.model_engine_l || "N/A"} l), ${details1.model_engine_power_hp || "N/A"} HP, ${details1.model_engine_type || "N/A"} ${details1.model_engine_cyl || "N/A"}</td><td>${details2.model_engine_cc || "N/A"}cc (${details2.model_engine_l || "N/A"} l), ${details2.model_engine_power_hp || "N/A"} HP, ${details2.model_engine_type || "N/A"} ${details2.model_engine_cyl || "N/A"}</td></tr>
                    <tr><td>Torque</td><td>${details1.model_engine_torque_nm || "N/A"} Nm</td><td>${details2.model_engine_torque_nm || "N/A"} Nm</td></tr>
                    <tr><td>Engine Position</td><td>${details1.model_engine_position || "N/A"}</td><td>${details2.model_engine_position || "N/A"}</td></tr>
                    <tr><td>Transmission</td><td>${details1.model_transmission_type || "N/A"}</td><td>${details2.model_transmission_type || "N/A"}</td></tr>
                    <tr><td>Drive</td><td>${details1.model_drive || "N/A"}</td><td>${details2.model_drive || "N/A"}</td></tr>
                    <tr><td>Top Speed</td><td>${details1.model_top_speed_kph || "N/A"} km/h</td><td>${details2.model_top_speed_kph || "N/A"} km/h</td></tr>
                    <tr><td>0 - 100 km/h</td><td>${details1.model_0_to_100_kph || "N/A"} s</td><td>${details2.model_0_to_100_kph || "N/A"} s</td></tr>
                    <tr><td>Fuel Type</td><td>${details1.model_engine_fuel || "N/A"}</td><td>${details2.model_engine_fuel || "N/A"}</td></tr>
                    <tr><td>Fuel Efficiency</td><td>${details1.model_lkm_hwy || "N/A"} L/100km (Highway), ${details1.model_lkm_city || "N/A"} L/100km (City), ${details1.model_lkm_mixed || "N/A"} L/100km (Mixed)</td><td>${details2.model_lkm_hwy || "N/A"} L/100km (Highway), ${details2.model_lkm_city || "N/A"} L/100km (City), ${details2.model_lkm_mixed || "N/A"} L/100km (Mixed)</td></tr>
                    <tr><td>Dimensions</td><td>Length: ${details1.model_length_mm || "N/A"} cm, Width: ${details1.model_width_mm || "N/A"} cm, Height: ${details1.model_height_mm || "N/A"} cm</td><td>Length: ${details2.model_length_mm || "N/A"} cm, Width: ${details2.model_width_mm || "N/A"} cm, Height: ${details2.model_height_mm || "N/A"} cm</td></tr>
                    <tr><td>Weight</td><td>${details1.model_weight_kg || "N/A"} kg</td><td>${details2.model_weight_kg || "N/A"} kg</td></tr>
                    <tr><td>Fuel Capacity</td><td>${details1.model_fuel_cap_l || "N/A"} L</td><td>${details2.model_fuel_cap_l || "N/A"} L</td></tr>
                </table>
            `);
        }).catch(() => {
            $("#score-results").html("<p>Error retrieving scoring data.</p>");
        });
    });

    loadMakes("#make-1");
    loadMakes("#make-2");
    loadModels("#make-1", "#model-1", "#year-1", "#trim-1", "#preview-1");
    loadModels("#make-2", "#model-2", "#year-2", "#trim-2", "#preview-2");
    loadYears("#make-1", "#model-1", "#year-1", "#trim-1");
    loadYears("#make-2", "#model-2", "#year-2", "#trim-2");
    loadTrims("#make-1", "#model-1", "#year-1", "#trim-1", "#preview-1");
    loadTrims("#make-2", "#model-2", "#year-2", "#trim-2", "#preview-2");
    showPreview("#trim-1", "#preview-1");
    showPreview("#trim-2", "#preview-2");
});
