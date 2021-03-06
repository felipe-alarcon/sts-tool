//This handles TAB key in the textarea
$("textarea").keydown(function(e) {
    if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);

        // set textarea value to: text before caret + tab + text after caret
        $this.val($this.val().substring(0, start) +
            "\t" +
            $this.val().substring(end));

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
    }
});

$(function() {
    $("#deleteText").click(function() {
        $("textarea").val("");
    });
});

function regExpression() {
    return /^[0-9!@#\$%\^\&\"\'\/)\(+=.,:;_-]+$/g;
}

String.prototype.escape = function() {
    var tagsToReplace = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        '\'': '&#039;'
    };
    return this.replace(/["\'\&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};

// Checks for extra spaces at the end and beginning
function extraSpaceError(cell) {
    if (extraSpaceCheck(cell)) {
        return '<span class="label label-info text-left">Extra Space</span>';
    } else {
        return ' '
    }
}

// Error return when capitalisation missing
function capitalizationError(cell) {
    if (capitalizationCheck(cell)) {
        return '<span class="label label-warning text-left">Capitalization</span>';
    } else {
        return ' '
    }
}

function characterCount(cell) {
    if (cell.length > 0 && cell.length <= 50) {
        return '<span class="label label-success text-left">' + cell.length + '</span>';
    } else {
        return '<span class="label label-danger text-left">'  + cell.length + '</span>';
    }
}


// checks if a value is numeric or has special characters
function hasNumeric(val) {
    var regex = regExpression();
    if (val.match(regex)) {
        return false;
    } else {
        return true;
    }
}

//returns true if a lower case value is found in the first position
function isLowerCase(value) {
    if (value.charAt(0) === value.charAt(0).toLowerCase() && !value.charAt(0).match(regExpression())) {
        return true;
    }
    if (value.charAt(0).match(regExpression())) {
        if (value.charAt(1) === value.charAt(1).toLowerCase() && !value.charAt(1).match(regExpression())) {
            return true;
        }
    }
    var explode = value.split('');
    for (var i = 0; i < explode.length - 1; i++) {
      if (explode[i].match(regExpression())) {
        if (explode[i + 1] === explode[i + 1].toLowerCase() && !explode[i + 1].match(regExpression())) {
          return true;
        }
      }
    }
}

function extraSpaceCheck(cell) {
    if (cell.slice(0, 1) === ' ' || cell.slice(-1) === ' ') {
        return true;
    }
}

//Pass whole cell and check if every word is capitalized
function capitalizationCheck(cell) {
    var explode = cell.split(' ');
    var cleanEmpty = explode.filter(Boolean);

    console.log(cleanEmpty);

    for (var i = 0; i < cleanEmpty.length; i++) {
        if (hasNumeric(cleanEmpty[i])) {
            if (isLowerCase(cleanEmpty[i])) {
                return true;
            }
        }
    }
}

function intercapCheck(cell) {
    var explode = cell.split(' ');
    var subStr = [];

    for (var i = 0; i < explode.length; i++) {
      //for (var k = 0; cell.length; k++) {
        if (explode[i].charAt(0).match(regExpression())) {
            subStr.push(explode[i].substring(2));
        } else {
            subStr.push(explode[i].substring(1));
        }
      //}
    }
    var letters = subStr.join('').split('');

    for (var e = 0; e < letters.length; e++) {
        if (letters[e] === letters[e].toUpperCase() && letters[e] !== letters[e].toLowerCase()) {
            return true;
        }
    }
}

function intercapError(cell) {
    if (intercapCheck(cell)) {
        return '<span class="label label-default text-left">intercapitalization</span>';
    } else {
        return ' '
    }
}

function wordRepetition(row) {
    var rowList = row.split('\t').join(' ');
    var list = rowList.split(' ');
    var counts = {};
    list.forEach(function(x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
}

function generateTable() {
    // Get values from textarea
    var data = $('textarea[name=excel_data]').val();

    var rows = data.split("\n");

    var table = $('<table />');

    var ul = $('<ul />').addClass('list-group');

    var count = 0;

    for (var y in rows) {
        var li = $('<li />').addClass('list-group-item');
        var cells = rows[y].split("\t");
        var data = wordRepetition(rows[y]);
        var row = $('<tr />');


        if (rows[y].length > 0) {
            count++;
        }
        for (var key in data) {
            if (data[key] > 1 && key.length > 2) {
                li.append('The word <span style="color:red">' + key + '</a></span> is being repeated ' + data[key] + ' Times in line ' + count + ' | ');
            }
        }


        for (var x in cells) {
            if (cells[x].length > 0) {
                row.append('<td><button id="data" class="btn btn-warning" data-clipboard-text="' +
                cells[x].escape() + '"><i class="fa fa-clipboard"></i></button></td>' +
                '<td class="results">' + cells[x].escape() + '</td>' +
                '<td class="results">' + characterCount(cells[x])    +
                capitalizationError(cells[x])        +
                extraSpaceError(cells[x]) + '</td>');
            }
        }
        table.append(row);
        ul.append(li);
    }
    // Insert into DOM
    $('#excel_table').html(table);
    $('#word_repetition').html(ul);
}
