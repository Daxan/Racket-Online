var currentPage = -1;
var pages = ["intro.html","howto.html","expre.html","eval.html","functions.html","cond.html","sexpr.html","createlist.html","listfunc.html","where.html","end.html"];

//loads pages in #changer with 'next', 'back',  ...
function goToPage(pageNumber) {
if (pageNumber == currentPage || pageNumber < 0 || pageNumber >= pages.length) {
return;
}
currentPage = pageNumber;
var block = $("#changer");
//block.fadeOut(function(e) {
block.load( "templates/tutorial/"+ pages[pageNumber]  , function() {
block.fadeIn();
changerUpdated();
//});
});

}
//loads pages in #changer from navi
function setupLink(url) {
return function(e) { $("#changer").load(url, function(data) { $("#changer").html(data);changerUpdated();  }); }
}

function appendit(txt){
 
$("#some").html( txt + "<br/>" + txt);
}

function eval_racket(code) {
//var data;
	$.get("about.html", function(data) { $("#some").html(data); });
//return data;
}

/*function eval_racket(code) {
var data;
	$.ajax({
	url: evalUrl,
	data: { expr : code },
	async: false,
	success: function(res) { data = res; },
});
return data;
}*/


function doCommand(input) {
if (input.match(/^gopage /)) {
goToPage(parseInt(input.substring("gopage ".length)));
return true;
}
switch (input) {
	case 'next':
	case 'forward':
	goToPage(currentPage + 1);
	return true;

	case 'previous':
	case 'prev':
	case 'back':
	goToPage(currentPage - 1);
	return true;

	case 'restart':
	case 'reset':
	case 'home':
	case 'quit':
	goToPage(0);
	return true;
	
	default:
	return false;
	}
}
function onValidate(input) {
return (input != "");
}

function onComplete(line) {
	var input = $.trim(line);
	// get the prefix that won't be completed
	var prefix = line.replace(RegExp("(\\w|[-])*$"), "");
	var data = complete_racket(input);
	// handle error
	if (data.error) {
	controller.commandResult(data.message, "jquery-console-message-error");
	return [];
	}
	else {
	var res = JSON.parse(data.result);
	for (var i = 0; i<res.length; i++) {
	res[i] = prefix+res[i];
	}
	return res;
	}
}

function onHandle(line, report) {
	var input = $.trim(line);
	// handle commands
	if (doCommand(input)) {
	report();
	return;
	}
	appendit(input);
	// perform evaluation. Result is a list to handle (values ...)
	var datas = eval_racket(input);
	var results = [];
	for (var i = 0; i < datas.length; i++) {
	var data = datas[i];
		// handle error
		if (data.error) {
		results.push({msg: data.message, className: "jquery-console-message-error"});
		} // handle page
		else if (currentPage >= 0 && pageExitConditions[currentPage].verify(data)) {
		goToPage(currentPage + 1);
		}
		// display expr results
		if(/#\"data:image\/png;base64,/.test(data.result)){
		$('.jquery-console-inner').append('<img src="' + data.result.substring(2) + " /><br />");
		controller.scrollToBottom();
		results.push({msg: "", className: "jquery-console-message-value"});
		} else {
		results.push({msg: data.result, className: "jquery-console-message-value"});
		}
	}
	return results;
}
/**
* This should be called anytime the changer div is updated so it can rebind event listeners.
* Currently this is just to make the code elements clickable.
*/
function changerUpdated() {
	$("#changer code.expr").each(function() {
	$(this).css("cursor", "pointer");
	$(this).attr("title", "Click to insert '" + $(this).text() + "' into the console.");
	$(this).click(function(e) {
	controller.promptText($(this).text());
	controller.inner.click();
	// trigger Enter
	var e = jQuery.Event("keydown");
	e.keyCode = 13;
	controller.typer.trigger(e);
	});
	});
}

var controller;
$(document).ready(function() {
	controller = $("#console").console({
	welcomeMessage:'Willkommen zu "Programmieren"!',
	promptLabel: '> ',
	commandValidate: onValidate,
	commandHandle: onHandle,
	completeHandle: onComplete,
	autofocus:true,
	animateScroll:true,
	promptHistory:true,
	cols:1
});
	changerUpdated();
	$("#intro").click(setupLink("templates/tutorial/intro.html"));
	$("#howto").click(setupLink("templates/tutorial/howto.html"));
	$("#expre").click(setupLink("templates/tutorial/expre.html"));
	$("#eval").click(setupLink("templates/tutorial/eval.html"));
	$("#functions").click(setupLink("templates/tutorial/functions.html"));
	$("#cond").click(setupLink("templates/tutorial/cond.html"));
	$("#sexpr").click(setupLink("templates/tutorial/sexpr.html"));
	$("#listfunc").click(setupLink("templates/tutorial/listfunc.html"));
	$("#createlist").click(setupLink("templates/tutorial/createlist.html"));
	$("#about").click(setupLink("about.html"));
	$("#def").click(setupLink("templates/tutorial/definitions.html"));


});