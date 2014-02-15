/*
 *  IMPORTANT NOTE: Because testing DOM manipulation is really annoying, my
 *  tests will be created using many setTimeouts. This means if your computer
 *  is substantially slower than mine, you may get inconsistent results.
 */

$(function(){
// ===========================================================================
// Test helpers & QUnit callbacks
// ===========================================================================
window.WAIT_TIME_MS = 50;
window.TEST_TABLES = ["#basic-table", "#complex-table"];
window.TEST_TABLES_ORIG_HTML = {};

var get_column_elements = function($table, col_index){
    var vals = [];
    $table.find("tbody tr").each(function(){
        var val = $(this).children("td").eq(col_index).text();
        vals.push(val);
    });
    return vals;
};

var test_table_state = function(fn){
    setTimeout(function(){
        fn();
        QUnit.start();
    }, WAIT_TIME_MS);
};

/* 
 * We have to use a slight pause between clicks to avoid testing issues. I
 * certainly have not noticed any time where a human rapidly clicking has thrown
 * off the sort order of the tables, but during unittests the rapid "clicking"
 * of the table columns causes the sort to get out of order.
 */
$.fn.doubleclick = function(){
    var $this = $(this);
    $this.click();
    setTimeout(function(){
        $this.click();
    }, 10);
    return this;
};

/* 
 * We do this to reset the table html and unbind stupidtable.
 */
QUnit.begin(function(){
    for(var i=0; i<TEST_TABLES.length; i++){
        var selector = TEST_TABLES[i];
        var html = $(selector).parent('.tablewrap').html();
        TEST_TABLES_ORIG_HTML[selector] = html;
    }
});

QUnit.testStart(function(){
    for(var i=0; i<TEST_TABLES.length; i++){
        var selector = TEST_TABLES[i];
        var html = TEST_TABLES_ORIG_HTML[selector];
        $(selector).parent(".tablewrap").html(html);
    }
});


/*
 *  Begin tests
 */

// =============================================================================
// basic table
// =============================================================================
test("Basic table initial order", function(){
    var INT_COLUMN = 0;
    var FLOAT_COLUMN = 1;
    var STRING_COLUMN = 2;
    var expected;
    var vals;

    var $table = $("#basic-table");

    expected = ["15", "95", "2", "-53", "195"];
    vals = get_column_elements($table, INT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["-.18", "36", "-152.5", "88.5", "-858"];
    vals = get_column_elements($table, FLOAT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["banana", "coke", "apple", "zebra", "orange"];
    vals = get_column_elements($table, STRING_COLUMN);
    ok(_.isEqual(vals, expected));

});

asyncTest("Basic int sort", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic-table");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(INT_COLUMN).click();

    test_table_state(function(){
        var expected = ["-53", "2", "15", "95", "195"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Basic float sort", function(){
    var FLOAT_COLUMN = 1;
    var $table = $("#basic-table");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(FLOAT_COLUMN).click();

    test_table_state(function(){
        var expected = ["-858", "-152.5", "-.18", "36", "88.5"];
        var vals = get_column_elements($table, FLOAT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Basic string sort", function(){
    var STRING_COLUMN = 2;
    var $table = $("#basic-table");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(STRING_COLUMN).click();

    test_table_state(function(){
        var expected = ["apple", "banana", "coke", "orange", "zebra"];
        var vals = get_column_elements($table, STRING_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Basic alternating sort", function(){
    // A double click should cause the sort to reverse
    var INT_COLUMN = 0;
    var $table = $("#basic-table");
    var $table_cols = $table.find("th");
    $table.stupidtable();

    $table_cols.eq(INT_COLUMN).doubleclick();

    test_table_state(function(){
        var expected = ["195", "95", "15", "2", "-53"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});


// =============================================================================
// complex table
// =============================================================================
test("Complex table initial order", function(){
    var INT_COLUMN = 0;
    var FLOAT_COLUMN = 1;
    var STRING_COLUMN = 2;
    var NOSORT_COLUMN = 3;
    var DATE_COLUMN = 4;
    var LETTER_FREQ_COLUMN = 5;
    var expected;
    var vals;

    var $table = $("#complex-table");

    expected = ["15", "95", "2", "-53", "195"];
    vals = get_column_elements($table, INT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["-.18", "36", "-152.5", "88.5", "-858"];
    vals = get_column_elements($table, FLOAT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["Homer", "purple", "is", "a", "fruit"];
    vals = get_column_elements($table, STRING_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["arbitrary", "pointless", "silly", "eccentric", "garbage"];
    vals = get_column_elements($table, NOSORT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["Sep 15, 2002", "Aug 07, 2004", "Mar 15, 1986", "Feb 27, 2086",
                "Mar 15, 1986"];
    vals = get_column_elements($table, DATE_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["E", "T", "A", "O", "I"];
    vals = get_column_elements($table, LETTER_FREQ_COLUMN);
    ok(_.isEqual(vals, expected));
});

asyncTest("No data-sort means no sort", function(){
    var NOSORT_COLUMN = 3;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(NOSORT_COLUMN).click();

    test_table_state(function(){
        var expected = ["arbitrary", "pointless", "silly", "eccentric", "garbage"];
        var vals = get_column_elements($table, NOSORT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("data-sort-by values should be used over text values", function(){
    var LETTER_FREQ_COLUMN = 5;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(LETTER_FREQ_COLUMN).click();

    test_table_state(function(){
        var expected = ["E", "T", "A", "O", "I"];
        var vals = get_column_elements($table, LETTER_FREQ_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("case insensitive string sort", function(){
    var STRING_COLUMN = 2;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(STRING_COLUMN).click();

    test_table_state(function(){
        var expected = ["a", "fruit", "Homer", "is", "purple"];
        var vals = get_column_elements($table, STRING_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("custom sort functions", function(){
    var DATE_COLUMN = 4;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");

    var date_from_string = function(str){
        var months = ["jan","feb","mar","apr","may","jun","jul",
        "aug","sep","oct","nov","dec"];
        var pattern = "^([a-zA-Z]{3})\\s*(\\d{2}),\\s*(\\d{4})$";
        var re = new RegExp(pattern);
        var DateParts = re.exec(str).slice(1);

        var Year = DateParts[2];
        var Month = $.inArray(DateParts[0].toLowerCase(), months);
        var Day = DateParts[1];
        return new Date(Year, Month, Day);
    }

    $table.stupidtable({
        "date":function(a,b){
            // Get these into date objects for comparison.
            var aDate = date_from_string(a);
            var bDate = date_from_string(b);

            return aDate - bDate;
        }
    });

    $table_cols.eq(DATE_COLUMN).click();
    test_table_state(function(){
        var expected = ["Mar 15, 1986", "Mar 15, 1986", "Sep 15, 2002", "Aug 07, 2004",
                        "Feb 27, 2086"];
        var vals = get_column_elements($table, DATE_COLUMN);
        ok(_.isEqual(vals, expected));
    });

});

asyncTest("default sort direction - DESC", function(){
    var FLOAT_COLUMN = 1;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");

    $table_cols.eq(FLOAT_COLUMN).data('sort-default', 'desc');
    $table.stupidtable();
    $table_cols.eq(FLOAT_COLUMN).click();

    test_table_state(function(){
        var expected = ["88.5", "36", "-.18", "-152.5", "-858"];
        var vals = get_column_elements($table, FLOAT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("default sort direction - ASC", function(){
    var FLOAT_COLUMN = 1;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");

    $table_cols.eq(FLOAT_COLUMN).data('sort-default', 'asc');
    $table.stupidtable();
    $table_cols.eq(FLOAT_COLUMN).click();

    test_table_state(function(){
        var expected = ["-858", "-152.5", "-.18", "36", "88.5"];
        var vals = get_column_elements($table, FLOAT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("sorting should preserve tbody classes", function(){
    var FLOAT_COLUMN = 1;
    var $table = $("#complex-table");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");

    $table_cols.eq(FLOAT_COLUMN).data('sort-default', 'asc');
    $table.stupidtable();

    // These are initial values hardcoded in the html. We need to make sure they
    // aren't changed once we click a column.
    ok($tbody.hasClass('some-tbody-class'));
    ok(_.isEqual("border: 2px;", $tbody.attr("style")));

    $table_cols.eq(FLOAT_COLUMN).click();

    test_table_state(function(){
        var $table = $("#complex-table");
        var $tbody = $table.find("tbody");
        ok($tbody.hasClass('some-tbody-class'));
        ok(_.isEqual("border: 2px;", $tbody.attr("style")));
    });
});

}); //jQuery
