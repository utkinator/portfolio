;
(function ($, document, Lego) {
    'use strict';

    /* Notes
     ========================================================================== */
    Lego.Models.ruler = Backbone.Model.extend({
        defaults: {
            width: 400,
            height: 70,
            isVisible: NO
        }
    });

    Lego.Collections.ruler = Backbone.Collection.extend({
        model: Lego.Models.ruler,
        localStorage: new Store("rulers"),

        initialize: function () {
        }
    });

    Lego.Views.ruler = Backbone.View.extend({
        model: new Lego.Models.ruler,
        currentModel: null,
        className: 'ruler',
        template: _.template($('#ruler-template').html()),

        events: {},

        initialize: function () {
            var el = $(this.el),
                self = this;

            el
                .draggable()
                .resizable({
                    resize: function (event, ui) {
                        self.model.set('width', ui.size.width);
                        self.model.set('height', ui.size.height);
                    }
                });

            this.model
                .on('change:width', function (e) {
                    this.render(e)
                }.bind(this));

            this.render(this.model);
        },

        render: function (model) {
            var el = $(this.el),
                width = $('.ruler-width', el);

            width.empty();

            el.append(this.template(model.attributes));

            $('body').append(el);
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
