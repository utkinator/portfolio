(function ($) {
    'use strict';

    window.xmlDoc = null;

    var root = document.getElementById('root');
    var parser = new DOMParser();
    var xmlFile = "./xml/SL50parameters_20171013.xml";
    var $keys = [];
    var $enams = [];

    function pretty(str) {
        return str;
    }

    function generateKeyDomElement(key) {
        var keyName = $(key).attr('name');
        var keyType = $(key).attr('type');
        var keyEnum = $(key).attr('enum');

        var keySummary = $(key).find('summary');
        var keyDescription = $(key).find('description');
        var keyChoices = $(key).find('choices');
        var keyRange = $(key).find('range');
        var keyDefault = $(key).find('default');

        var $keyDomElement = $('<div class="key">');
        var $keySummary = $('<p class="summary" contenteditable="true" title="Click to edit">');
        var $keyDescription = $('<p class="description" contenteditable="true" title="Click to edit">');

        var $options = [];
        var $input = $('<input>', {
            "type": "text",
            "class": "form-control"
        });
        var $inputRange = $('<input>', {
            "type": "range",
            "class": "form-control"
        });
        var $inputNumber = $('<input>', {
            "type": "number",
            "class": "form-control"
        });
        var $inputMin = $('<input>', {
            "type": "number",
            "class": "form-control"
        });
        var $inputMax = $('<input>', {
            "type": "number",
            "class": "form-control"
        });
        var $textarea = $('<textarea>', {
            "class": "form-control"
        });
        var $select = $('<select>', {
            "class": "form-control"
        });
        var $option = null;

        $keySummary.text(keySummary.text());
        $keyDescription.text(keyDescription.text());

        $keyDomElement.append($keySummary);
        $keyDomElement.append($keyDescription);

        if (keyChoices.length) {
            var choices = keyChoices.find('choice');
            $options = [];

            for(var i=0; i<choices.length; i++) {
                $option = $('<option>', {
                    "value": $(choices[i]).attr('value'),
                    "selected": keyDefault.text() === $(choices[i]).attr('value')
                });

                $option.text($(choices[i]).attr('value'));
                $options.push($option);
            }

            $select.append($options);
            $keyDomElement.append($select);
        }

        if (keyEnum) {
            var neededEnam = $(xmlDoc).find("enum[id='"+ keyEnum +"']");
            var enumChildren = neededEnam.find('value');
            $options = [];

            if (enumChildren) {
                for (var j=0; j<enumChildren.length; j++) {
                    $option = $('<option>', {
                        "value": "'" + $(enumChildren[j]).attr('nick') + "'",
                        "text": $(enumChildren[j]).attr('nick'),
                        "selected": keyDefault.text() === "'" + $(enumChildren[j]).attr('nick') + "'"
                    });

                    $options.push($option);
                }

                $select.append($options);
                $keyDomElement.append($select);
            }
        }

        if (keyRange.length) {
            var minValue = keyRange.attr('min');
            var maxValue = keyRange.attr('max');

            $inputRange = $('<input>', {
                "type": "range",
                "value": keyDefault.text(),
                "min": minValue,
                "max": maxValue,
                "class": "form-control"
            });

            $inputMin = $('<input>', {
                "type": "number",
                "value": minValue,
                "class": "form-control"
            });
            $inputMax = $('<input>', {
                "type": "number",
                "value": maxValue,
                "class": "form-control"
            });
            $keyDomElement.append($inputMin, $inputRange, $inputMax);
            $keyDomElement.append('<p class="default">Default: ' + keyDefault.text() + '</p>');
        }

        if (keyType === 'b') {
            $options = [
                $('<option>', {
                    "value": "true",
                    "text": "true",
                    "selected": keyDefault.text() === "true",
                    "class": "form-control"
                }),
                $('<option>', {
                    "value": "false",
                    "text": "false",
                    "selected": keyDefault.text() === "false",
                    "class": "form-control"
                })
            ];

            $select.append($options);
            $keyDomElement.append($select);
        }

        if (keyType === 'u' && !keyRange.length) {
            $inputNumber = $('<input>', {
                "type": "number",
                "value": keyDefault.text(),
                "class": "form-control"
            });

            $keyDomElement.append($inputNumber);
        }

        if (keyType === 'a{sb}') {
            $input[0].value = keyDefault.text();

            $keyDomElement.append($input);
        }

        if (keyType === 'as' || keyType === 'a{su}' || keyType === 'a{ss}') {
            $textarea[0].value = pretty(keyDefault.text());

            $keyDomElement.append($textarea);
        }

        if (keyType === 's' && !keyChoices.length) {
            $input[0].value = keyDefault.text();
            $keyDomElement.append($input);
        }

        $input.on('change', function () {
            $(keyDefault).text($(this).val());
            renderXML();
        });
        $inputRange.on('change', function () {
            $(keyDefault).text($(this).val());
            renderXML();
        });
        $inputNumber.on('change', function () {
            $(keyDefault).text($(this).val());
            renderXML();
        });
        $inputMin.on('change', function () {
            $(keyRange).attr('min', $(this).val());
            renderXML();
        });
        $inputMax.on('change', function () {
            $(keyRange).attr('max', $(this).val());
            renderXML();
        });
        $select.on('change', function () {
            $(keyDefault).text($(this).val());
            renderXML();
        });
        $textarea.on('change', function () {
            $(keyDefault).text($(this).val());
            renderXML();
        });
        $keySummary.on('blur', function () {
            $(keySummary).text($(this).text());
            renderXML();
        });
        $keyDescription.on('blur', function () {
            $(keyDescription).text($(this).text());
            renderXML();
        });

        return $keyDomElement;
    }

    function renderXML() {
        $keys = $(window.xmlDoc).find("key");
        $enams = $(window.xmlDoc).find("enum");
        var $keysDomElements = [];

        for(var i=0; i<$keys.length; i++) {
            var $keyDomElement = generateKeyDomElement($keys[i]);

            $keysDomElements.push($keyDomElement);
        }

        $(root).html($keysDomElements);
    }

    function reqListener () {
        window.xmlDoc = parser.parseFromString(this.responseText,"text/xml");

        renderXML();
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", xmlFile);
    oReq.send();
})($);
