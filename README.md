Stupid jQuery Table Sort
========================

This is a stupid jQuery table sorting plugin. Nothing fancy, nothing really
impressive. Overall, stupidly simple. Requires jQuery 1.7 or newer.

[View the demo here][0]

See the examples directory.

Installation via [npm][2]
-------------------------

    $ npm i stupid-table-plugin

Installation via Bower
----------------------

    $ bower install jquery-stupid-table


Example Usage
-------------

The JS:

    $("table").stupidtable();

The HTML:

    <table>
      <thead>
        <tr>
          <th data-sort="int">int</th>
          <th data-sort="float">float</th>
          <th data-sort="string">string</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>15</td>
          <td>-.18</td>
          <td>banana</td>
        </tr>
        ...
        ...
        ...

The thead and tbody tags must be used.

Add a `data-sort` attribute of "DATATYPE" to the th elements to make them sortable
by that data type. If you don't want that column to be sortable, just omit the
`data-sort` attribute.


Predefined data types
---------------------

Our aim is to keep this plugin as lightweight as possible. Consequently, the
only predefined datatypes that you can pass to the th elements are

* `int`
* `float`
* `string` (case-sensitive)
* `string-ins` (case-insensitive)

These data types will be sufficient for many simple tables. However, if you need
different data types for sorting, you can easily create your own!

Data with multiple representations/predefined order
---------------------------------------------------

Stupid Table lets you sort a column by computer friendly values while displaying
human friendly values via the `data-sort-value` attribute on a td element. For
example, to sort timestamps (computer friendly) but display pretty formated
dates (human friendly)

    <table>
      <thead>
        <tr>
          <th data-sort="string">Name</th>
          <th data-sort="int">Birthday</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Joe McCullough</td>
          <td data-sort-value="672537600">April 25, 1991</td>
        </tr>
        <tr>
          <td>Clint Dempsey</td>
          <td data-sort-value="416016000">March 9, 1983</td>
        </tr>
        ...
        ...
        ...

In this example, Stupid Table will sort the Birthday column by the timestamps
provided in the `data-sort-value` attributes of the corresponding tds. Since
timestamps are integers, and that's what we're sorting the column by, we specify
the Birthday column as an `int` column in the `data-sort` value of the column
header.


Default sorting direction
-------------------------

By default, columns will sort ascending. You can specify a column to sort "asc"
or "desc" first.

    <table>
      <thead>
        <tr>
            <th data-sort="float" data-sort-default="desc">float</th>
            ...
        </tr>
      </thead>
    </table>

Sorting a column on load
------------------------

If you want a specific column to be sorted immediately after
`$table.stupidtable()` is called, you can provide a `data-sort-onload=yes`
attribute.

    <table>
      <thead>
        <tr>
            <th data-sort="float" data-sort-onload=yes>float</th>
            ...
        </tr>
      </thead>
    </table>

Multicolumn sorting
-------------------

A multicolumn sort allows you to define secondary columns to sort by in the
event of a tie with two elements in the sorted column. See [examples/multicolumn-sort.html](https://rawgit.com/joequery/Stupid-Table-Plugin/master/examples/multicolumn-sort.html).
Specify a comma-separated list of th identifiers in a `data-sort-multicolumn`
attribute on a `<th>` element. An identifier can be an integer (which represents
the index of the th element of the multicolumn target) or a string (which
represents the id of the th element of the multicolumn target).

  <table>
    <thead>
      <tr>
        <th id="int-column" data-sort="int" data-sort-multicolumn="1,string-column">int</th>
        <th id="float-column" data-sort="float" data-sort-multicolumn="string-column,int-column">float</th>
        <th id="string-column" data-sort="string" data-sort-multicolumn="1,0">string</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>10.0</td>
        <td>a</td>
      </tr>
      <tr>
        <td>1</td>
        <td>10.0</td>
        <td>a</td>
      </tr>

Sorting a column programatically
--------------------------------

After you have called `$("#mytable").stupidtable()`, if you wish to sort a
column without requiring the user to click on it, select the column th and call


    var $table = $("#mytable").stupidtable();
    var $th_to_sort = $table.find("thead th").eq(0);
    $th_to_sort.stupidsort();

    // You can also force a direction.
    $th_to_sort.stupidsort('asc');
    $th_to_sort.stupidsort('desc');

Updating a table cell's value
-----------------------------

If you wish for Stupid Table to respond to changes in the table cell values, you
must explicitely inform Stupid Table to update its cache with the new values. If
you update the table display/sort values without using this mechanism, your
newly updated table **will not sort correctly!**

    /*
     * Suppose $age_td is some td in a table under a column specified as an int
     * column. stupidtable() must already be called for this table.
     */
    $age_td.updateSortVal(23);

Note that this only changes the internal sort value (whether you specified a
`data-sort-value` or not). Use the standard jQuery `.text()` / `.html()` methods
if you wish to change the display values.


Callbacks
---------

To execute a callback function after a table column has been sorted, you can
bind on `aftertablesort`.

    var table = $("table").stupidtable();
    table.bind('aftertablesort', function (event, data) {
        // data.column - the index of the column sorted after a click
        // data.direction - the sorting direction (either asc or desc)
        // data.$th - the th element (in jQuery wrapper)
        // $(this) - this table object

        console.log("The sorting direction: " + data.direction);
        console.log("The column index: " + data.column);
    });

Similarly, to execute a callback before a table column has been sorted, you can
bind on `beforetablesort`.

See the complex_example.html file.

Creating your own data types
----------------------------

Sometimes you don't have control over the HTML produced by the backend. In the
event you need to sort complex data without a `data-sort-value` attribute, you
can create your own data type. Creating your own data type for sorting purposes
is easy as long as you are comfortable using custom functions for sorting.
Consult [Mozilla's Docs][1] if you're not.

Let's create an alphanum datatype for a User ID that takes strings in the form
"D10", "A40", and sorts the column based on the numbers in the string.

    <thead>
      <tr>
        <th data-sort="string">Name</th>
        <th data-sort="int">Age</th>
        <th data-sort="alphanum">UserID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Joseph McCullough</td>
        <td>20</td>
        <td>D10</td>
      </tr>
      <tr>
        <td>Justin Edwards</td>
        <td>29</td>
        <td>A40</td>
      </tr>
      ...
      ...
      ...

Now we need to specify how the **alphanum** type will be sorted. To do that,
we do the following:

    $("table").stupidtable({
      "alphanum":function(a,b){

        var pattern = "^[A-Z](\\d+)$";
        var re = new RegExp(pattern);

        var aNum = re.exec(a).slice(1);
        var bNum = re.exec(b).slice(1);

        return parseInt(aNum,10) - parseInt(bNum,10);
      }
    });

This extracts the integers from the cell and compares them in the style
that sort functions use.

StupidTable Settings
--------------------

As of 1.1.0 settings have been introduced. Settings are defined like so:

    var $table = $("#mytable");
    $table.stupidtable_settings({
        // Settings for this table specified here
    });
    $table.stupidtable();

Listed below are the available settings.

### will_manually_build_table

(Introduced in verison 1.1.1)

Options:

* `true`
* `false` (default)

By default, every time a column is sorted, stupidtable reads the DOM to extract
all the values from the table. For tables that will not change or for very large
tables, this behavior may be suboptimal.  To modify this behavior, set the
`will_manually_build_table` setting to `true`. However, you will be responsible
for informing stupidtable that the table has been modified by calling
`$table.stupidtable_build()`.

    var $table = $("#mytable");
    $table.stupidtable_settings({
        will_manually_build_table: true
    });
    $table.stupidtable();

    // Make some modification to the table, such as deleting a row
    ...
    ...

    // Since will_manually_build_table is true, we must build the table in order
    // for future sorts to properly handle our modifications.
    $table.stupidtable_build();

### should_redraw

(Introduced in verison 1.1.0)

The `should_redraw` setting allows you to specify a function that determines
whether or not the table should be redrawn after it has been internally sorted.

The `should_redraw` function takes a `sort_info` object as an argument. The
object keys available are:

*  `column` - An array representing the sorted column. Each element of the array is of the form `[sort_val, $tr, index]`
*  `sort_dir` - `"asc"` or `"desc"`
*  `$th` - The jquery object of the `<th>` element that was clicked
*  `th_index` - The index of the `<th>` element that was cliked
*  `$table` - The jquery object of the `<table>` that contains the `<th>` that was clicked
*  `datatype` - The datatype of the column
*  `compare_fn` - The sort/compare function associated with the `<th>` clicked.

**Example**: If you want to prevent stupidtable from redrawing the table if the
column sorted has all identical values, you would do the following:

    var $table = $("#mytable");
    $table.stupidtable_settings({
        should_redraw: function(sort_info){
          var sorted_column = sort_info.column;
          var first_val = sorted_column[0];
          var last_val = sorted_column[sorted_column.length - 1][0];

          // If first and last element of the sorted column are the same, we
          // can assume all elements are the same.
          return sort_info.compare_fn(first_val, last_val) !== 0;
        }
    });
    $table.stupidtable();

License
-------

The Stupid jQuery Plugin is licensed under the MIT license. See the LICENSE
file for full details.

Tests
-----

Visit `tests/test.html` in your browser to run the QUnit tests.


[0]: http://joequery.github.io/Stupid-Table-Plugin/
[1]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
[2]: https://www.npmjs.com/package/stupid-table-plugin
