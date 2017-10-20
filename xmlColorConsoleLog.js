(function(){

	var NODE_TYPES = {
		'Element': 1,
		'Attr': 2,
		'Text': 3,
		'CDATASection': 4,
		'EntryReference': 5,
		'Entity': 6,
		'ProcessingInstruction': 7,
		'Comment': 8,
		'Document': 9,
		'DocumentType': 10,
		'DocumentFragment': 11,
		'Notation': 12
	};

	var TAB = '    ';

	var CSS = {
		element: 'background-color: #000; color: #f00',
		attrValue: 'background-color: #000; color: #0f0',
		text: 'background-color: #000; color: #fff',
	};

	var ns = {};

	var expectedStyles = [];

	ns.colorize = function($xml){
		if(!$xml)
			return;

		if(typeof $xml === 'string')
			$xml = $($.parseXML($xml));

		var convertedXmlStr = readNodeElement($xml);

		expectedStyles.unshift(convertedXmlStr);
		console.log.apply(console, expectedStyles);

		while(expectedStyles.length > 0)
			expectedStyles.pop();
	}

	function readNodeElement($elementNode, processedXmlStr, tabAmount){
		if(!processedXmlStr)
			processedXmlStr = '';

		if(!tabAmount)
			tabAmount = 0;

		$.each($elementNode, function(){
			var $node = $(this);

			var elemNode = $node[0];

			switch(parseInt($node.prop('nodeType'))){
				case NODE_TYPES.Element : 

					for(var i = 0; i < tabAmount; i++){
						processedXmlStr += TAB;
					}

					processedXmlStr += assocWith(CSS.element, '<' + elemNode.nodeName);

					if(elemNode.attributes && elemNode.attributes.length > 0){
						processedXmlStr += ' ';

						for(var i = 0, attrLength = elemNode.attributes.length; i < attrLength; i++){
							var attr = elemNode.attributes.item(i);
							processedXmlStr += attr.nodeName;

							if(attr.nodeValue){
								processedXmlStr += '=';
								processedXmlStr += assocWith(CSS.attrValue, '\"' + attr.nodeValue + '\"');
							}

							if(i != attrLength - 1)
								processedXmlStr += ' ';
						}
					}

					processedXmlStr += '>';

					var addTabs = true;

					if(elemNode.childNodes && 
						elemNode.childNodes.length > 0 && 
						elemNode.childNodes[0].nodeType === NODE_TYPES.Text && 
						elemNode.childNodes[0].textContent)
					{
						processedXmlStr += assocWith(CSS.text, elemNode.childNodes[0].textContent);
						addTabs = false;
					}
					else{
						processedXmlStr += '\n\r';
					}

					processedXmlStr = readNodeElement($node.children(), processedXmlStr, tabAmount + 1);

					for(var i = 0; addTabs && i < tabAmount; i++){
						processedXmlStr += TAB;
					}

					processedXmlStr += '</' + elemNode.nodeName + '>\n\r';
					break;
				case NODE_TYPES.Document : 
				case NODE_TYPES.DocumentType : 
				case NODE_TYPES.DocumentFragment : 
					processedXmlStr = readNodeElement($node.children(), processedXmlStr);
					break;
			}
		});

		return processedXmlStr;
	}

	function assocWith(strCss, xmlPart){
		expectedStyles.push(strCss, CSS.element);
		return '%c' + xmlPart + '%c';
	}

	window.XmlColorConsoleLog = ns;

}());