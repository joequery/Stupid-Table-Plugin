Stupid jQuery Table Sort
========================

This is a stupid jQuery table sorting plugin. Nothing fancy, nothing really
impressive. Overall, stupidly simple.

[View the demo here][0]

See the example.html document to see how to implement it. 

Example Usage
-------------

The JS:

    $("table").stupidtable();

The HTML:

    <thead>
      <tr>
        <th class="type-int">int</th>
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
      ...
      ...

Add a class of "type-DATATYPE" to the th's to make them sortable by that data
type. If you don't want that column to be sortable, just don't give it a 
type-DATATYPE class.

Predefined data types
---------------------

Our aim is to keep this plugin as lightweight as possible. Consequently, the 
only predefined datatypes that you can pass to the th's are

* int
* float
* string

These data types will be sufficient for many simple tables. However, if you need
different data types for sorting, you can easily create your own!

Creating your own data types
----------------------------

Creating your own data type  for sorting purposes is easy as long as you are 
comfortable using custom functions for sorting. Consult [Mozilla's Docs][1] 
if you're not.

[0]: http://joequery.github.com/Stupid-Table-Plugin/
[1]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort

Let's create an alphanum datatype for a User ID that takes strings in the 
form "D10", "A40", and sorts them based on the number.

    <thead>
      <tr>
        <th class="type-string">Name</th>
        <th class="type-int">Age</th>
        <th class="type-alphanum">UserID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Joseph McCullough</td>
        <td>20</td>
        <td>D10</td>
      </tr>
      <tr>
        <td>Justin Edwards</td>
        <td>29</td>
        <td>A40</td>
      </tr>
      ...
      ...
      ...

Now we need to specify how the **alphanum** type will be sorted. To do that, 
we do the following:

    $("table").stupidtable({
      "alphanum":function(a,b){

        var pattern = "^[A-Z](\\d+)$";
        var re = new RegExp(pattern);

        var aNum = re.exec(a).slice(1);
        var bNum = re.exec(b).slice(1);

        return parseInt(aNum,10) - parseInt(bNum,10);
      }
    });

This extracts the integers from the cell and compares them in the style
that sort functions use.
