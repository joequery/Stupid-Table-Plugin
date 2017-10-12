v1.1.3 (Released 10/12/2017)
----------------------------

Added npm support

v1.1.2 (Released 07/11/2017)
----------------------------

Added multicolumn sort capabilities. See [examples/multicolumn-sort.html](https://rawgit.com/joequery/Stupid-Table-Plugin/master/examples/multicolumn-sort.html).

v1.1.1 (Released 07/02/2017)
----------------------------

Updated internal representation of tables.
Added `will_manually_build_table` setting.

v1.1.0 (Released 06/28/2017)
----------------------------

We are introducing an implementation of settings for StupidTable. The first
setting is `should_redraw`. This setting allows you to specify a function that
can conditionally prevent the table from redrawing after a sort.

v1.0.7 (Released 06/25/2017)
----------------------------

A `<th>` element can now be provided with a `data-sort-onload=yes` attribute.
Once `$table.stupidtable()` is called the table will immediately be sorted by
the column with the `data-sort-onload=yes` attribute if one is found.
Resolves [Issue #180](https://github.com/joequery/Stupid-Table-Plugin/issues/180) and [Issue #126](https://github.com/joequery/Stupid-Table-Plugin/issues/126).

v1.0.6 (Released 06/24/2017)
----------------------------

Fixed [Issue #183](https://github.com/joequery/Stupid-Table-Plugin/issues/183)
that prevented consecutive calls to `$th.stupidsort()` from running when the
same sort direction was specified.

v1.0.5 (Released 06/10/2017)
----------------------------

before/aftertablesort callbacks can access the column header element via `data.$th`.

v1.0.4 (Released 06/10/2017)
----------------------------

Force a stable sort to circumvent [unstable sorting implementations](https://stackoverflow.com/questions/3026281/array-sort-sorting-stability-in-different-browsers).
