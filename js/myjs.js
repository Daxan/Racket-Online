
//loads pages in #changer from navi
function setupLink(url) {
return function(e) { $("#changer").load(url, function(data) { $("#changer").html(data);  }); }
  
}

function getPage(page) {
 $.get( page,function(data) { $("#changer").html(data); });
}

var controller;
$(document).ready(function() {
   
   
$("#intro").click(setupLink("templates/tutorial/intro.html"));
$("#howto").click(setupLink("templates/tutorial/howto.html"));
$("#syntax").click(setupLink("templates/tutorial/syntax.html"));
$("#func").click(setupLink("templates/tutorial/func.html"));
$("#lists").click(setupLink("templates/tutorial/lists.html"));
$("#about").click(setupLink("about.html"));
$("#def").click(setupLink("templates/tutorial/definitions.html"));
//$("#def").click(getPage("templates/tutorial/definitions.html"));

});