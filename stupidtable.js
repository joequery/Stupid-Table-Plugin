// Stupid jQuery table plugin.

(function($) {

  // Expects $("#mytable").stupidtable() to have already been called.
  $.fn.stupidsort = function(force_direction){
    var $this = $(this);
    var th_index = 0; // we'll increment this soon
    var dir = $.fn.stupidtable.dir;
    var $table = $this.closest("table");

    // Account for colspans
    $this.parents("tr").find("th").slice(0, $(this).index()).each(function() {
      var cols = $(this).attr("colspan") || 1;
      th_index += parseInt(cols,10);
    });

    if(arguments.length != 1){
        force_direction = null;
    }
    var sort_dir = force_direction || $this.data("sort-default") || dir.ASC;
    if ($this.data("sort-dir"))
       sort_dir = $this.data("sort-dir") === dir.ASC ? dir.DESC : dir.ASC;

    var datatype = $this.data("sort") || null;

    // No datatype? Nothing to do.
    if (datatype === null) {
      return;
    }

    $table.trigger("beforetablesort", {column: th_index, direction: sort_dir});

    // More reliable method of forcing a redraw
    $table.css("display");

    // Run sorting asynchronously on a timout to force browser redraw after
    // `beforetablesort` callback. Also avoids locking up the browser too much.
    setTimeout(function() {
      // Gather the elements for this column
      var column = [];
      var sortFns = $table.data('sortFns');
      var sortMethod = sortFns[datatype];
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

      // Replace the content of tbody with the sorted rows. Strangely
      // enough, .append accomplishes this for us.
      trs = $.map(column, function(kv) { return kv[1]; });
      $table.children("tbody").append(trs);

      // Reset siblings
      $table.find("th").data("sort-dir", null).removeClass("sorting-desc sorting-asc");
      $this.data("sort-dir", sort_dir).addClass("sorting-"+sort_dir);

      $table.trigger("aftertablesort", {column: th_index, direction: sort_dir});
      $table.css("display");
    }, 10);

  };

  $.fn.stupidtable = function(sortFns) {
    return this.each(function() {
      var $table = $(this);
      sortFns = sortFns || {};
      sortFns = $.extend({}, $.fn.stupidtable.default_sort_fns, sortFns);
      $table.data('sortFns', sortFns);

      $table.on("click.stupidtable", "thead th", function() {
          $(this).stupidsort();
      });
    });
  };

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
