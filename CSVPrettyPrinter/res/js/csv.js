$(document).ready(function() {
    // set to true when input field changes
    var changed = false;
    // show the input tab
    function input() {
        $("#input").show();
        $("#table").hide();
        $("#menuInput").addClass("on");
        $("#menuTable").removeClass("on");
    }
    // render the CSV data into a table
    function render() {
        if (changed) {
            changed = false;
            if ($("#input").val()) {
                try {
                    var data = $.csv.toArrays($("#input").val());
                    // 1x1, convert to single cell
                    if (!data.length) {
                        data = [[$("#input").val()]];
                    }
                    var $table = $("<table/>");
                    // table header
                    if ($("#menuHeader").prop("checked")) {
                        var header = data.splice(0, 1)[0];
                        var $tr = $("<tr/>");
                        for (var j in header) {
                            $tr.append($("<th/>").text(header[j]));
                        }
                        $table.append($("<thead/>").append($tr));
                    }
                    // table data
                    for (var i in data) {
                        var $tr = $("<tr/>");
                        for (var j in data[i]) {
                            $tr.append($("<td/>").text(data[i][j]));
                        }
                        $table.append($tr);
                    }
                    $("#table").html($table);
                    // sort table
                    if ($("#menuHeader").prop("checked") && data.length) {
                        $table.tablesorter();
                    }
                // failed to parse
                } catch (e) {
                    var loc = (/\[Row:([0-9]+)\]\[Col:([0-9]+)\]/g).exec(e.message);
                    if (loc.length === 3) {
                        $("#table").text("Parse error at row " + loc[1] + ", col " + loc[2] + ".");
                    } else {
                        $("#table").text("Unknown parse error.");
                    }
                }
            } else {
                $("#table").text("Enter some CSV data in the Input tab first!");
            }
        }
    }
    // show the table tab
    function table() {
        $("#input").hide();
        $("#table").show();
        $("#menuInput").removeClass("on");
        $("#menuTable").addClass("on");
    }
    $("#menuInput").click(function(e) {
        input();
    });
    // toggle header row status
    $("#menuHeader").change(function(e) {
        changed = true;
        if ($("#menuTable").hasClass("on")) {
            render();
        }
    });
    $("#menuTable").click(function(e) {
        render();
        table();
    });
    // toggle header row status
    $("#menuMono").change(function(e) {
        if ($("#menuMono").prop("checked")) {
            $("#table").addClass("mono");
        } else {
            $("#table").removeClass("mono");
        }
    });
    $("#menuLink").mouseover(function(e) {
        if ($("#input").val()) {
            // store options in ?query
            var params = [];
            if ($("#menuHeader").prop("checked")) {
                params.push("header");
            }
            if ($("#menuTable").hasClass("on")) {
                params.push("table");
            }
            if ($("#menuMono").prop("checked")) {
                params.push("mono");
            }
            // store data in #hash
            var link = location.protocol + "//" + location.hostname + location.pathname + (params.length ? "?" + params.join("&") : "")+ "#" + encodeURIComponent($("#input").val());
            $("#menuLinkText").val(link).show().focus().select();
            $("#menuLink").hide();
        } else {
            $("#menuLink").text("No data!");
        }
    }).mouseout(function(e) {
        $("#menuLink").text("Link");
    });
    $("#menuLinkText").mouseout(function(e) {
        $("#menuLinkText").hide();
        $("#menuLink").show();
    });
    // mark input field as changed
    $("#input").change(function(e) {
        changed = true;
    });
    // load data from URL
    if (location.hash) {
        // get data from #hash
        $("#input").val(decodeURIComponent(location.hash.substr(1, location.hash.length)));
        var switchTable = false;
        if (location.search) {
            // get options from ?query
            var params = location.search.substr(1, location.search.length).split("&");
            for (var i in params) {
                switch (params[i]) {
                    case "header":
                        $("#menuHeader").prop("checked", true);
                        break;
                    case "table":
                        switchTable = true;
                        break;
                    case "mono":
                        $("#menuMono").prop("checked", true);
                        break;
                }
            }
        }
        changed = true;
        if (switchTable) {
            render();
            table();
        }
    }
});
