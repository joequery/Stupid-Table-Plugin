/*
 *  IMPORTANT NOTE: Because testing DOM manipulation is really annoying, my
 *  tests will be created using many setTimeouts. This means if your computer
 *  is substantially slower than mine, you may get inconsistent results.
 */
$(function(){
// ===========================================================================
// Test helpers & QUnit callbacks
// ===========================================================================
window.WAIT_TIME_MS = 200;

var get_column_elements = function($table, col_index){
    var vals = [];
    $table.find("tbody tr").each(function(){
        var val = $(this).children("td, th").eq(col_index).html();
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
};

/*
 * In order to accurately simulate a double click, we have to use a slight pause
 * between clicks. During unittests, calling .click() on a column header twice
 * without delay causes the sort to get out of order. I have not been able to
 * reproduce this manually. Maybe some sort of lock is needed...UNTIL THEN!...
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
 * Enable stupid tables at the end for manual testing and experiments
 */
QUnit.done(function(){
    $("#complex").stupidtable({
        "date":function(a,b){
            // Get these into date objects for comparison.
            var aDate = date_from_string(a);
            var bDate = date_from_string(b);

            return aDate - bDate;
        }
    });
    $("#basic").stupidtable();
    $("#basic-colspan").stupidtable();
    $("#complex-colspan").stupidtable();
    $("#stability-test").stupidtable();
    $("#multicolumn-sort-test").stupidtable();
    $("#qunit-fixture").removeClass("test-hidden");
});


/*
 *  Begin tests
 *  NOTE: when to use test vs asyncTest: When you plan on sorting the table and
 *  examining the results, you must use the test_table_state function and have
 *  your test wrapped in asyncTest(). If you wish to only make assertions
 *  regarding the initial state of the html, just use test().
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

    var $table = $("#basic");

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
    var $table = $("#basic");
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
    var $table = $("#basic");
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
    var $table = $("#basic");
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
    var $table = $("#basic");
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

    var $table = $("#complex");

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
    var $table = $("#complex");
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
    var $table = $("#complex");
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
    var $table = $("#complex");
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
    var $table = $("#complex");
    var $table_cols = $table.find("th");


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
    var $table = $("#complex");
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
    var $table = $("#complex");
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
    var $table = $("#complex");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");
    var tbodyStyleBefore = $tbody.attr("style");

    $table.stupidtable();

    // These are initial values hardcoded in the html. We need to make sure they
    // aren't changed once we click a column.
    ok($tbody.hasClass('some-tbody-class'));
    ok(_.isEqual(tbodyStyleBefore, $tbody.attr("style")));

    $table_cols.eq(FLOAT_COLUMN).click();

    test_table_state(function(){
        var $table = $("#complex");
        var $tbody = $table.find("tbody");
        ok($tbody.hasClass('some-tbody-class'));
        ok(_.isEqual(tbodyStyleBefore, $tbody.attr("style")));
    });
});

asyncTest("Basic colspan table sort column before colspan column", function(){
    var LETTER_COLUMN = 0;
    var $table = $("#basic-colspan");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");

    $table.stupidtable();
    $table_cols.eq(LETTER_COLUMN).click();

    test_table_state(function(){
        var expected = ["abc", "bcd", "def"];
        var vals = get_column_elements($table, LETTER_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Basic colspan table sort column after colspan column", function(){
    var NUMBER_COLUMN_TH = 2;
    var NUMBER_COLUMN = 3;
    var $table = $("#basic-colspan");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");

    $table.stupidtable();
    $table_cols.eq(NUMBER_COLUMN_TH).click();

    test_table_state(function(){
        var expected = ["0", "1", "2"];
        var vals = get_column_elements($table, NUMBER_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Basic colspan table sort column on colspan column", function(){
    var COLSPAN_COLUMN = 1;
    var $table = $("#basic-colspan");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");

    $table.stupidtable();
    $table_cols.eq(COLSPAN_COLUMN).click();

    test_table_state(function(){
        var expected = ["X", "Y", "Z"];
        var vals = get_column_elements($table, COLSPAN_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Complex colspan table sort - single click", function(){
    var NUMBER_COLUMN_TH = 3;
    var NUMBER_COLUMN = 3;
    var $table = $("#complex-colspan");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");

    $table.stupidtable();
    $table_cols.eq(NUMBER_COLUMN_TH).click();

    test_table_state(function(){
        var expected = ["0", "1", "2"];
        var vals = get_column_elements($table, NUMBER_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Complex colspan table sort - double click", function(){
    var NUMBER_COLUMN_TH = 3;
    var NUMBER_COLUMN = 3;
    var $table = $("#complex-colspan");
    var $table_cols = $table.find("th");
    var $tbody = $table.find("tbody");

    $table.stupidtable();
    $table_cols.eq(NUMBER_COLUMN_TH).doubleclick();

    test_table_state(function(){
        var expected = ["2", "1", "0"];
        var vals = get_column_elements($table, NUMBER_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Update sort value - same display and sort values - single click", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_column = $table_cols.eq(INT_COLUMN);
    var $first_int_td = $table.find("tbody tr > *").first();

    $table.stupidtable();
    ok(_.isEqual($first_int_td.text(), "15"));

    $first_int_td.updateSortVal(200);
    $first_int_td.text("200");
    $int_column.click();

    test_table_state(function(){
        var expected = ["-53", "2", "95", "195", "200"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Update sort value - same display and sort values - double click", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_column = $table_cols.eq(INT_COLUMN);
    var $first_int_td = $table.find("tbody tr > *").first();

    $table.stupidtable();
    ok(_.isEqual($first_int_td.text(), "15"));

    $first_int_td.updateSortVal(200);
    $first_int_td.text("200");
    $int_column.doubleclick();

    test_table_state(function(){
        var expected = ["200", "195", "95", "2", "-53"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Update sort value - different display and sort value - single click", function(){
    var LETTER_FREQ_COLUMN = 5;
    var $table = $("#complex");
    var $table_cols = $table.find("th");
    var $letter_freq_col = $table_cols.eq(LETTER_FREQ_COLUMN);
    var $e_td = $table.find("[data-sort-value=0]");

    $table.stupidtable();
    $letter_freq_col.click();

    ok(_.isEqual($e_td.text(), "E"));
    ok(_.isEqual($e_td.data('sort-value'), 0));

    $e_td.updateSortVal(10);
    $e_td.html("<b>YO</b>");


    test_table_state(function(){
        var expected = ["T", "A", "O", "I", "<b>YO</b>"];
        var vals = get_column_elements($table, LETTER_FREQ_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Update sort value - different display and sort value - double click", function(){
    var LETTER_FREQ_COLUMN = 5;
    var $table = $("#complex");
    var $table_cols = $table.find("th");
    var $letter_freq_col = $table_cols.eq(LETTER_FREQ_COLUMN);
    var $e_td = $table.find("[data-sort-value=0]");

    $table.stupidtable();
    $letter_freq_col.doubleclick();

    ok(_.isEqual($e_td.text(), "E"));
    ok(_.isEqual($e_td.data('sort-value'), 0));

    $e_td.updateSortVal(10);
    $e_td.html("<b>YO</b>");


    test_table_state(function(){
        var expected = ["<b>YO</b>", "I", "O", "A", "T"];
        var vals = get_column_elements($table, LETTER_FREQ_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Update sort value - also updates data-sort-value attribute", function(){
    var LETTER_FREQ_COLUMN = 5;
    var $table = $("#complex");
    var $table_cols = $table.find("th");
    var $letter_freq_col = $table_cols.eq(LETTER_FREQ_COLUMN);
    var $e_td = $table.find("[data-sort-value=0]");

    $table.stupidtable();
    $letter_freq_col.doubleclick();

    ok(_.isEqual($e_td.text(), "E"));
    ok(_.isEqual($e_td.data('sort-value'), 0));

    $e_td.updateSortVal(10);
    $e_td.html("<b>YO</b>");


    test_table_state(function(){
        var expected = ["<b>YO</b>", "I", "O", "A", "T"];
        var vals = get_column_elements($table, LETTER_FREQ_COLUMN);
        ok(_.isEqual(vals, expected));
        ok(_.isEqual($e_td.attr('data-sort-value'), "10"));
    });
});

asyncTest("Update sort value - display value only doesn't add data-sort-value attribute", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_column = $table_cols.eq(INT_COLUMN);
    var $first_int_td = $table.find("tbody tr > *").first();

    $table.stupidtable();
    ok(_.isEqual($first_int_td.text(), "15"));

    $first_int_td.updateSortVal(200);
    $first_int_td.text("200");
    $int_column.click();

    test_table_state(function(){
        var $first_int_td = $table.find("tbody tr > *").first();
        var expected = ["-53", "2", "95", "195", "200"];
        var vals = get_column_elements($table, INT_COLUMN);

        ok(_.isEqual(vals, expected));
        ok(!$first_int_td.attr('data-sort-value'));
    });
});

asyncTest("Basic individual column sort - no force direction", function(){
    var FLOAT_COLUMN = 1;
    var $table = $("#complex");
    var $table_cols = $table.find("th");

    // Specify a sorting direction
    $table_cols.eq(FLOAT_COLUMN).data('sort-default', 'desc');
    $table.stupidtable();

    $table_cols.eq(FLOAT_COLUMN).stupidsort();

    test_table_state(function(){
        var expected = ["88.5", "36", "-.18", "-152.5", "-858"];
        var vals = get_column_elements($table, FLOAT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Basic individual column sort - force direction", function(){
    var FLOAT_COLUMN = 1;
    var $table = $("#complex");
    var $table_cols = $table.find("th");

    // Specify a sorting direction
    $table_cols.eq(FLOAT_COLUMN).data('sort-default', 'desc');
    $table.stupidtable();

    $table_cols.eq(FLOAT_COLUMN).stupidsort('asc');

    test_table_state(function(){
        var expected = ["-858", "-152.5", "-.18", "36", "88.5"];
        var vals = get_column_elements($table, FLOAT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Sort Stability Testing - 1", function(){
    // Not all browsers implement stable sorting. View the following for more
    // information:
    // http://ofb.net/~sethml/is-sort-stable.html
    // http://codecoding.com/beware-chrome-array-sort-implementation-is-unstable/
    var INDEX_COLUMN = 0;
    var LETTER_COLUMN = 1;
    var $table = $("#stability-test");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(LETTER_COLUMN).click();

    test_table_state(function(){
        var expected = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        var vals = get_column_elements($table, INDEX_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("Sort Stability Testing - 2", function(){
    // Not all browsers implement stable sorting. View the following for more
    // information:
    // http://ofb.net/~sethml/is-sort-stable.html
    // http://codecoding.com/beware-chrome-array-sort-implementation-is-unstable/
    var INDEX_COLUMN = 0;
    var LETTER_COLUMN = 1;
    var $table = $("#stability-test");
    var $table_cols = $table.find("th");

    $table.stupidtable();
    $table_cols.eq(LETTER_COLUMN).doubleclick();

    test_table_state(function(){
        var expected = ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
        var vals = get_column_elements($table, INDEX_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("$th passed to after/before tablesort event handlers", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $th_objs = [];

    $table.stupidtable();
    var $int_header = $table_cols.eq(INT_COLUMN)

    $table.bind('beforetablesort', function(e, data){
        $th_objs.push(data.$th);
    });
    var afterCalls = 0;
    $table.bind('aftertablesort', function(e, data){
        $th_objs.push(data.$th);
    });

    $int_header.click();

    var get_raw_elements = function(arr){
        return _.map(arr, function(el){
            return el[0];
        });
    };

    test_table_state(function(){
        var expected = get_raw_elements([$int_header, $int_header]);
        var raw_th_objs = get_raw_elements($th_objs);
        ok(_.isEqual(raw_th_objs, expected));
    });
});

asyncTest("consective calls to stupidsort in same direction should work (issue #183) ", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_col = $table_cols.eq(INT_COLUMN);
    var $e_td = $table.find("[data-sort-value=2]");

    $table.stupidtable();
    $table_cols.eq(INT_COLUMN).stupidsort($.fn.stupidtable.dir.ASC);

    // Verify we have td with the value 2 in the INT column.
    ok(_.isEqual($e_td.text(), "2"));

    setTimeout(function(){
        var newval = -100;
        $e_td.updateSortVal(newval);
        $e_td.text(newval);

        $table_cols.eq(INT_COLUMN).stupidsort($.fn.stupidtable.dir.ASC);


        test_table_state(function(){
            var expected = ["-100", "-53", "15", "95", "195"];
            var vals = get_column_elements($table, INT_COLUMN);
            ok(_.isEqual(vals, expected));
        });

    }, window.WAIT_TIME_MS);
});

asyncTest("table sorts column onload when specified (issue #180) ", function(){
    var STRING_COLUMN = 2;
    var $table = $("#basic-onload");
    var $table_cols = $table.find("th");
    var $str_col = $table_cols.eq(STRING_COLUMN);

    $table.stupidtable();

    test_table_state(function(){
        var expected = ["apple", "banana", "coke", "orange", "zebra"];
        var vals = get_column_elements($table, STRING_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("test should_redraw setting", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");

    $table.stupidtable_settings({
        should_redraw: function(sort_info){
            return false;
        }
    });
    $table.stupidtable();
    $table_cols.eq(INT_COLUMN).click();

    test_table_state(function(){
        // Redrawing will never occur so we should expect the initial order to
        // be the current column order.
        var expected = ["15", "95", "2", "-53", "195"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("test will_manually_build_table setting - 1", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_column = $table_cols.eq(INT_COLUMN);
    var $first_int_td = $table.find("tbody tr > *").first();

    $table.stupidtable_settings({
        will_manually_build_table: true
    });
    $table.stupidtable();
    ok(_.isEqual($first_int_td.text(), "15"));

    $first_int_td.updateSortVal(200);
    $first_int_td.text("200");
    $int_column.click();

    test_table_state(function(){
        // Since we didn't manually build the table after updating the value, we
        // shouldn't expect the table to sort correctly. 200 will still function
        // as 15
        var expected = ["-53", "2", "200", "95", "195"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("test will_manually_build_table setting - 2", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_column = $table_cols.eq(INT_COLUMN);
    var $first_int_td = $table.find("tbody tr > *").first();

    $table.stupidtable_settings({
        will_manually_build_table: true
    });
    $table.stupidtable();
    ok(_.isEqual($first_int_td.text(), "15"));

    $first_int_td.updateSortVal(200);
    $first_int_td.text("200");

    // Rebuild the table
    $table.stupidtable_build();
    $int_column.click();

    test_table_state(function(){
        // Since we didn't manually build the table after updating the value, we
        // shouldn't expect the table to sort correctly. 200 will still function
        // as 15
        var expected = ["-53", "2", "95", "195", "200"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

asyncTest("test will_manually_build_table setting - 3", function(){
    var INT_COLUMN = 0;
    var $table = $("#basic");
    var $table_cols = $table.find("th");
    var $int_column = $table_cols.eq(INT_COLUMN);
    var $first_int_td = $table.find("tbody tr > *").first();

    $table.stupidtable_settings({
        will_manually_build_table: false
    });
    $table.stupidtable();
    ok(_.isEqual($first_int_td.text(), "15"));

    $first_int_td.updateSortVal(200);
    $first_int_td.text("200");
    $int_column.click();

    test_table_state(function(){
        // Since we didn't manually build the table after updating the value, we
        // shouldn't expect the table to sort correctly. 200 will still function
        // as 15
        var expected = ["-53", "2", "95", "195", "200"];
        var vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

test("Multicolumn table initial order", function(){
    var INT_COLUMN = 0;
    var FLOAT_COLUMN = 1;
    var STRING_COLUMN = 2;
    var expected;
    var vals;

    var $table = $("#multicolumn-sort-test");

    expected = ["1", "1", "2", "0", "1", "2", "0", "0", "0", "1", "2", "3", "2"];
    vals = get_column_elements($table, INT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["10.0", "10.0", "10.0", "20.0", "30.0", "30.0", "10.0", "20.0", "10.0", "20.0", "10.0", "30.0", "30.0"];
    vals = get_column_elements($table, FLOAT_COLUMN);
    ok(_.isEqual(vals, expected));

    expected = ["a", "a", "b", "c", "b", "a", "b", "a", "c", "a", "b", "a", "b"];
    vals = get_column_elements($table, STRING_COLUMN);
    ok(_.isEqual(vals, expected));

});

asyncTest("Basic multicolumn sort", function(){
    var INT_COLUMN = 0;
    var FLOAT_COLUMN = 1;
    var STRING_COLUMN = 2;
    var $table = $("#multicolumn-sort-test");
    var $table_cols = $table.find("thead th");

    $table.stupidtable();
    $table_cols.eq(INT_COLUMN).click();

    test_table_state(function(){
        var expected;
        var vals;

        expected = ["0", "0", "0", "0", "1", "1", "1", "1", "2", "2", "2", "2", "3"];
        vals = get_column_elements($table, INT_COLUMN);
        ok(_.isEqual(vals, expected));

        expected = ["10.0", "10.0", "20.0", "20.0", "10.0", "10.0", "20.0", "30.0", "10.0", "10.0", "30.0", "30.0", "30.0"];
        vals = get_column_elements($table, FLOAT_COLUMN);
        ok(_.isEqual(vals, expected));

        expected = ["b", "c", "a", "c", "a", "a", "a", "b", "b", "b", "a", "b", "a"];
        vals = get_column_elements($table, STRING_COLUMN);
        ok(_.isEqual(vals, expected));
    });
});

}); //jQuery
