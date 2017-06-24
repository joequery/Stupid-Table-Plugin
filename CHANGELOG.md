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
