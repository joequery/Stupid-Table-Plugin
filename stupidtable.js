// Stupid jQuery table plugin.

// Call on a table
// sortFns: Sort functions for your datatypes.
(function($){
    $.fn.stupidtable = function(sortFns, listeners){
        var table = this; sortFns = sortFns || {}, listeners = listeners || {};

        // ==================================================== //
        //                  Utility functions                   //
        // ==================================================== //

        // Merge sort functions with some default sort functions.
        sortFns = $.extend({}, {
            "int":function(a,b){ return parseInt(a, 10) - parseInt(b,10); },
            "float":function(a,b){ return parseFloat(a) - parseFloat(b); },
            "string":function(a,b){ if (a.toLowerCase()<b.toLowerCase()) return -1; if (a.toLowerCase()>b.toLowerCase()) return +1; return 0;}
        }, sortFns);

        // Array comparison. See http://stackoverflow.com/a/8618383
        var arrays_equal = function(a,b) { return !!a && !!b && !(a<b || b<a);}

        // Return the resulting indexes of a sort so we can apply
        // this result elsewhere. This returns an array of index numbers.
        // return[0] = x means "arr's 0th element is now at x"
        var sort_map =  function(arr, sort_function){
            var sorted = arr.slice(0).sort(sort_function);
            var map = [];
            var index = 0;
            for(var i=0; i<arr.length; i++){
                index = $.inArray(arr[i], sorted);

                // If this index is already in the map, look for the next index.
                // This handles the case of duplicate entries.
                while($.inArray(index, map) != -1){
                    index++;
                }
                map.push(index);
            }
            return map;
        }

        // Apply a sort map to the array.
        var apply_sort_map = function(arr, map){
            var clone = arr.slice(0);
            for(var i=0; i<map.length; i++){
                newIndex = map[i];
                clone[newIndex] = arr[i];
            }
            return clone;
        }

        // Returns true if array is sorted, false otherwise.
        // Checks for both ascending and descending
        var get_array_sort = function(arr, sort_function, direction){
            var clone = arr.slice(0);
            var reversed = arr.slice(0).reverse();
            var sorted = arr.slice(0).sort(sort_function);

            if (arrays_equal(clone, sorted)) {
                return '1'
            } else if (arrays_equal(reversed, sorted)) {
                return '-1'
            }
            else {
                return 0;
            }
        }

        // ==================================================== //
        //                  Begin execution!                    //
        // ==================================================== //
        // Do sorting when THs are clicked
        table.delegate("th", "click", function(){
            var trs = table.find("tbody tr");
            var i = $(this).index();
            var classes = $(this).attr("class");
            var type = null;
            if (classes){
                classes = classes.split(/\s+/);

                for(var j=0; j<classes.length; j++){
                    if(classes[j].search("type-") != -1){
                        type = classes[j];
                        break;
                    }
                }
                if(type){
                    type = type.split('-')[1];
                }
                else{
                    type = "string";
                }
            }
            // Don't attempt to sort if no data type
            if(!type){return false;}

            var sortMethod = sortFns[type];

            // Gather the elements for this column
            column = [];

            // Push either the value of the 'data-order-by' attribute if specified
            // or just the text() value in this column to column[] for comparison.
            trs.each(function(index,tr){
                var e = $(tr).children().eq(i);
                var order_by = e.attr('data-order-by') || e.text();
                column.push(order_by);
            });

            // If the column is already sorted, just reverse the order. The sort
            // map is just reversing the indexes.
            var currentDirection = get_array_sort(column, sortMethod);
            if(currentDirection == 1){
                column.reverse();
                var theMap = [];
                for(var i=column.length-1; i>=0; i--){
                    theMap.push(i);
                }
                currentDirection = -1;
            }
            else{
                // Get a sort map and apply to all rows
                theMap = sort_map(column, sortMethod);
                currentDirection = 1;
            }

            var sortedTRs = $(apply_sort_map(trs, theMap));

            // Replace the content of tbody with the sortedTRs. Strangely (and
            // conveniently!) enough, .append accomplishes this for us.
            table.find("tbody").append(sortedTRs);

            if (listeners.sort) {
                listeners.sort($(this), i, currentDirection);
            }
        });
    }
})(jQuery);