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