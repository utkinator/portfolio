;
(function ($, document, Lego) {
    'use strict';

    /* UI Layouts MVC
     ========================================================================== */
    Lego.Models.layout = Backbone.Model.extend({
        defaults: {
            ui_type: 'layout',
            type: 'simple',
            header: {
                visible: YES,
                id: Lego.Utils.getGUID()
            },
            content: {
                visible: YES,
                id: Lego.Utils.getGUID()
            },
            footer: {
                visible: YES,
                id: Lego.Utils.getGUID()
            },
            id: null,
            orderIndex: null,
            colmain_id: Lego.Utils.getGUID(),
            colleft_id: Lego.Utils.getGUID(),
            colright_id: Lego.Utils.getGUID(),
            isClosable: NO,
            isStylable: NO
        }
    });

    Lego.Collections.ui_layout = Backbone.Collection.extend({
        model: Lego.Models.layout,
        localStorage: 'layouts',

        fetch: function () {
            this.reset([
                {type: 'simple'},
                {type: '2cl'},
                {type: '2cr'},
                {type: '3c'}
            ]);
        }
    });

    Lego.Views.ui_layout = Backbone.View.extend({
        model: new Lego.Models.layout,
        currentModel: null,
        className: 'ui-layout',
        template: _.template($('#ui-layout-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                attrs = {},
                styles = model.styles || {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-layout-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            // return rendered layouts
            return el.append(this.template(model));
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Grid MVC
     ========================================================================== */
    Lego.Models.ui_grid = Backbone.Model.extend({
        defaults: {
            ui_type: 'grid',
            grid_type: null,
            type: '12',
            items: null,
            items_ids: null,
            items_layout: null,
            orderIndex: null,
            isClosable: NO,
            isStylable: NO
        }
    });

    Lego.Collections.ui_grid = Backbone.Collection.extend({
        model: Lego.Models.ui_grid,
        localStorage: 'grids',

        fetch: function () {
            this.reset([
                {items: 1},
                {items: 2},
                {items: 3},
                {items: 4},
                {items: 5},
                {items: 6},
                {items: 12},
                {items: 2, items_layout: [3, 9]},
                {items: 2, items_layout: [9, 3]},
                {items: 3, items_layout: [3, 6, 3]},
                {items: 4, items_layout: [1, 1, 1, 9]},
                {grid_type: 'collapsed', items: 12},
                {grid_type: 'collapsed', items: 3}
            ]);
        }
    });

    Lego.Views.ui_grid = Backbone.View.extend({
        model: Lego.Models.ui_grid,
        currentModel: null,
        className: 'ui-grid-row',
        template: _.template($('#ui-grid-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        initialize: function () {
            this.model = new this.model;
        },

        render: function (model) {
            var el = $(this.el),
                grid_type = model.grid_type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            grid_type && el.addClass('ui-grid-' + grid_type);
            id && el.attr('id', id);

            this.currentModel = model;

            // calc classname
            var total = 12,
                type = total / model.items;

            type += '';
            type = type.replace('.', '_');

            model.type = type;

            var result = el.append(this.template(model));

            styles && el.find('[class*="grid"]').css(styles);

            // return rendered grids
            return result;
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Basics MVC
     ========================================================================== */
    Lego.Models.ui_basic = Backbone.Model.extend({
        defaults: {
            ui_type: 'basic',
            tag: 'div',
            isClosable: NO,
            value: 'Lorem ipsum',
            isValuable: YES,
            orderIndex: null,
            id: null
        }
    });

    Lego.Collections.ui_basic = Backbone.Collection.extend({
        model: Lego.Models.ui_basic,
        localStorage: new Store("basics"),

        fetch: function () {
            this.reset([
                {"ui_type": "basic", tag: "h1", value: "This is first level heading"},
                {"ui_type": "basic", tag: "h2", value: "This is 2nd level heading"},
                {"ui_type": "basic", tag: "h3", value: "This is 3rd level heading"},
                {"ui_type": "basic", tag: "h4", value: "This is 4th level heading"},
                {"ui_type": "basic", tag: "h5", value: "This is 5th level heading"},
                {"ui_type": "basic", tag: "h6", value: "This is 6th level heading"},
                {"ui_type": "basic", tag: "p", value: "This is a normal paragraph (<code>p</code>element)."},
                {"ui_type": "basic", tag: "div", value: "This is a<code>div</code>element."},
                {"ui_type": "basic", tag: "a", value: "Simple link", attrs: [
                    {"href": "#"}
                ]},
                {"ui_type": "basic", tag: "blockquote", value: "<p>This is a block <code>quotation</code> containing a singleparagraph.</p><small>Someone famous</small>"},
                {"ui_type": "basic", tag: "address", value: "<a href='//magento.com'>Magento</a>,<a href='mailto:info@magento.com'>info@magento.com</a>"},
                {"ui_type": "basic", tag: "ul", value: "<li><code>ul</code> item 1</li><li><code>ul</code> item 2</li>", isValuable: NO},
                {"ui_type": "basic", tag: "ol", value: "<li><code>ol</code> item 1</li><li><code>ol</code> item 2</li>", isValuable: NO},
                {"ui_type": "basic", tag: "menu", value: "<li><code>menu</code> item 1</li><li><code>menu</code> item 2</li>", isValuable: NO},
                {"ui_type": "basic", tag: "dl", value: "<dt>recursion</dt><dd>see recursion</dd><dt>recursion, indirect</dt><dd>see indirect recursion</dd>", isValuable: NO},
                {"ui_type": "basic", tag: "abbr", value: "CSS abbr", attrs: [
                    {"title": "Cascading Style Sheets"}
                ]},
                {"ui_type": "basic", tag: "b", value: "bolded"},
                {"ui_type": "basic", tag: "font", value: "large size, font size = 6", attrs: [
                    {"size": "6"}
                ]},
                {"ui_type": "basic", tag: "font", value: "red text", attrs: [
                    {"color": "red"}
                ]},
                {"ui_type": "basic", tag: "ins", value: "inserted"},
                {"ui_type": "basic", tag: "strike", value: "overstruck"},
                {"ui_type": "basic", tag: "u", value: "underlined"}
            ]);
        }
    });

    Lego.Views.ui_basicView = Backbone.View.extend({
        model: Lego.Models.ui_basic,
        currentModel: null,
        className: 'ui-basic',
        template: _.template($('#ui-basic-template').html()),

        events: {
            'click .close': 'closeElem',
            'dblclick': 'editBasic'
        },

        render: function (model) {
            var el = $(this.el),
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            // return rendered basics
            return el.append(this.template(model));
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        },

        editBasic: function (e) {
            var self = this,
                basic = $(e.currentTarget);


            if (this.currentModel.isValuable) {
                basic.attr('contentEditable', YES);
                basic.focus();

                basic
                    .on('blur.basic', function () {
                        self.currentModel.value = $('.value', $(this)).text();
                        basic.attr('contentEditable', NO);
                    })
                    .on('click.basic', function (e) {
                        e.stopPropagation();
                    });

                $(window)
                    .on('click.basic', function (e) {
                        basic.trigger('blur.basic');
                    });
            } else {
                new Lego.Views.Error({
                    message: '"' + this.currentModel.tag + '" element could not be modified.'
                });
            }
        }
    });


    /* UI Button MVC
     ========================================================================== */
    Lego.Models.ui_button = Backbone.Model.extend({
        defaults: {
            ui_type: 'button',
            tag: 'div',
            label: 'UI Button',
            isClosable: NO,
            id: null,
            type: null,
            orderIndex: null,
            isEditable: NO,
            isStylable: NO
        }
    });

    Lego.Collections.ui_button = Backbone.Collection.extend({
        model: Lego.Models.ui_button,
//        url: function () {
//            return Lego.Path.baseUrl + 'buttons.php/';
//        }
        localStorage: new Store("buttons"),
        fetch: function () {
            this.reset([
                {"ui_type": "button", "label": "Button 1", "tag": "a", "attrs": [
                    {"href": "/url"},
                    {"id": "someId"}
                ]},
                {"ui_type": "button", "label": "Button 2", "tag": "span"},
                {"ui_type": "button", "label": "Button 3"},
                {"ui_type": "button", "type": "special", "label": "Some special button"},
                {"ui_type": "button", "type": "icon", "label": "Simple button with icon"},
                {"ui_type": "button", "type": ["icon", "ok"], "label": "Ok"},
                {"ui_type": "button", "type": ["icon", "cancel"], "label": "Cancel"},
                {"ui_type": "button-group", "buttons": [
                    {"ui_type": "button", "label": "Left"},
                    {"ui_type": "button", "type": "special", "label": "Middle"},
                    {"ui_type": "button", "label": "Right"}
                ]},
                {"ui_type": "button-group", "buttons": [
                    {"ui_type": "button", "label": "◄"},
                    {"ui_type": "button", "label": "►"}
                ]},
                {"ui_type": "button-group", "type": "vertical", "buttons": [
                    {"ui_type": "button", "label": "Button in group"},
                    {"ui_type": "button", "type": "special", "label": "Button in group"},
                    {"ui_type": "button", "label": "Button in group"}
                ]},
                {"ui_type": "button-group", "type": "vertical", "buttons": [
                    {"ui_type": "button", "label": "▲"},
                    {"ui_type": "button", "label": "▼"}
                ]},
                {"ui_type": "button-dropdown"},
                {"ui_type": "button-dropdown", "type": "top"},
                {"ui_type": "button-dropdown", "type": "splitted"}
            ]);
        }
    });

    Lego.Views.ui_buttonView = Backbone.View.extend({
        model: Lego.Models.ui_button,
        currentModel: null,
        className: 'ui-button',
        savedValue: null,
        template: _.template($('#ui-button-template').html()),

        events: {
            'click': function () {
                return NO;
            },
            'dblclick span:first': function () {
                this.model.set('isEditable', YES)
            },
            'click .close': 'closeElem'
        },

        initialize: function () {
            var self = this;

            this.model = new this.model;

            this.model
                .on('change:isEditable', function (model, isEditable) {
                    this.toggleEditMode(isEditable);
                }.bind(this));

            $(window)
                .on('click.turnOffEditableMode', function () {
                    self.model.set('isEditable', NO);
                });
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                attrs = {},
                styles = model.styles || {},
                className = 'ui-button-';

            model.attrs = model.attrs || {};

            // generate attributes for each button
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            if (type) {
                // "type": ["icon", "ok"] --> class="ui-button-icon ui-button-ok"
                if (typeof type == 'object') {
                    _.each(type, function (t) {
                        el.addClass(className + t);
                    });
                } else {
                    el.addClass(className + type);
                }
            }

            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            // return rendered buttons
            return el.append(this.template(model));
        },

        toggleEditMode: function (isEditable) {
            var elem = $(this.el),
                textContainer = $('span:first', elem),
                origText = textContainer.text(),
                input = $('<input type="text" class="elem-edit" value="' + origText + '" />');

            input
                .on('blur.disableEditMode', function () {
                    this.model.set('isEditable', NO);
                }.bind(this))
                .on('keyup.disableEditMode', function (e) {
                    var keyPressed = e.keyCode;

                    switch (keyPressed) {
                        case Lego.KeyCodes.Enter :
                            this.model.set('isEditable', NO);
                            break;
                        case Lego.KeyCodes.ESC :
                            this.savedValue = origText;

                            this.model.set('isEditable', NO);

                            break;

                        default:
                            return NO;
                    }

                }.bind(this));

            if (isEditable) {
                this.savedValue = null;

                textContainer.hide();
                elem.append(input);
                input.focus();
            } else {
                var inp = $('.elem-edit', elem),
                    newVal = this.savedValue || inp.val();

                textContainer
                    .text(newVal)
                    .show();

                this.currentModel.label = newVal;

                inp.remove();
            }
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Buttons group MVC
     ========================================================================== */
    Lego.Models.ui_button_group = Backbone.Model.extend({
        defaults: {
            ui_type: 'button-group',
            tag: 'div',
            label: null,
            id: null,
            orderIndex: null,
            isClosable: NO,
            isStylable: NO
        }
    });

    Lego.Views.ui_button_groupView = Backbone.View.extend({
        model: new Lego.Models.ui_button_group,
        currentModel: null,
        className: 'ui-button-group',
        template: _.template($('#ui-button-group-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        initialize: function () {
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each button
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-button-group-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            var btns = model.buttons;
            _.each(btns, function (btn) {
                btn.isClosable = NO;

                var ui_btn = new Lego.Views.ui_buttonView(),
                    renderedBtn = ui_btn.render(btn);

                el.append(renderedBtn);
            });

            el.append(this.template(model));

            return el;
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Button dropdown MVC
     ========================================================================== */
    Lego.Models.ui_button_dropdown = Backbone.Model.extend({
        defaults: {
            ui_type: 'button-dropdown',
            tag: 'div',
            isClosable: NO,
            orderIndex: null,
            label: null,
            id: null,
            type: null
        }
    });

    Lego.Views.ui_button_dropdownView = Backbone.View.extend({
        model: new Lego.Models.ui_button_dropdown,
        currentModel: null,
        className: 'ui-button-group',
        template: _.template($('#ui-button-dropdown-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        initialize: function () {
        },

        render: function (model) {
            var el = $(this.el),
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each button
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });

    /* UI Messages MVC
     ========================================================================== */
    Lego.Models.ui_message = Backbone.Model.extend({
        defaults: {
            ui_type: 'message',
            tag: 'div',
            isClosable: NO,
            orderIndex: null,
            type: null,
            header: null,
            footer: null,
            id: null
        }
    });

    Lego.Collections.ui_message = Backbone.Collection.extend({
        model: Lego.Models.ui_message,
//        url: function() {
//            return Lego.Path.baseUrl + 'messages.php/';
//        }
        localStorage: new Store("messages"),

        fetch: function () {
            this.reset([
                {"ui_type": "message", "type": "under-construction", "message": "<strong>This store is under construction. Any orders placed will not be honored or fullfilled.</strong>"},
                {"ui_type": "message", "message": "Lorem ipsum dolor sit amet, tantus nata genere. Tyrium coniugem in lucem genero quod eam ad nomine, accedens est se ad per accipere filia puella. Magna duobus consolabor potest ei primum intus. Dicens mea Stet consequat Verena est in."},
                {"ui_type": "message", "header": "Closable message", "closable": "true", "message": "Lorem ipsum dolor sit amet, tantus nata genere. Tyrium coniugem in lucem genero quod eam ad nomine, accedens est se ad per accipere filia puella. Magna duobus consolabor potest ei primum intus. Dicens mea Stet consequat Verena est in."},
                {"ui_type": "message", "type": "error", "message": "Lorem ipsum dolor sit amet, tantus nata genere. Tyrium coniugem in lucem genero quod eam ad nomine, accedens est se ad per accipere filia puella. Magna duobus consolabor potest ei primum intus. Dicens mea Stet consequat Verena est in."},
                {"ui_type": "message", "type": "success", "message": "Lorem ipsum dolor sit amet, tantus nata genere. Tyrium coniugem in lucem genero quod eam ad nomine, accedens est se ad per accipere filia puella. Magna duobus consolabor potest ei primum intus. Dicens mea Stet consequat Verena est in."},
                {"ui_type": "message", "type": "success", "header": "Some header", "footer": "Some footer", "message": "Lorem ipsum dolor sit amet, tantus nata genere. Tyrium coniugem in lucem genero quod eam ad nomine, accedens est se ad per accipere filia puella. Magna duobus consolabor potest ei primum intus. Dicens mea Stet consequat Verena est in."}
            ]);
        }
    });

    Lego.Views.ui_messageView = Backbone.View.extend({
        model: Lego.Models.ui_message,
        currentModel: null,
        className: 'ui-message',
        template: _.template($('#ui-message-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-message-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            // return rendered messages
            return el.append(this.template(model));
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        }
    });


    /* UI Tables MVC
     ========================================================================== */
    Lego.Models.ui_table = Backbone.Model.extend({
        defaults: {
            ui_type: 'table',
            caption: 'Default table',
            tag: 'table',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_table = Backbone.Collection.extend({
        model: Lego.Models.ui_table,
        localStorage: new Store("tables"),

        fetch: function () {
            this.reset([
                {"ui_type": "table"},
                {"ui_type": "table", "type": "light", "caption": "Light table"},
                {"ui_type": "table", "type": "full-width", "caption": "Full width table"}
            ]);
        }
    });

    Lego.Views.ui_tableView = Backbone.View.extend({
        model: Lego.Models.ui_table,
        currentModel: null,
        className: 'ui-table',
        template: _.template($('#ui-table-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-table-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            // return rendered messages
            return el.append(this.template(model));
        },

        closeElem: function () {
            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });


            this.currentModel.toDelete = YES;


            return NO;
        }
    });


    /* UI Popups MVC
     ========================================================================== */
    Lego.Models.ui_popup = Backbone.Model.extend({
        defaults: {
            ui_type: 'popup',
            tag: 'div',
            type: null,
            header: null,
            footer: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_popup = Backbone.Collection.extend({
        model: Lego.Models.ui_popup,
        localStorage: new Store("popups"),

        fetch: function () {
            this.reset([
                {"ui_type": "popup"},
                {"ui_type": "popup", "header": 'Simple popup', "footer": YES},
                {"ui_type": "popup", "type": "system", "header": 'System popup', "footer": YES},
                {"ui_type": "popup", "type": "modal", "header": 'Modal popup', "footer": YES}
            ]);
        }
    });

    Lego.Views.ui_popupView = Backbone.View.extend({
        model: Lego.Models.ui_popup,
        currentModel: null,
        className: 'ui-popup',
        template: _.template($('#ui-popup-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-popup-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            // modal
            if (type == 'modal') {
                var fade = $('<div class="fade" />');

                return fade.append(el.append(this.template(model)));
            } else {
                return el.append(this.template(model))
            }
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    if (self.currentModel.type == 'modal') {
                        $(this)
                            .parent()
                            .addClass('ui-removing')
                            .remove();
                    }

                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        }
    });


    /* UI Tabs MVC
     ========================================================================== */
    Lego.Models.ui_tab = Backbone.Model.extend({
        defaults: {
            ui_type: 'tab',
            tag: 'div',
            value: null,
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO,
            isStylable: NO
        }
    });

    Lego.Collections.ui_tab = Backbone.Collection.extend({
        model: Lego.Models.ui_tab,
        localStorage: new Store("tabs"),

        fetch: function () {
            this.reset([
                {"ui_type": "tab"},
                {"ui_type": "tab", "type": "left"},
                {"ui_type": "tab", "type": "right"},
                {"ui_type": "tab", "type": "below"},
                {"ui_type": "accordion"}
            ]);
        }
    });

    Lego.Views.ui_tabView = Backbone.View.extend({
        model: Lego.Models.ui_tab,
        currentModel: null,
        className: 'ui-tab',
        template: _.template($('#ui-tab-template').html()),

        events: {
            'click .close': 'closeElem',
            'dblclick .ui-tab-nav a': 'editTabNav'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            this.model = model || new this.model;

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-tab-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        },

        editTabNav: function (e) {
            var self = this,
                nav = $(e.currentTarget);

            nav.attr('contentEditable', YES);
            nav.focus();

            nav
                .on('blur.lorem', function () {
                    self.model.value = $(this).text();
                    $(this).attr('contentEditable', NO);
                });
        }
    });


    /* UI Accordions MVC
     ========================================================================== */
    Lego.Models.ui_accordion = Backbone.Model.extend({
        defaults: {
            ui_type: 'accordion',
            tag: 'div',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO,
            isStylable: NO
        }
    });

    Lego.Collections.ui_accordion = Backbone.Collection.extend({
        model: Lego.Models.ui_accordion,
        localStorage: new Store("accordions")
    });

    Lego.Views.ui_accordionView = Backbone.View.extend({
        model: Lego.Models.ui_accordion,
        currentModel: null,
        className: 'ui-accordion',
        template: _.template($('#ui-accordion-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-accordion-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        }
    });


    /* UI Paginations MVC
     ========================================================================== */
    Lego.Models.ui_pagination = Backbone.Model.extend({
        defaults: {
            ui_type: 'pagination',
            tag: 'div',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_pagination = Backbone.Collection.extend({
        model: Lego.Models.ui_pagination,
        localStorage: new Store("paginations"),

        fetch: function () {
            this.reset([
                {"ui_type": "pagination"}
            ]);
        }
    });

    Lego.Views.ui_paginationView = Backbone.View.extend({
        model: Lego.Models.ui_pagination,
        currentModel: null,
        className: 'ui-pagination',
        template: _.template($('#ui-pagination-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-pagination-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        }
    });


    /* UI Breadcrumbs MVC
     ========================================================================== */
    Lego.Models.ui_breadcrumbs = Backbone.Model.extend({
        defaults: {
            ui_type: 'breadcrumbs',
            tag: 'div',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_breadcrumbs = Backbone.Collection.extend({
        model: Lego.Models.ui_breadcrumbs,
        localStorage: new Store("breadcrumbs"),

        fetch: function () {
            this.reset([
                {"ui_type": "breadcrumbs"},
                {"ui_type": "breadcrumbs", "type": "alt"}
            ]);
        }
    });

    Lego.Views.ui_breadcrumbsView = Backbone.View.extend({
        model: Lego.Models.ui_breadcrumbs,
        currentModel: null,
        className: 'ui-breadcrumbs',
        template: _.template($('#ui-breadcrumbs-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-breadcrumbs-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        }
    });


    /* UI Navigation MVC
     ========================================================================== */
    Lego.Models.ui_nav = Backbone.Model.extend({
        defaults: {
            ui_type: 'nav',
            tag: 'nav',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_nav = Backbone.Collection.extend({
        model: Lego.Models.ui_nav,
        localStorage: new Store("navs"),

        fetch: function () {
            this.reset([
                {"ui_type": "nav"},
                {"ui_type": "nav", "type": "vertical"},
                {"ui_type": "nav", "type": "inline"},
                {"ui_type": "nav", "type": "tree"}
            ]);
        }
    });

    Lego.Views.ui_navView = Backbone.View.extend({
        model: Lego.Models.ui_nav,
        currentModel: null,
        className: 'ui-nav',
        template: _.template($('#ui-nav-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-nav-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Placeholder MVC
     ========================================================================== */
    Lego.Models.ui_placeholder = Backbone.Model.extend({
        defaults: {
            ui_type: 'placeholder',
            tag: 'div',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_placeholder = Backbone.Collection.extend({
        model: Lego.Models.ui_placeholder,
        localStorage: new Store("placeholders"),
        fLib: null,
        urls: [],

        fetch: function () {
            var self = this;

            this.reset([
                {"ui_type": "placeholder"},
                {"ui_type": "placeholder", styles: { width: 195 + 'px', height: 150 + 'px', lineHeight: 150 + 'px' }},
                {"ui_type": "placeholder", styles: { width: 70 + 'px', height: 70 + 'px', lineHeight: 70 + 'px' }}
            ]);

            var qty = 10;

            for (var i = 0; i < qty; i++) {
                var size = Math.floor(Math.random() * 200),
                    url = 'url(http://lorempixel.com/' + size + '/' + size + ')';

                self.add({
                    ui_type: "placeholder",
                    type: "image",
                    styles: {
                        width: size + 'px',
                        height: size + 'px',
                        'background-image': url
                    }
                });
            }

            Lego.Utils.disableLoader($(Lego.SidebarContent));
        }
    });

    Lego.Views.ui_placeholderView = Backbone.View.extend({
        model: Lego.Models.ui_placeholder,
        currentModel: null,
        className: 'ui-placeholder',
        template: _.template($('#ui-placeholder-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-placeholder-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Tags MVC
     ========================================================================== */
    Lego.Models.ui_tags = Backbone.Model.extend({
        defaults: {
            ui_type: 'tags',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_tags = Backbone.Collection.extend({
        model: Lego.Models.ui_tags,
        localStorage: new Store("tags"),

        fetch: function () {
            this.reset([
                {"ui_type": "tags", elems: [
                    {'size': 75, 'name': 'Tag', 'qty': 1},
                    {'size': 75, 'name': 'acer', 'qty': 3},
                    {'size': 110, 'name': 'bones', 'qty': 4},
                    {'size': 145, 'name': 'cool', 'qty': 1},
                    {'size': 110, 'name': 'cool t-shirt', 'qty': 1},
                    {'size': 75, 'name': 'couch', 'qty': 10},
                    {'size': 110, 'name': 'good', 'qty': 1560},
                    {'size': 110, 'name': 'green', 'qty': 12},
                    {'size': 110, 'name': 'hip', 'qty': 152},
                    {'size': 92, 'name': 'laptop', 'qty': 2},
                    {'size': 92, 'name': 'mobile', 'qty': 254},
                    {'size': 92, 'name': 'nice', 'qty': 54},
                    {'size': 92, 'name': 'notebook', 'qty': 1},
                    {'size': 200, 'name': 'phone', 'qty': 1},
                    {'size': 180, 'name': 'young', 'qty': 10}
                ]},
                {"ui_type": "tags", type: 'alt-style', elems: [
                    {'size': 75, 'name': 'Tag', 'qty': 1},
                    {'size': 75, 'name': 'acer', 'qty': 3},
                    {'size': 110, 'name': 'bones', 'qty': 4},
                    {'size': 145, 'name': 'cool', 'qty': 1},
                    {'size': 110, 'name': 'cool t-shirt', 'qty': 1},
                    {'size': 75, 'name': 'couch', 'qty': 10},
                    {'size': 110, 'name': 'good', 'qty': 1560},
                    {'size': 110, 'name': 'green', 'qty': 12},
                    {'size': 110, 'name': 'hip', 'qty': 152},
                    {'size': 92, 'name': 'laptop', 'qty': 2},
                    {'size': 92, 'name': 'mobile', 'qty': 254},
                    {'size': 92, 'name': 'nice', 'qty': 54},
                    {'size': 92, 'name': 'notebook', 'qty': 1},
                    {'size': 200, 'name': 'phone', 'qty': 1},
                    {'size': 180, 'name': 'young', 'qty': 10}
                ]}
            ]);
        }
    });

    Lego.Views.ui_tagsView = Backbone.View.extend({
        model: Lego.Models.ui_tags,
        currentModel: null,
        tagName: 'ul',
        className: 'ui-tags',
        template: _.template($('#ui-tags-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-tags-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* UI Tooltips MVC
     ========================================================================== */
    Lego.Models.ui_tooltip = Backbone.Model.extend({
        defaults: {
            ui_type: 'tooltip',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO,
            label: 'What is this',
            content: 'Simple tooltip content'
        }
    });

    Lego.Collections.ui_tooltip = Backbone.Collection.extend({
        model: Lego.Models.ui_tooltip,
        localStorage: new Store("tooltip"),

        fetch: function () {
            this.reset([
                {"ui_type": "tooltip"},
                {"ui_type": "tooltip", "label": "", "content": "Some custom content. Tooltip without label"},
                {"ui_type": "tooltip", "type": "tipsy", "label": "With JS, default", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "s"}
                ], "label": "With JS, pos: top", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "se"}
                ], "label": "With JS, pos: top left", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "sw"}
                ], "label": "With JS, pos: top right", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "w"}
                ], "label": "With JS, pos: right", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "nw"}
                ], "label": "With JS, pos: bottom right", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "ne"}
                ], "label": "With JS, pos: bottom left", "content": "Tooltip content positioning by js plugin"},
                {"ui_type": "tooltip", "type": "tipsy", "attrs": [
                    {"data-gravity": "e"}
                ], "label": "With JS, pos: left", "content": "Tooltip content positioning by js plugin"},
            ]);
        }
    });

    Lego.Views.ui_tooltipView = Backbone.View.extend({
        model: Lego.Models.ui_tooltip,
        currentModel: null,
        className: 'ui-tooltip',
        template: _.template($('#ui-tooltip-template').html()),

        events: {
            'click .close': 'closeElem',
            'dblclick .help': 'editLabel'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.attr(attrs);

            type && el.addClass('ui-tooltip-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        },

        editLabel: function (e) {
            var self = this,
                label = $(e.currentTarget);

            label.attr('contentEditable', YES);
            label.focus();

            label
                .on('blur.tooltip', function () {
                    self.currentModel.label = $(this).text();
                    label.attr('contentEditable', NO);
                });

            $(window)
                .on('click.lorem', function (e) {
                    label.trigger('blur.tooltip');
                });
        }
    });


    /* UI Ratings MVC
     ========================================================================== */
    Lego.Models.ui_rating = Backbone.Model.extend({
        defaults: {
            ui_type: 'rating',
            type: null,
            id: null,
            orderIndex: null,
            isClosable: NO
        }
    });

    Lego.Collections.ui_rating = Backbone.Collection.extend({
        model: Lego.Models.ui_rating,
        localStorage: new Store("rating"),

        fetch: function () {
            this.reset([
                {"ui_type": "rating", "width": 50},
                {"ui_type": "rating", "type": "mask", "width": 50},
                {"ui_type": "rating", "type": ["mask", "mask-style-1"], "width": 20},
                {"ui_type": "rating", "type": ["mask", "mask-style-2"], "width": 80},
                {"ui_type": "rating", "type": ["alt", "style-1"], "width": 10},
                {"ui_type": "rating", "type": ["alt", "style-2"], "width": 20},
                {"ui_type": "rating", "type": ["alt", "style-3"], "width": 40},
                {"ui_type": "rating", "type": ["alt", "style-4"], "width": 50},
                {"ui_type": "rating", "type": ["alt", "style-5"], "width": 60},
                {"ui_type": "rating", "type": ["alt", "style-6"], "width": 80},
                {"ui_type": "rating", "type": ["alt", "style-7"], "width": 100}
            ]);
        }
    });

    Lego.Views.ui_ratingView = Backbone.View.extend({
        model: Lego.Models.ui_rating,
        currentModel: null,
        className: 'ui-rating-box',
        template: _.template($('#ui-rating-template').html()),

        events: {
            'click .close': 'closeElem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {},
                className = 'ui-rating-box-';

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.attr(attrs);

            if (type) {
                if (typeof type == 'object') {
                    _.each(type, function (t) {
                        el.addClass(className + t);
                    });
                } else {
                    el.addClass(className + type);
                }
            }

            id && el.attr('id', id);
            styles && el.css(styles);

            this.currentModel = model;

            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;

            return NO;
        }
    });


    /* Utils MVC
     ========================================================================== */
    Lego.Models.util = Backbone.Model.extend({
        defaults: {
            ui_type: 'util',
            tag: 'div',
            type: null,
            id: null,
            orderIndex: null,
            value: null,
            isClosable: NO
        }
    });

    Lego.Collections.util = Backbone.Collection.extend({
        model: Lego.Models.util,
        localStorage: new Store("utils"),

        fetch: function () {
            this.reset([
                {"ui_type": "util", type: "lorem"},
                {"ui_type": "util", type: "dummy"}
            ]);
        }
    });

    Lego.Views.utilView = Backbone.View.extend({
        model: Lego.Models.util,
        currentModel: null,
        className: 'util',

        events: {
            'click .close': 'closeElem',
            'dblclick .lorem-content': 'editLorem'
        },

        render: function (model) {
            var el = $(this.el),
                type = model.type || null,
                id = model.id || null,
                styles = model.styles || {},
                attrs = {};

            this.model = model || new this.model;

            model.attrs = model.attrs || {};

            // generate attributes for each message
            _.each(model.attrs, function (attr) {
                $.extend(attrs, attr);
            });

            el.prop(attrs);

            type && el.addClass('ui-util-' + type);
            id && el.attr('id', id);
            styles && el.css(styles);

            switch (type) {
                case 'lorem' :
                    this.template = _.template($('#utils-lorem-template').html());

                    break;

                case 'dummy' :
                    this.template = _.template($('#utils-dummy-template').html());

                    break;

                case 'some' :
                    this.template = _.template($('#utils-ruler-template').html());

                    break;

                default :
                    return NO;
            }

            this.currentModel = model;
            return el.append(this.template(model));
        },

        closeElem: function () {
            var self = this;

            $(this.el)
                .addClass('ui-removing')
                .delay(50)
                .fadeOut('fast', function () {
                    $(this).remove();
                });

            this.currentModel.toDelete = YES;


            return NO;
        },

        editLorem: function (e) {
            var self = this,
                lorem = $(e.currentTarget);

            lorem.attr('contentEditable', YES);
            lorem.focus();

            lorem
                .on('blur.lorem', function () {
                    self.model.value = $(this).text();
                    lorem.attr('contentEditable', NO);
                });

            $(window)
                .on('click.lorem', function (e) {
                    lorem.trigger('blur.lorem');
                });
        }
    });
})(window.jQuery, document, Lego);