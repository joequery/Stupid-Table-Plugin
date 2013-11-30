# Stupid jQuery table plugin.

# Call on a table
# sortFns: Sort functions for your datatypes.
$ ->

	$.fn.stupidtable = (sortFns) ->
		return this.each ->
			$table = $(this)

			# Fetch the th which must be sort by default
			default_sort_th = $table.data 'default-sort-th'
			default_th = if default_sort_th then $table.find('th#' + default_sort_th ) else null

			sortFns = sortFns || {}

			# ==================================================== #
			#                  Utility functions                   #
			# ==================================================== #

			# Merge sort functions with some default sort functions.
			sortFns = $.extend {}, $.fn.stupidtable.default_sort_fns, sortFns

			# Return the resulting indexes of a sort so we can apply
			# this result elsewhere. This returns an array of index numbers.
			# return[0] = x means "arr's 0th element is now at x"
			sort_map = (arr, sort_function, reverse_column) ->
				map = []
				index = 0
				if reverse_column
					for i in [(arr.length - 1)..0] by -1
						map.push i
				else
					sorted = arr.slice(0).sort sort_function
					for i in [0..(arr.length - 1)]
						index = $.inArray arr[i], sorted
						# If this index is already in the map, look for the next index.
						# This handles the case of duplicate entries.
						while ($.inArray(index, map) != -1)
							index++
						map.push index
				return map

			# Apply a sort map to the array.
			apply_sort_map = (arr, map) ->
				clone = arr.slice(0)
				newIndex = 0
				for i in [0..(map.length - 1)]
					newIndex = map[i]
					clone[newIndex] = arr[i]
				return clone

			# Sort table
			sort_table = (clicked_th, initial_sort) ->
				trs = $table.children("tbody").children "tr"
				$this = clicked_th
				th_index = 0
				dir = $.fn.stupidtable.dir

				$table.find("th").slice(0, $this.index()).each () ->
					cols = $(this).attr("colspan") || 1
					th_index += parseInt cols, 10

				# Determine (and/or reverse) sorting direction, default `asc`
				if initial_sort
					sort_dir = $table.data('default-sort-dir') || dir.ASC
				else
					sort_dir = if $this.data("sort-dir") == dir.ASC then dir.DESC else dir.ASC

				# Choose appropriate sorting function. If we're sorting descending, check
				# for a `data-sort-desc` attribute.
				if ( sort_dir == dir.DESC )
					type = $this.data("sort-desc") || $this.data("sort") || null
				else
					type = $this.data("sort") || null

				# Prevent sorting if no type defined
				return if type == null

				# Trigger `beforetablesort` event that calling scripts can hook into;
				# pass parameters for sorted column index and sorting direction
				$table.trigger "beforetablesort", {column: th_index, direction: sort_dir}
				
				# More reliable method of forcing a redraw
				$table.css "display"

				# Run sorting asynchronously on a timout to force browser redraw after
				# `beforetablesort` callback. Also avoids locking up the browser too much.
				setTimeout ->
					# Gather the elements for this column
					column = []
					sortMethod = sortFns[type]

					# Push either the value of the `data-order-by` attribute if specified
					# or just the text() value in this column to column[] for comparison.
					trs.each (index,tr) ->
						$e = $(tr).children().eq(th_index);
						sort_val = $e.data "sort-value"
						order_by = if typeof(sort_val) != "undefined" then sort_val else $e.text()
						column.push order_by

					# Create the sort map. This column having a sort-dir implies it was
					# the last column sorted. As long as no data-sort-desc is specified,
					# we're free to just reverse the column.
					reverse_column = !!$this.data("sort-dir") && !$this.data("sort-desc") && !initial_sort
					theMap = sort_map(column, sortMethod, reverse_column)

					# Reset siblings
					$table.find("th").data("sort-dir", null).removeClass "sorting-desc sorting-asc"
					$this.data("sort-dir", sort_dir).addClass("sorting-#{ sort_dir }")

					# Replace the content of tbody with the sortedTRs. Strangely (and
					# conveniently!) enough, .append accomplishes this for us.
					sortedTRs = $(apply_sort_map trs, theMap)
					if initial_sort && sort_dir == 'desc'
						sortedTRs = sortedTRs.toArray().reverse()
						sortedTRs = $(sortedTRs)
					$table.children("tbody").append sortedTRs

					# Trigger `aftertablesort` event. Similar to `beforetablesort`
					$table.trigger "aftertablesort", {column: th_index, direction: sort_dir}
					# More reliable method of forcing a redraw
					$table.css "display"
				, 10

			# ==================================================== #
			#                  Begin execution!                    #
			# ==================================================== #

			# Do sorting when THs are clicked
			$table.on "click", "th",  -> sort_table $(this), false

			# Apply default sort
			if ( default_th && default_th.length == 1 )
				sort_table default_th, true

	# Enum containing sorting directions
	$.fn.stupidtable.dir = {ASC: "asc", DESC: "desc"}

	$.fn.stupidtable.default_sort_fns = {
		"int"			: (a, b) -> return parseInt(a, 10) - parseInt(b, 10)
		"float"		: (a, b) ->	return parseFloat(a) - parseFloat(b)
		"string"	: (a, b) ->
			return -1 if (a < b)
			return +1 if (a > b)
			return 0
		"string-ins": (a, b) ->
			a = a.toLowerCase()
			b = b.toLowerCase()
			return -1 if (a < b)
			return +1 if (a > b)
			return 0
	}
