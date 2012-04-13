Stupid jQuery Table Sort
========================

This is a stupid jQuery table sorting plugin. Nothing fancy, nothing really
impressive. Overall, stupidly simple.

[View the demo here](http://joequery.github.com/Stupid-Table-Plugin/)

See the example.html document to see how to implement it. 

Create your own sorts
---------------------

We want this plugin to remain as small as possible while giving you the
power you need to sort **any** type of data. Consequently, we're leaving you,
the developer, in charge of implementing sort functions. This Stupid jQuery 
Table plugin lets you easily do that. Just add a class of "type-DATATYPE" to
the th of the proper column, and add a function to the plugin call.

Example usage:

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
