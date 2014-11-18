// Stupid jQuery table plugin.

// Call on a table
// sortFns: Sort functions for your datatypes.
(function($) {

  $.fn.stupidtable = function(sortFns) {
    return this.each(function() {
      var $table = $(this);
      sortFns = sortFns || {};

      // Merge sort functions with some default sort functions.
      sortFns = $.extend({}, $.fn.stupidtable.default_sort_fns, sortFns);
	  
      // Preserve the sort functions
      $table.data("sortFns", sortFns);

      // ==================================================== //
      //                  Begin execution!                    //
      // ==================================================== //

      // Do sorting when THs are clicked
      $table.on("click.stupidtable", "thead th", function() {
        var $this = $(this);
        var th_index = 0;
        var dir = $.fn.stupidtable.dir;

        // Account for colspans
        $this.parents("tr").find("th").slice(0, $this.index()).each(function() {
          var cols = $(this).attr("colspan") || 1;
          th_index += parseInt(cols,10);
        });

        // Determine (and/or reverse) sorting direction, default `asc`
        var sort_dir = $this.data("sort-default") || dir.ASC;
        if ($this.data("sort-dir"))
           sort_dir = $this.data("sort-dir") === dir.ASC ? dir.DESC : dir.ASC;

        $.fn.stupidtable.sortByColumn.call($table, th_index, sort_dir);
      });
    });
  };
  
  $.fn.stupidtable.sortByColumn = function (th_index, sort_dir) {
    var $table = $(this);

    var $this = $.fn.stupidtable.getColumnByIndex.call($table, th_index);

    // Prevent sorting on invalid column indexes
    if ($this === null) {
      return;
    }
    var dir = $.fn.stupidtable.dir;

    // Restore the sort functions
    var sortFns = $table.data("sortFns");

    // Choose appropriate sorting function.
    var type = $this.data("sort") || null;

    // Prevent sorting if no type defined
    if (type === null) {
      return;
    }

    // Trigger 'beforetablesort' event that calling scripts can hook into;
    // pass parameters for sorted column index and sorting direction
    $table.trigger("beforetablesort", {column: th_index, direction: sort_dir});

    // More reliable method of forcing a redraw
    $table.css("display");

    // Run sorting asynchronously on a timeout to force browser redraw after
    // 'beforetablesort' callback. Also avoids locking up the browser too much.
    setTimeout(function() {
      // Gather the elements for this column
      var column = [];
      var sortMethod = sortFns[type];
      var trs = $table.children("tbody").children("tr");

      // Extract the data for the column that needs to be sorted and pair it up
      // with the TR itself into a tuple
      trs.each(function(index,tr) {
        var $e = $(tr).children().eq(th_index);
        var sort_val = $e.data("sort-value");
        var order_by = typeof(sort_val) !== "undefined" ? sort_val : $e.text();
        column.push([order_by, tr]);
      });

      // Sort by the data-order-by value
      column.sort(function(a, b) { return sortMethod(a[0], b[0]); });
      if (sort_dir != dir.ASC)
        column.reverse();

      // Replace the content of tbody with the sorted rows. Strangely (and
      // conveniently!) enough, .append accomplishes this for us.
      trs = $.map(column, function(kv) { return kv[1]; });
      $table.children("tbody").append(trs);

      // Reset siblings
      $table.find("th").data("sort-dir", null).removeClass("sorting-desc sorting-asc");
      $this.data("sort-dir", sort_dir).addClass("sorting-"+sort_dir);

      // Trigger 'aftertablesort' event. Similar to `beforetablesort`
      $table.trigger("aftertablesort", {column: th_index, direction: sort_dir});

      // More reliable method of forcing a redraw
      $table.css("display");
    }, 10);
  };
  
  $.fn.stupidtable.getColumnByIndex = function (th_index) {
    var $table = $(this);
    var $this = null;
    var cur_th_index = 0;
    var found = false;

    // Account for colspans
    $table.find("thead th").each(function() {
      if (cur_th_index >= th_index && !found) {
        found = true;
        $this = $(this);
      }
      var cols = $(this).attr("colspan") || 1;
      cur_th_index += parseInt(cols,10);
    });

    return $this;
  };
  
  $.fn.stupidtable.remove = function () {
    var $table = $(this);
    $table.data("sortFns", null);
    $table.off("click.stupidtable", "thead th");
  };
  
  // Enum containing sorting directions
  $.fn.stupidtable.dir = {ASC: "asc", DESC: "desc"};

  $.fn.stupidtable.default_sort_fns = {
    "int": function(a, b) {
      return parseInt(a, 10) - parseInt(b, 10);
    },
    "float": function(a, b) {
      return parseFloat(a) - parseFloat(b);
    },
    "string": function(a, b) {
      return a.localeCompare(b);
    },
    "string-ins": function(a, b) {
      a = a.toLocaleLowerCase();
      b = b.toLocaleLowerCase();
      return a.localeCompare(b);
    }
  };

})(jQuery);
