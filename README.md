Stupid jQuery Table Sort
========================

This is a stupid jQuery table sorting plugin. Nothing fancy, nothing really
impressive. Overall, stupidly simple.

[View the demo here][0]

See the example.html document to see how to implement it. 

Create your own sorts
---------------------

We want this plugin to remain as small as possible while giving you the
power you need to sort almost any type of data. Thus we're leaving you,
the developer, in charge of implementing sort functions. Sorry, this
jQuery plugin is just too stupid! Luckily, we give you an easy means to 
hook up your sort functions to the table.

Example:

The JS:
```
  $(function(){
      $("table").stupidtable({
        "int":function(a,b){
          return parseInt(a, 10) > parseInt(b,10);
          },
        "float":function(a,b){
          return parseFloat(a) > parseFloat(b);
        }
      });
  });
```

The HTML:

```
<thead>
  <tr>
    <th class="type-int awesome">int</th>
    <th class="type-float">float</th>
    <th class="type-string">string</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>15</td>
    <td>-.18</td>
    <td>banana</td>
  </tr>

...

```

For information on using functions for sorting, see [Mozilla's Docs][1]

Better examples of using the sorts can be found [in the the demo][2].

[0]: http://joequery.github.com/Stupid-Table-Plugin/
[1]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
[2]: http://joequery.github.com/Stupid-Table-Plugin/
