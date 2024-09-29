(function(){

var doc = window.document
var body = doc.body;

var hostAttribute = 'point';
var targetAttribute = 'land';


function manageCaseOfElement(el)
{
	var value = el.getAttribute(hostAttribute);
	var targetNode = document.querySelector('['+targetAttribute+'="'+value+'"]');
	if(targetNode)
	{
		el.addEventListener('click', function(){
			targetNode.scrollIntoView({
				'block' : 'start',
				'behavior' : 'smooth'
			})
		});
	}
}

function initHandling()
{
	var allHosts = doc.querySelectorAll('['+hostAttribute+']');
	if(allHosts)
	{
		var len = allHosts.length;
		for(var i=0; i<len; i++)
		{
			var value = allHosts[i].getAttribute(hostAttribute);
			if(value && value.trim().length > 0){
				manageCaseOfElement(allHosts[i]);
			}
		}
	}	
}



doc.addEventListener('DOMContentLoaded', function(){
	initHandling();
})

})()