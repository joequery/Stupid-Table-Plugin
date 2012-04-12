// Stupid jQuery table plugin.

// Call on a table 
(function($){
  $.fn.stupidtable = function(x){
    var table = this;

    // ==================================================== //
    //                  Utility functions                   //
    // ==================================================== //
    // Return the resulting indexes of a sort so we can apply
    // this result elsewhere. This returns an array of index numbers.
    // return[0] = x means "arr's 0th element is now at x"
    var sort_map =  function(arr){
      var sorted = arr.slice(0).sort(); // slice to create clone
      var map = [];
      var index = 0;
      for(var i=0; i<arr.length; i++){
        index = sorted.indexOf(arr[i]);

        // If this index is already in the map, look for the next index.
        // This handles the case of duplicate entries.
        while(map.indexOf(index) != -1){
          index = sorted.indexOf(arr[i], index+1);
        }

        map.push(index);
      }
      return map;
    }

    // Apply a sort map to the array. Alters arr
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
    var is_sorted_array = function(arr){
      var isAscending = true;
      var isDescending = true;
      for(var i=0; i<arr.length-1; i++){
        if(arr[i+1] > arr[i]){
          isAscending = false;
          break;
        }
      }

      for(var i=arr.length-1; i>0; i--){
        if(arr[i-1] > arr[i]){
          isDescending = false;
          break;
        }
      }
      return (isAscending || isDescending);
    }

    // ==================================================== //
    //                  Begin execution!                    //
    // ==================================================== //
    // Do sorting when THs are clicked
    table.delegate("th", "click", function(){
      var trs = table.find("tr").slice(1); // Don't include headers
      var i = $(this).index();

      // Gather the elements for this column
      column = [];

      // Push the text in this column to column[] for string comparison.
      trs.each(function(index,tr){
        var e = $(tr).children().eq(i);
        column.push(e.text());
      });

      // If the column is already sorted, just reverse the order. The sort
      // map is just reversing the indexes.
      if(is_sorted_array(column)){
        column.reverse();
        var theMap = [];
        for(var i=column.length-1; i>=0; i--){
          theMap.push(i);
        }
      }
      else{
        // Get a sort map and apply to all rows
        theMap = sort_map(column);
      }

      var sortedTRs = apply_sort_map(trs, theMap);
      // Get all the rows as their native html strings
      var newHTML = "";
      $(sortedTRs).each(function(index, e){
        // Hackish, we need the outerHTML to preserve TR styles.
        // See here for more details: http://stackoverflow.com/a/4741203
        newHTML += $(e).clone().wrap('<div>').parent().html();
      });
      
      // Replace the table body html with the new html
      table.find("tbody").html(newHTML);
    });
  }
 })(jQuery);

