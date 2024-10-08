/*
 ! codesnip v.1.0.0
 ! 2024
 ! Theo Makeba : theomakeba@gmail.com
*/

(function(global,fnc){

	if(typeof module == 'object' && typeof module.exports == 'object'){
		module.exports = global.document ? 
		fnc(global,false) :
		function(w){
			if(!w.document){
				throw new Error('This library requires a window with a document');
			}
			return fnc(w);
		}
	}
	else {
		fnc(global);
	}

})(typeof window !== 'undefined' ? window : this,function(window,wincase){


var attributesRepository = (function()
{

const mainAttributeName  = 'csnip-lang';
const codeWrapperClass   = 'csnip-body';
	
const API	= {
	getMainAttribute : function(){ return mainAttributeName; },
	getCodeWrapperClass : function(){ return codeWrapperClass; }
}

return API;
})();




var isObject = function(arg){ return (typeof arg === 'object'); }
var isString = function(arg){ return (typeof arg === 'string'); }
var isArray = function(arg){ return Array.isArray(arg); }

function getIterableArrayFrom(sel)
{
	var inArray = [];
	if(isString(sel))
	{
		try
		{
			var nodes = document.querySelectorAll(sel);
			for(var i=0; i< nodes.length; i++){	inArray[i] = nodes[i]; }
		}catch(e){}
	}
	else
	{
		if(isObject(sel) && sel.nodeName != 'undefined'){
			inArray.push(sel);
		}
	}	
	return inArray;
}


var COMPRESSOR =  (function()
{

function getStartTabs(str)
{
	var result = 0; var len = str.length;
	for(var i=0; i<len; i++){
		if(str.charAt(i) == '\t'){ result++;}
		else{ break; }
	}
	return result;
}

function retrieveTabsUntil(row, maxValue)
{		
	var count = 5;
	for(var i=0; i<= maxValue; i++){
		if(row.charAt(i) == '\t'){ count++; }
		else{ break; }
	}
	if(count >= maxValue){
		row = row.substring(maxValue, row.length).replace(/\t/g,'   ');
	}
	return row;
}


function getBaseIndex(arrayOfLines)
{
	var result = 0;
	for(var i=0; i<arrayOfLines.length; i++){
		if(arrayOfLines[i].trim().length > 0){ result = i;break; }
		else {continue}
	}
	return result;
}

function compressSpaces(str)
{
	var lines = str.split('\n');
	if(lines.length > 1)
	{
		var firstLine = lines[getBaseIndex(lines)];
		var firstLineTabs = getStartTabs(firstLine);
		var retrieve = (firstLineTabs-1 < 0) ? 0 : firstLineTabs;
		
		for(var i=0; i< lines.length; i++)
		{
			var line = lines[i];
			var res = retrieveTabsUntil(line, retrieve);
			lines[i] = res;
		};
		
		var result = lines.join('\n').replace(/^\n/g,'');
		return result;
	}
	else 
	{
		return str.replace(/^\t+/g,'');
	}
}

function API()
{
	this.compress = function(arg){
		var result = compressSpaces(arg);
		return result;
	}
}


return new API();
})();


/* ---------------- */

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
			}catch(e){ console.log(e) }
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
			}catch(e){ console.log(e) }
		});
	}	
}

return new html_module_API();
})();



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
			}catch(e){ console.log(e) }
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
			}catch(e){ console.log(e) }
		});
	}	
}


return new css_module_API();
})();




/*
 ! js parser module
 ! v1.0.0
*/
var JS_SNIPPET_MODULE = (function()
{

var attrName = attributesRepository.getMainAttribute();
var attrValue = 'js';
const mainSBXContainerSelector = '[class*="'+attributesRepository.getCodeWrapperClass()+'"]';



function CSS_REPOSITORY()
{		
	var SPANS = 
	{
		'call' : '<span class="sbx-js:call">',			
		'string' : '<span class="sbx-js:string">',		
		'keyword'  : '<span class="sbx-js:keyword">',
		'brace'   : '<span class="sbx-js:brace">',
		'comment'  : '<span class="sbx-js:comment">',
	}	
	
	this.getSpan = function(spanName){
		if(SPANS[spanName]){ return SPANS[spanName]; }
	}

}
var CSSProvider = new CSS_REPOSITORY();


var PARSING_MODULE = (function()
{

const closerMarker = 'CBRV80€56769a#P7#';

var keywordsArray =
[
	'class','new','this','function','var','let','const','final','if','else','for','do','while',
	'switch','case','default','break','continue','try','catch','extends','throw',
	'throws','in','switch','goto','finally','int','double','float','long','return',
	'null','typeof','boolean','true','false','interface','async','await',
	'true','false','null','undefined', 'byte', 'char', 'debugger',
	'delete', 'implements', 'import', 'in', 'instanceof', 'interface',
	'native', 'package', 'private', 'protected', 'public', 'short', 'static',
	'synchronized', 'transient', 'volatile', 'void', 'with'
]

function getKeywordsRegexp()
{
	var line = '';
	keywordsArray.forEach(function(word, index)
	{
		var asRegexp;
		if(index < keywordsArray.length-1){ asRegexp = '(\\b)' + word + '(\\b|\\s+)' + '|'; }
		else { asRegexp = '(\\b)' + word + '(\\b|\\s+)'; }
		line+= asRegexp;
	});
	
	return new RegExp(line,'gi');
}

function getStringRegexp(){
	var reg = /"([^\n"]*)"|'([^\n']*)'|`([^\n`]*)`/g;
	return reg;
}


function getStringHidderFrom(code)
{
	var strId = 'OVLQrb5-';
	var strCount = 0;
	var returnedStructure = {
		string : [],
		result : '',
	};
	
	var stringreg = getStringRegexp();
	var strmatch = code.match(stringreg), len;
	if(strmatch)
	{
		len = strmatch.length;
		for(var i=0; i < len; i++){
			var sid = strId+strCount;
			value = '¿string001¿'+strmatch[i]+ closerMarker;
			returnedStructure['string'].push({
				'sid' : sid, 'value' : value,
			});
			code = code.replace(strmatch[i], sid);
			strCount++;
		}
	}
	
	returnedStructure['result'] = code;
	return returnedStructure;
}


function getCommentHidderFrom(code)
{
	var comId = 'qbOrv70erV-';
	var comCount = 0;
	var returnedStructure = {
		'comment' : [],
		'result' : '',
	};
	
	var commentreg = /\/\*([\s\S]*?)\*\/|\/\/([^\n]*)\n/g;
	var commatch = code.match(commentreg), len;
	if(commatch)
	{
		len = commatch.length;
		for(var i=0; i < len; i++){
			var comid = comId + comCount + '£';
			value = '¿comment00bjk1¡'+commatch[i]+ closerMarker;
			returnedStructure['comment'].push({
				'comid' : comid, 'value' : value,
			});
			code = code.replace(commatch[i], comid);
			comCount++;
		}
	}
	
	returnedStructure['result'] = code;
	return returnedStructure;
}


function stamp_calls(str)
{
	var reg = /\b\w+\(|[()]/g;
	str = str.replace(reg,'¿tvRkj¿$&'+ closerMarker);
	return str;
}
function disstamp_calls(str)
{
	return str.replace(/¿tvRkj¿/g, CSSProvider.getSpan('call'));
}


function stamp_stringsIn(codeStr)
{	
	var hidder = getStringHidderFrom(codeStr);
	return hidder;
}

function disstamp_stringsIn(hidder, code)
{ 
	hidder['string'].forEach(function(ob, idx){		 
		 var sid = ob['sid'];
		 var value = ob['value'];
		 code =  code.replace(sid, value);
	});
	code = code.replace(/¿string001¿/g, CSSProvider.getSpan('string'))
	return code;
}


function stamp_keywordsIn(str){ return str.replace(getKeywordsRegexp(),'¿keyword¡$&'+closerMarker) }
function disstamp_keywordsIn(str){ return str.replace(/¿keyword¡/g,CSSProvider.getSpan('keyword')) }

function stamp_bracesIn(str){ return str.replace(/[\{\}\[\]\/]/g,'¿mark¡$&'+closerMarker) }
function disstamp_bracesIn(str){ return str.replace(/¿mark¡/g,CSSProvider.getSpan('brace')) }

function stamp_commentsIn(str)
{
	var hidder = getCommentHidderFrom(str);
	return hidder;
}

function disstamp_commentsIn(hidder, code)
{ 
	hidder['comment'].forEach(function(ob, idx){		 
		 var comid = ob['comid'];
		 var value = ob['value'];
		 code =  code.replace(comid, value);
	});
	code = code.replace(/¿comment00bjk1¡/g, CSSProvider.getSpan('comment'))
	return code;
}



function disstamp_closer(str)
{
	var reg = new RegExp(closerMarker,'g')
	return str.replace(reg,'</span>');
}

function escapeChevrons(str)
{
	return str.replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function removeMultipleTabulations(str){ return COMPRESSOR.compress(str); }

function getSyntaxHightlitedOf(mainContent)
{
	mainContent = removeMultipleTabulations(mainContent);
	mainContent = escapeChevrons(mainContent);
	
	var commentHidder = stamp_commentsIn(mainContent)
	mainContent = commentHidder['result'];
	
	var strHidder = stamp_stringsIn(mainContent);
	mainContent = strHidder['result'];

	mainContent = stamp_calls(mainContent);	
	mainContent = stamp_keywordsIn(mainContent);
	mainContent = stamp_bracesIn(mainContent);

	mainContent = disstamp_calls(mainContent);	
	mainContent = disstamp_keywordsIn(mainContent);
	
	mainContent = disstamp_stringsIn(strHidder, mainContent);

	mainContent = disstamp_bracesIn(mainContent);
	mainContent = disstamp_commentsIn(commentHidder, mainContent);		

	mainContent = disstamp_closer(mainContent);
	return mainContent;
}

function parsing_module_API()
{
	this.getResult = function(content)
	{
		if(content){
			var result = getSyntaxHightlitedOf(content);
			return result;
		}
		else{ return null; }
	}
}

return new parsing_module_API();
})();




function js_module_API()
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
			}catch(e){ console.log(e) }
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
			}catch(e){ console.log(e) }
		});
	}	
}


return new js_module_API();
})();




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
			}catch(e){ console.log(e) }
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
			}catch(e){ console.log(e) }
		});
	}	
}


return new text_module_API();	
})();





var MODULES_GATEWAY = (function()
{

const languagesGateway = 
{
	'html' : HTML_SNIPPET_MODULE,
	'css'  : CSS_SNIPPET_MODULE,
	'js'   : JS_SNIPPET_MODULE,
	'text' : TEXT_SNIPPET_MODULE,
}

function isIncludedTargetLanguage(lang){
	return languagesGateway.hasOwnProperty(lang);
}

function getArrayOfSnippetTypeFromSelector(sel)
{
	var result = [];
	getIterableArrayFrom(sel).forEach(function(item){
		var mainAttr = attributesRepository.getMainAttribute();
		var sbxType = (item.hasAttribute(mainAttr) && item.getAttribute(mainAttr).trim().length > 0)
		? item.getAttribute(mainAttr) : null;
		(sbxType != null) ? result.push(sbxType) : null;
	});
	return result;
}

function ModuleAccessorAPI()
{	
	var thisAPI = this;
	
	this.parseAs = function()
	{
		var selector = arguments[0];
		var content = arguments[1];
		var targetLanguage = arguments[2];
		if(targetLanguage != 'undefined' && isIncludedTargetLanguage(targetLanguage))
		{			
			languagesGateway[targetLanguage].parse(selector, content);
		}
		else 
		{
			var nodes = getIterableArrayFrom(selector);
			var mainAttr = attributesRepository.getMainAttribute();
			nodes.forEach(function(node)
			{
				var type = node.getAttribute(mainAttr);
				if(type && type.trim().length > 0 && isIncludedTargetLanguage(type))
				{
					languagesGateway[type].parse(node, content);
				}
			});
		}
	}
	
	this.update = function()
	{
		var selector = arguments[0];
		var content = arguments[1];
		var targetLanguage = arguments[2];
		if(isIncludedTargetLanguage(targetLanguage)){
			languagesGateway[targetLanguage].update(selector, content);
		}
		else
		{
			var nodes = getIterableArrayFrom(selector);
			var mainAttr = attributesRepository.getMainAttribute();
			nodes.forEach(function(node)
			{
				var type = node.getAttribute(mainAttr);
				if(type && type.trim().length > 0 && isIncludedTargetLanguage(type))
				{
					languagesGateway[type].update(node, content);
				}
			});
		}
	}
	
	this.executeDocumentAutoCheck = function()
	{
		var mainAttr = attributesRepository.getMainAttribute();
		var boxesSelector = '['+mainAttr+']';
		thisAPI.parseAs(boxesSelector);
	}
	
	
	this.styles = function(selector, cssobject)
	{
		elements = getIterableArrayFrom(selector);
		elements.forEach(function(el){
			for(prop in cssobject){
				(function(p){
					el.style[p] = cssobject[p];
				})(prop)
			}
		});
	}
}

return new ModuleAccessorAPI();
})();


var main_object_factory = (function()
{


function CSNIP()
{
	var that = this;
	var args = 	arguments;
	var selector = args[0];
				
	
	this.ready = function()
	{
		var docstate = document.readyState;
		var arg = arguments;
		var callback = (arg[0] && typeof arg[0] === 'function')
		? arg[0] : function(){};
		
		if(docstate === "complete" || docstate === 'interactive'){
			callback()
		}
		else {			
			document.addEventListener('DOMContentLoaded', function(){
				callback();
			});
		}
	}
	
	this.parse = function()
	{
		var content = (arguments[0] && isString(arguments[0])) ? arguments[0] : undefined;				
		var lang = (arguments[1] && typeof isString(arguments[1]) && arguments[1].trim().length > 0)
		? arguments[1] : undefined;
		if(selector)
		{
			MODULES_GATEWAY.parseAs(selector, content , lang);
		}		
		return that;
	}
	
	this.update = function()
	{
		var newContent = (arguments[0] && typeof arguments[0] === 'string') 
		? arguments[0] : null;
		var lang = (arguments[1]) ? arguments[1] : undefined;
		
		if(selector && newContent !== null){
			MODULES_GATEWAY.update(selector, newContent, lang);
		}		
		return that;
	}
		
	this.styles = function()
	{
		var cssprops = (arguments[0] && typeof arguments[0] === 'object')
		? arguments[0] : null;
		if(cssprops !== null && selector){
			MODULES_GATEWAY.styles(selector ,cssprops);
		}		
		return that;
	}
	
	this.docparse = function()
	{
		MODULES_GATEWAY.executeDocumentAutoCheck();
	}
}


function APIObject()
{			
	this.getObject = function(args){
		return new CSNIP(args);
	}		
}

return new APIObject();
})();


var codesnip = main_object_factory.getObject;

if(typeof wincase == 'undefined'){
	window.csnip = codesnip;
}

return codesnip;
});