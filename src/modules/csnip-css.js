/*
 ! CSS parser module 
 ! v1.0.0
*/
var CSS_SNIPPET_MODULE = (function()
{

var attrName = attributesRepository.getMainAttribute();
var attrValue = 'css';
const mainSBXContainerSelector = '[class*="'+attributesRepository.getCodeWrapperClass()+'"]';

function CSS_REPOSITORY()
{				
	var SPANS = 
	{
		'selector' : '<span class="sbx-css:selector">',	
		'rule'  : '<span class="sbx-css:rule">',
		'brace' : '<span class="sbx-css:brace">',																
		'property-name'   : '<span class="sbx-css:property-name">',		
		'property-value'  : '<span class="sbx-css:property-value">',
		'comment'  : '<span class="sbx-css:comment">',	
	}		
	
	this.getSpan = function(spanName){
		if(SPANS[spanName]){ return SPANS[spanName]; }
	}

}
var CSSProvider = new CSS_REPOSITORY();



var PARSING_MODULE = (function()
{

var inner_braces_reg = /\{([^\{]*)\}/g;
var propertyAndPropertyValue_regex = /[\w\-]+\s*:\s*[^;]*;/g;
var comment_regex = /\/\*([\s\S]*?)\*\/|\/\/([^\n]*?)\n/g;
var commentMarkerStr = '[[€€com€€]]-';
const closerMarker = 'VGTRb5127wXV15Tt#6p8';



function getAllSelectorsIn(str)
{
	var selectors = [];
	var cuts = str.split('{');
	if(cuts.length > 0)
	{
		cuts.forEach(function(item)
		{
			if(/\}/.test(item))
			{
				var match = item.split("}"); var part = '';
				if(match.length == 2){ part = match[1]; }
				else {
					if(match.length > 2){ part = match[match.length-1]; }
				}
				if(part.trim().length > 0){	selectors.push(part); }
	
			}
			else { selectors.push(item) }
		});		
		return selectors;
	}
	else { return null; }	
}

function stamp_selector(selector){ return '¿CSS-selector¿'+selector+closerMarker; }

function stamp_rule(rule){ return '¿CSS-rule¿'+rule+closerMarker; }

function stamp_propertyName(propname){ return '¿CSS-property-name¿'+propname+closerMarker; }

function stamp_propertyValue(propval){ return '¿CSS-property-value¿'+propval+closerMarker; }

function stamp_braces(str){ return str.replace(/[\{\}]/g,'¿CSS-brace¿$&'+closerMarker) }


function disstamp_selectors(str){ return str.replace(/¿CSS-selector¿/g,CSSProvider.getSpan('selector')); }

function disstamp_rule(str){ return str.replace(/¿CSS-rule¿/g,CSSProvider.getSpan('rule')); }

function disstamp_propertyName(str){ return str.replace(/¿CSS-property-name¿/g,CSSProvider.getSpan('property-name')); }

function disstamp_propertyValue(str){ return str.replace(/¿CSS-property-value¿/g,CSSProvider.getSpan('property-value')); }

function disstamp_brace(str){ return str.replace(/¿CSS-brace¿/g,CSSProvider.getSpan('brace')); }

function disstamp_comment(str){ return str.replace(/¿CSS-comment¿/g,CSSProvider.getSpan('comment')); }

function disstamp_closer(str)
{
	var reg = new RegExp(closerMarker,'g');
	return str.replace(reg,'</span>');
}

function removeMultipleTabulations(str){ return COMPRESSOR.compress(str); }

function escapeChevrons(str)
{
	return str.replace(/</g,'&lt;')
	.replace(/>/g,'&gt;')
}

function processSelectorsIn(str)
{
	var selectors = getAllSelectorsIn(str);
	if(selectors)
	{
		selectors.forEach(function(selector)
		{			
			if(/^@|@/.test(selector.trim())){
				str = str.replace(selector,stamp_rule(selector));
			}
			else {
				str = str.replace(selector,stamp_selector(selector));
			}
		});
	}
	return str;
}


function processPropertiesIn(str)
{	
	var innerBraces = str.match(inner_braces_reg);	
	if(innerBraces)
	{
		innerBraces.forEach(function(group)
		{
			var allPropertiesAndTheirValues = group.match(propertyAndPropertyValue_regex);
			if(allPropertiesAndTheirValues)
			{
				allPropertiesAndTheirValues.forEach(function(item)
				{
					var parts = item.split(':');
					var property = parts[0].trim();
					var value = parts[1].split(';')[0].trim();
					var st_prop = stamp_propertyName(property),
					st_val = stamp_propertyValue(value);
					var merge = st_prop+': '+st_val+';';
					str = str.replace(item,merge);
				});
			}
		});
	}
	
	return str;
}

function getCommentParsing(refs,content)
{
	if(refs.length > 0)
	{
		refs.forEach(function(ref,i)
		{
			var com = ref[commentMarkerStr+i];
			com = '¿CSS-comment¿'+com+'¿closer¿;';
			com = disstamp_comment(com); 
			com = disstamp_closer(com);
			content = content.replace(commentMarkerStr+i,com);
		});
		return content;
	}
	else { return content; }
}

function getSyntaxHightlitedOf(content)
{	
	content = removeMultipleTabulations(content);
	content = escapeChevrons(content);
	var comRefs = [];
	if(content.match(comment_regex) != null){
		var match = content.match(comment_regex);
		match.forEach(function(item,idx){
			var keyid = commentMarkerStr+idx; var obj = {};
			obj[keyid] = item;
			content = content.replace(item,keyid);
			comRefs.push(obj);
		});
	}
	content = processSelectorsIn(content);
	content = processPropertiesIn(content);
	content = stamp_braces(content);

	content = disstamp_rule(content);
	content = disstamp_selectors(content);
	content = disstamp_propertyName(content);
	content = disstamp_propertyValue(content);
	content = disstamp_brace(content);	

	content = disstamp_closer(content);
	content = getCommentParsing(comRefs,content);
	return content;
}



function parsing_module_API()
{
	this.getResult = function(content){
		if(content){
			var result = getSyntaxHightlitedOf(content);
			return result;
		}
		else{ return null; }
	}
}

return new parsing_module_API();
})();


function css_module_API()
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
					bodyElement.innerHTML = resultOfParsing;
				}
				else 
				{
					var resultOfParsing = PARSING_MODULE.getResult((content != undefined) ? content : node.textContent);				
					node.innerHTML = resultOfParsing;
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
					bodyElement.innerHTML = resultOfParsing;
				}
				else 
				{
					var resultOfParsing = PARSING_MODULE.getResult(content);				
					node.innerHTML = resultOfParsing;
				}
			}catch(e){}
		});
	}	
}


return new css_module_API();
})();