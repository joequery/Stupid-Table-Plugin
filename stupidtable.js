// Stupid jQuery table plugin.

// Call on a table 
// sortFns: Sort functions for your datatypes.
// {"int" : function(){}, "float": function(){}}...
(function($){
  $.fn.stupidtable = function(sortFns){
    var table = this;

    // ==================================================== //
    //                  Utility functions                   //
    // ==================================================== //

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
        var tmp = index;
        while($.inArray(tmp, map) != -1){
          tmp = $.inArray(index+1, sorted);
          if (tmp != -1){
            index = tmp;
          }
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
    var is_sorted_array = function(arr, sort_function){
      var clone;
      clone = arr.slice(0);
      var isAscending = arrays_equal(arr, clone.sort(sort_function));

      // Reset the clone but in reverse this time
      clone = arr.slice(0).reverse();
      var isDescending = arrays_equal(arr, clone.sort(sort_function));

      return (isAscending || isDescending);
    }

    // ==================================================== //
    //                  Begin execution!                    //
    // ==================================================== //
    // Do sorting when THs are clicked
    table.delegate("th", "click", function(){
      var trs = table.find("tr").slice(1); // Don't include headers
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

      // Push the text in this column to column[] for comparison.
      trs.each(function(index,tr){
        var e = $(tr).children().eq(i);
        column.push(e.text());
      });

      // If the column is already sorted, just reverse the order. The sort
      // map is just reversing the indexes.
      if(is_sorted_array(column, sortMethod)){
        column.reverse();
        var theMap = [];
        for(var i=column.length-1; i>=0; i--){
          theMap.push(i);
        }
      }
      else{
        // Get a sort map and apply to all rows
        theMap = sort_map(column, sortMethod);
      }

      var sortedTRs = $(apply_sort_map(trs, theMap));

      // Replace the content of tbody with the sortedTRs. Strangely (and
      // conveniently!) enough, .append accomplishes this for us.
      table.find("tbody").append(sortedTRs);
    });
  }
 })(jQuery);
