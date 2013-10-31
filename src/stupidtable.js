(function() {
  $(function() {
    $.fn.stupidtable = function(sortFns) {
      return this.each(function() {
        var $table, apply_sort_map, default_sort_th, default_th, sort_map, sort_table;
        $table = $(this);
        default_sort_th = $table.data('default-sort-th');
        default_th = default_sort_th ? $table.find('th#' + default_sort_th) : null;
        sortFns = sortFns || {};
        sortFns = $.extend({}, $.fn.stupidtable.default_sort_fns, sortFns);
        sort_map = function(arr, sort_function, reverse_column) {
          var i, index, map, sorted, _i, _j, _ref, _ref1;
          map = [];
          index = 0;
          if (reverse_column) {
            for (i = _i = _ref = arr.length - 1; _i >= 0; i = _i += -1) {
              map.push(i);
            }
          } else {
            sorted = arr.slice(0).sort(sort_function);
            for (i = _j = 0, _ref1 = arr.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
              index = $.inArray(arr[i], sorted);
              while ($.inArray(index, map) !== -1) {
                index++;
              }
              map.push(index);
            }
          }
          return map;
        };
        apply_sort_map = function(arr, map) {
          var clone, i, newIndex, _i, _ref;
          clone = arr.slice(0);
          newIndex = 0;
          for (i = _i = 0, _ref = map.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            newIndex = map[i];
            clone[newIndex] = arr[i];
          }
          return clone;
        };
        sort_table = function(clicked_th) {
          var $this, dir, sort_dir, th_index, trs, type;
          trs = $table.children("tbody").children("tr");
          $this = clicked_th;
          th_index = 0;
          dir = $.fn.stupidtable.dir;
          $table.find("th").slice(0, $this.index()).each(function() {
            var cols;
            cols = $(this).attr("colspan") || 1;
            return th_index += parseInt(cols, 10);
          });
          sort_dir = $this.data("sort-dir") === dir.ASC ? dir.DESC : dir.ASC;
          if (sort_dir === dir.DESC) {
            type = $this.data("sort-desc") || $this.data("sort") || null;
          } else {
            type = $this.data("sort") || null;
          }
          if (type === null) {
            return;
          }
          $table.trigger("beforetablesort", {
            column: th_index,
            direction: sort_dir
          });
          $table.css("display");
          return setTimeout(function() {
            var column, reverse_column, sortMethod, sortedTRs, theMap;
            column = [];
            sortMethod = sortFns[type];
            trs.each(function(index, tr) {
              var $e, order_by, sort_val;
              $e = $(tr).children().eq(th_index);
              sort_val = $e.data("sort-value");
              order_by = typeof sort_val !== "undefined" ? sort_val : $e.text();
              return column.push(order_by);
            });
            reverse_column = !!$this.data("sort-dir") && !$this.data("sort-desc");
            theMap = sort_map(column, sortMethod, reverse_column);
            $table.find("th").data("sort-dir", null).removeClass("sorting-desc sorting-asc");
            $this.data("sort-dir", sort_dir).addClass("sorting-" + sort_dir);
            sortedTRs = $(apply_sort_map(trs, theMap));
            $table.children("tbody").append(sortedTRs);
            $table.trigger("aftertablesort", {
              column: th_index,
              direction: sort_dir
            });
            return $table.css("display");
          }, 10);
        };
        $table.on("click", "th", function() {
          return sort_table($(this));
        });
        if (default_th && default_th.length === 1) {
          return sort_table(default_th);
        }
      });
    };
    $.fn.stupidtable.dir = {
      ASC: "asc",
      DESC: "desc"
    };
    return $.fn.stupidtable.default_sort_fns = {
      "int": function(a, b) {
        return parseInt(a, 10) - parseInt(b, 10);
      },
      "float": function(a, b) {
        return parseFloat(a) - parseFloat(b);
      },
      "string": function(a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return +1;
        }
        return 0;
      },
      "string-ins": function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return +1;
        }
        return 0;
      }
    };
  });

}).call(this);
