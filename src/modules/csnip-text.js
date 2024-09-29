/*
 ! text parser module
 ! v1.0.0
*/
var TEXT_SNIPPET_MODULE = (function(){
	
var attrName = attributesRepository.getMainAttribute();
var attrValue = 'text';
const mainSBXContainerSelector = '[class*="'+attributesRepository.getCodeWrapperClass()+'"]';

	
	
var PARSING_MODULE = (function()
{

function removeMultipleTabulations(str){ return COMPRESSOR.compress(str); }

function getContentPatch(cont)
{
	cont = removeMultipleTabulations(cont);
	return cont;
}

function parsing_module_API()
{
	this.getResult = function(content){
		if(content){ return getContentPatch(content); }
		else{ return null; }
	}
}

return new parsing_module_API();
})();

	

function text_module_API()
{
	this.parse = function(sel)
	{
		var arrayOfNodes = getIterableArrayFrom(sel);
		var content = arguments[1];
		
		arrayOfNodes.forEach(function(node)
		{
			try 
			{	
				node.setAttribute(attrName, attrValue);
				var bodyElement = node.querySelector(mainSBXContainerSelector);
				if(bodyElement)
				{
					var resultOfParsing = PARSING_MODULE.getResult((content != undefined) ? content : bodyElement.textContent);
					bodyElement.textContent = resultOfParsing;
				}
				else 
				{
					var resultOfParsing = PARSING_MODULE.getResult((content != undefined) ? content : node.textContent);				
					node.textContent = resultOfParsing;
				}
			}catch(e){}
		});
	}
	
	this.update = function(sel, content)
	{
		var arrayOfNodes = getIterableArrayFrom(sel);
		arrayOfNodes.forEach(function(node)
		{
			try
			{	
				var bodyElement = node.querySelector(mainSBXContainerSelector);
				if(bodyElement)
				{
					var resultOfParsing = PARSING_MODULE.getResult(content);				
					bodyElement.textContent = resultOfParsing;
				}
				else 
				{
					var resultOfParsing = PARSING_MODULE.getResult(content);				
					node.textContent = resultOfParsing;
				}
			}catch(e){}
		});
	}	
}


return new text_module_API();	
})();