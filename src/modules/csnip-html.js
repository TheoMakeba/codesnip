/*
 ! html parser module
 ! v1.0.0
*/
var HTML_SNIPPET_MODULE = (function()
{

var attrName = attributesRepository.getMainAttribute();
var attrValue = 'html';
const mainSBXContainerSelector = '[class*="'+attributesRepository.getCodeWrapperClass()+'"]';

function CSS_REPOSITORY()
{
			
	var SPANS =
	{
		'tag' : '<span class="sbx-html:tag">',			
		'attribute-name' : '<span class="sbx-html:attribute-name">',		
		'attribute-value'  : '<span class="sbx-html:attribute-value">',
		'comment'  : '<span class="sbx-html:comment">',	
	}
	
	this.getSpan = function(spanName){
		if(SPANS[spanName]){ return SPANS[spanName]; }
	}
	

}
var CSSProvider = new CSS_REPOSITORY();



var PARSING_MODULE = (function()
{

const closerMarker = 'Gb5KYotiMlXQqrSt€5Ln8';

var html_tag_regex = /<([^>]*)>/g;
var html_closingTag_regex = /<\/+([^>]*)>/g;
var html_attributeName_regex = /\s+[\-\w]+\s?=\s?/g;
var html_attributeValue_regex = /"([^\"]*)"|'([^\']*)'/g
var html_comment_regex = /<\!--([\s\S]*?)-->/g;
var commentMarkerStr = '[[::45EvtR712528kVl::]]-'

function isCommentTag(arg){
	return (arg.match(html_comment_regex) != null); 
}


function stamp_chervonAndTagIn(tag)
{
	tag = tag.replace(/</g,'&lt;');
	return tag.replace(/&lt;([^>]*)/g,'¿CaT¿202kVr¿$&'+closerMarker);
}
function disstamp_chervonAndTagIn(str){ return str.replace(/¿CaT¿202kVr¿/g,CSSProvider.getSpan('tag')); }


function stamp_attributeName(str){ return str.replace(html_attributeName_regex,'¿ATTR-NM¿$&'+closerMarker); }
function disstamp_attributeName(str){ return str.replace(/¿ATTR-NM¿/g,CSSProvider.getSpan('attribute-name')); }


function stamp_attributeValue(str){ return str.replace(html_attributeValue_regex,'¿ATTR-VL¿$&'+closerMarker); }
function disstamp_attributeValue(str){ return str.replace(/¿ATTR-VL¿/g,CSSProvider.getSpan('attribute-value')); }

function stamp_closingChevron(str)
{
	str = str.replace(/>/g,'&gt;');
	return str.replace(/&gt;/g,'¿CH-CLOSE¿$&'+closerMarker);
}
function disstamp_closingChevron(str){ return str.replace(/¿CH-CLOSE¿/g,CSSProvider.getSpan('tag')); }

function disstamp_comment(str){ return str.replace(/¿COM¿/g,CSSProvider.getSpan('comment')); }

function disstamp_closers(str)
{
	var reg = new RegExp(closerMarker,'g');
	return str.replace(reg,'</span>');
}

function removeMultipleTabulations(str){ return COMPRESSOR.compress(str); }

function getTagParsingResult(tag)
{
	/*stamping*/
	tag = stamp_chervonAndTagIn(tag);
	tag = stamp_closingChevron(tag);		
	tag = stamp_attributeName(tag);
	tag = stamp_attributeValue(tag);
	/*disstamping*/
	tag = disstamp_chervonAndTagIn(tag);
	tag = disstamp_attributeName(tag);
	tag = disstamp_attributeValue(tag);
	tag = disstamp_closingChevron(tag);
	
	tag = disstamp_closers(tag);
	return tag;
}

function getCommentParsing(refs,content)
{
	if(refs.length > 0)
	{
		refs.forEach(function(ref,i)
		{
			var com = ref[commentMarkerStr+i];
			com = com.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;');
			com = '¿COM¿'+com+closerMarker;
			com = disstamp_comment(com); 
			com = disstamp_closers(com);
			content = content.replace(commentMarkerStr+i,com);
		});
		return content;
	}
	else { return content; }
}


function getSyntaxHightlitedOf(content)
{
	content = removeMultipleTabulations(content);	
	var comRefs = [];
	if(content.match(html_comment_regex) != null)
	{
		var match = content.match(html_comment_regex);
		match.forEach(function(item,idx){
			var keyid = commentMarkerStr + idx; var obj = {};
			obj[keyid] = item;
			content = content.replace(item,keyid);
			comRefs.push(obj);
		});
	}
	var allTags = content.match(html_tag_regex);
	if(allTags)
	{
		allTags.forEach(function(tag)
		{
			var tagParsingResult = getTagParsingResult(tag);
			content = content.replace(tag,tagParsingResult);
		});
		content = getCommentParsing(comRefs,content);		
		return content;
	}
	else
	{
		content = getCommentParsing(comRefs,content);
		return content;
	}
}

function ModuleObject()
{
	this.getResult = function(content){
		if(content){ return getSyntaxHightlitedOf(content); }
		else{ return null; }
	}
}

return new ModuleObject();
})();


function html_module_API()
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
					var resultOfParsing = PARSING_MODULE.getResult((content != undefined) ? content : bodyElement.innerHTML);
					bodyElement.innerHTML = resultOfParsing;
				}
				else 
				{
					var resultOfParsing = PARSING_MODULE.getResult((content != undefined) ? content : node.innerHTML);				
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

return new html_module_API();
})();