;
(function ($, document, Lego) {
    'use strict';

    Lego.Models.getcoder = Backbone.Model.extend({
        defaults: {
            isMUIstylesEnabled: NO,
            htmlCode: 'No HTML code',
            cssCode: 'No CSS code'
        }
    });

    Lego.Views.getcoderView = Backbone.View.extend({
        model: Lego.Models.getcoder,
        className: 'fade',
        deskboardClone: null,
        template: _.template($('#getcoder-template').html()),

        events: {
            'click .ui-button-cancel': 'remove',
            'click .close': 'remove',
            'change #all_css': 'toggleCSSmode'
        },

        initialize: function () {
            var self = this,
                deskboard = $(Lego.Deskboard),
                html = deskboard.html();

            this.model = new this.model;

            if ($.trim(html).length) {
                this.render();
            } else {
                new Lego.Views.Error({
                    message: 'No code detected'
                });
            }

            $('.ui-tab-nav a')
                .live('click', function () {
                    var type = $(this).attr('data-type');

                    self.initCodeHighlighter(type);
                });

            this.model
                .on('change:isMUIstylesEnabled', function (model, isMUIstylesEnabled) {
                    this.render();

                    $('[data-type="css"]', this.el).trigger('click');
                }.bind(this));

            $(window)
                .on('keyup.closeGetcoder', function (e) {
                    var keyCode = e.keyCode;

                    switch (keyCode) {
                        case Lego.KeyCodes.ESC :
                            self.remove();

                            break;

                        default:
                            return NO;
                    }
                });
        },

        prepareHTML: function () {
            var collection = App.deskboard.collection,
                models = collection.where({toDelete: NO}),
                deskboard = $(Lego.Deskboard),
                deskboardClone = this.deskboardClone = deskboard.clone(),
                elems = null,
                itemsToRemove = $('.styler, .close, .ui-resizable-handle', deskboardClone),
                attrsToRemove = ['style'],
                classesToRemove = [
                    'ui-draggable',
                    'ui-droppable',
                    'ui-sortable',
                    'ui-resizable',
                    'ui-basic'
                ],
                html = '';

            // remove unnecessary elements
            itemsToRemove.remove();

            elems = $('*', deskboardClone);

            // remove attrs
            var ids = [],
                elemsToSaveId = [];

            _.each(elems, function (elem) {
                _.each(attrsToRemove, function (attr) {
                    $(elem).removeAttr(attr);
                });

                var model = collection.get($(elem).attr('id'));

                if (model) {
                    var styles = model.get('styles');

                    if (styles && !$.isEmptyObject(styles)) {
                        elemsToSaveId.push($(elem).attr('id'));
                    }
                }

                if ($(elem).attr('id') && !$(elem).hasClass('tab-pane')) {
                    if (!$(elem).hasClass('ui-accordion-body')) {
                        ids.push($(elem).attr('id'));
                    }
                }
            });

            _.each(_.difference(ids, elemsToSaveId), function (id) {
                $('#' + id, deskboardClone).removeAttr('id');
            });

            // remove classes-helpers
            _.each(elems, function (elem) {
                var el = $(elem);

                _.each(classesToRemove, function (className) {
                    el.removeClass(className);
                });
                if (el.hasClass('')) {
                    el.removeAttr('class');
                }
//                var value = $('span.value', el),
//                    text = value.text();
//
//                el.prepend(text);
//                value.remove();
            });

            html = deskboardClone.html();

            // removing line breaks
            var regexNewLine = /(>\s<)|(><)/gim;
            html = html
                .replace(/(\r\n|\n|\r)/gm, '')
                .replace(/\s+/g, ' ')
                .replace(regexNewLine, '>\n<');

            this.model.set('htmlCode', html);
        },

        prepareCSS: function () {
            var collection = App.deskboard.collection,
                models = collection.where({toDelete: NO}),
                modelsCustomStyles = '',
                styles = '';

            var getCustomStyles = function () {
                _.each(models, function (model) {
                    var styles = model.get('styles');

                    if (styles && !$.isEmptyObject(styles)) {
                        modelsCustomStyles += '#' + model.get('id') + JSON.stringify(model.get('styles'));
                    }
                });
                var r = /"/gim;
                return modelsCustomStyles.replace(/",/gim, '";').replace(r, '');
            };

            if (!this.model.get('isMUIstylesEnabled')) {
                // collect all used ui_types
                var types = _.uniq(_.map(models, function (model) {
                    return model.get('ui_type');
                }));

                // reset, icons, common styles
                styles += Lego.Styles.base;

                _.each(types, function (type) {
                    if (Lego.Styles[type]) {
                        styles += Lego.Styles[type];
                    }
                });

                styles += getCustomStyles();

                // .hidden, ...
                styles += Lego.Styles.utils;
            } else {
                styles += getCustomStyles();
            }

            this.model.set('cssCode', styles);
        },

        toggleCSSmode: function () {
            this.model.set('isMUIstylesEnabled', $('#all_css').prop('checked'));

            return NO;
        },

        initCodeHighlighter: function (type) {
            $('.CodeMirror').remove();

            var editor = CodeMirror.fromTextArea(document.getElementById(type), {
                mode: "text/" + type + "",
                lineNumbers: true,
                indentUnit: 4
            });

            CodeMirror.commands["selectAll"](editor);

            function getSelectedRange() {
                return { from: editor.getCursor(true), to: editor.getCursor(false) };
            }

            (function autoFormatSelection() {
                var range = getSelectedRange();
                editor.autoFormatRange(range.from, range.to);
            })();

            editor.refresh();
        },

        render: function () {
            var el = $(this.el);

            this.prepareHTML();
            this.prepareCSS();

            el.empty().append(this.template(this.model.attributes));

            $('body').append(el);

            this.initCodeHighlighter('html');
        },

        remove: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.deskboardClone = null;
        }
    });

})(window.jQuery, document, Lego);
