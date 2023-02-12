;
(function ($, document, Lego) {
    'use strict';

    /* Notes
     ========================================================================== */
    Lego.Models.styler = Backbone.Model.extend({
        defaults: {
            isHidden: YES
        }
    });

    Lego.Views.styler = Backbone.View.extend({
        model: Lego.Models.styler,
        uiElemModel: null,
        className: 'styler',
        origValue: null,
        savedValue: null,
        template: _.template($('#styler-template').html()),

        events: {
            'click .icon-pencil': 'toggleStyler',
            'click .styles-new i': 'addNewStyle'
        },

        initialize: function () {
            var el = $(this.el),
                self = this;

            this.model = new Lego.Models.styler;

            this.model
                .on('change:isHidden', function (model, isHidden) {
                    el.toggleClass('opened', !isHidden);
                });

            $(document)
                .on('keyup.hideStylers', function (e) {
                    var keyCode = e.keyCode;

                    switch (keyCode) {
                        case Lego.KeyCodes.ESC :
                            self.model.set('isHidden', YES);
                            break;

                        default:
                            return NO;
                    }
                })
                .on('click.hideStyler', function (e) {
                    self.model.set('isHidden', YES);
                });

            el.on('click.preventHideStyler', function (e) {
                e.stopPropagation();
            });
        },

        render: function (params) {
            var self = this,
                el = $(this.el),
                params = params || {},
                parent = params.parent || {},
                target = params.target,
                model = params.model,
                menu = null,
                styler = el.append(this.template(model.attributes));

            this.uiElemModel = model;
            this.uiElemModel
                .on('change:styles', function (model, styles) {
                    target.attr('style', '').css(styles);
                    this.menu.render({styles: styles});
                }.bind(this));

            var styler_menu = Backbone.View.extend({
                tagName: 'ul',
                className: 'styles',
                isEditMode: NO,
                template: _.template($('#styler-menu-template').html()),

                events: {
                    'dblclick dd': function (e) {
                        var item = $(e.currentTarget);

                        this.toggleEditMode(item);
                    },
                    'click .icon-remove': function (e) {
                        var item = $(e.currentTarget).closest('.item');

                        item.remove();

                        this.setNewStyles();
                    },
                    'blur input': function (e) {
                        this.toggleEditMode($(e.currentTarget).closest('dd'));
                    },
                    'change input': function (e) {
                        this.toggleEditMode($(e.currentTarget).closest('dd'));
                    },
                    'keyup input': function (e) {
                        var keyPressed = e.keyCode;

                        switch (keyPressed) {
                            case Lego.KeyCodes.Enter:
                                this.toggleEditMode($(e.currentTarget).closest('dd'));
                                break;
                            case Lego.KeyCodes.ESC:
                                this.savedValue = this.origValue;

                                this.toggleEditMode($(e.currentTarget).closest('dd'));

                                break;

                            default:
                                return NO;
                        }
                    }
                },

                render: function (models) {
                    return $(this.el).empty().append(this.template(models));
                },

                toggleEditMode: function (item) {
                    var textWrapper = $('span', item),
                        orig = textWrapper.text(),
                        input = $('<input type="text" value="' + orig + '" />');

                    this.origValue = orig;

                    if (!this.isEditMode) {
                        textWrapper.hide();
                        item.append(input);
                        input.focus();

                        this.savedValue = null;
                        this.isEditMode = YES;
                    } else {
                        var inp = $('[type="text"]', item),
                            newVal = this.savedValue || inp.val();

                        textWrapper
                            .text(newVal)
                            .show();

                        $('[type="text"]', item).remove();

                        this.setNewStyles();

                        this.isEditMode = NO;
                    }
                },

                setNewStyles: function () {
                    var el = $(this.el),
                        styles = $('.item', el),
                        newStyles = {};

                    _.each(styles, function (style) {
                        var prop = $('dt', style).text(),
                            value = $('dd', style).text();

                        newStyles[prop] = value;
                    });

                    self.uiElemModel.set('styles', newStyles);
                }
            });

            // read model "styles" prop
            var styles = model.get('styles'),
                menu = this.menu = new styler_menu;

            $('.styler-content', el).append(menu.render({styles: styles}));

            styler.appendTo(parent.length ? parent : target);
        },

        toggleStyler: function () {
            var isHidden = this.model.get('isHidden');

            if (isHidden) {
                this.model.set('isHidden', NO);
            } else {
                this.model.set('isHidden', YES);
            }
        },

        addNewStyle: function (e) {
            var self = this,
                model = this.uiElemModel,
                propsContainer = $('.styles-new-props', $(this.el)),
                form = $('.styles-form', propsContainer),
                inputs = $('input', form),
                inpValue = $('.new-value', form);

            inputs
                .off('keyup.addNewStyle')
                .on('keyup.addNewStyle', function (e) {
                    var keyCode = e.keyCode,
                        input = $(this);

                    switch (keyCode) {
                        case Lego.KeyCodes.Enter :
                            if (input.attr('class') == 'new-prop') {
                                inpValue.focus();
                            } else {
                                form.submit();
                            }
                            break;

                        default:
                            return NO;
                    }
                });

            form
                .off('submit.addNewStyle')
                .on('submit.addNewStyle', function () {
                    var data = $(this).serializeArray();

                    var empty = _.find(data, function (item) {
                        return item.value == '';
                    });

                    if (empty) {
                        new Lego.Views.Error({
                            message: 'All fields required!'
                        });
                    } else {
                        var modelStyles = model.get('styles'),
                            preparedData = {};

                        preparedData[data[0].value] = data[1].value;
                        $.extend(preparedData, modelStyles);

                        model.set('styles', preparedData);

                        inputs.eq(0).focus();
                        inputs.val('');
                    }

                    return NO;
                });

            propsContainer.toggleClass('hidden');
            inputs.eq(0).focus();
        },

        remove: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });
        }
    });
})(window.jQuery, document, Lego);
