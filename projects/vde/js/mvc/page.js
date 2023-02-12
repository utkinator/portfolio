;
(function ($, document, Lego) {
    'use strict';

    /* pages MVC
     ========================================================================== */
    Lego.Models.page = Backbone.Model.extend({
        defaults: {
            bg: Lego.Path.img + 'mili.gif',
            id: Lego.Utils.getGUID()
        }
    });

    Lego.Collections.page = Backbone.Collection.extend({
        initialize: function () {
        },

        fetch: function () {
        }
    });

    Lego.Views.page = Backbone.View.extend({
        model: new Lego.Models.page,
        className: 'mili',
        template: _.template($('#page-template').html()),
        collection: new Lego.Collections.page,

        events: {},

        initialize: function () {
            this.wrapper = $(Lego.Wrapper);

            Lego.Utils.enableLoader(this.wrapper);

            this.render();
        },

        render: function () {
            var el = $(this.el);

            el
                .attr('id', this.model.id)
                .on('mouseup', function () {
                    $('.ui-droppable-over').removeClass('ui-droppable-over');
                });

            this.template = el.append(this.template);
            this.wrapper.append(this.template);

            Lego.Utils.disableLoader(this.wrapper);
        }
    });
})(window.jQuery, document, Lego);
