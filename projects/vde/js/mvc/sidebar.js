;
(function ($, document, Lego) {
    'use strict';

    /* sidebar MVC
     ========================================================================== */
    Lego.Models.sidebar = Backbone.Model.extend({
        defaults: {
            isOpened: NO
        }
    });

    Lego.Views.sidebar = Backbone.View.extend({
        model: new Lego.Models.sidebar,
        tagName: 'aside',
        className: 'sidebar',
        visibilityClassName: 'opened',
        template: _.template($('#sidebar-template').html()),

        events: {
            'click .sidebar-toggle': 'toggleSidebarVisibility',
            'click .button': 'loadNeededContent'
        },

        initialize: function (params) {
            var self = this,
                el = $(this.el),
                model = this.model;

            model
                .on('change:isOpened', function (model, isOpened) {
                    var arrow = $('.sidebar-toggle', el);

                    isOpened ? arrow.text('►') : arrow.text('◄');
                    el.toggleClass(this.visibilityClassName, isOpened);
                }.bind(this));

            this.wrapper = $(Lego.Wrapper);
            this.template = el.append(this.template);

            this.model.set('isOpened', YES);

            this.render();
        },

        render: function () {
            this.template.insertAfter(this.wrapper);
        },

        toggleSidebarVisibility: function () {
            var state = this.model.get('isOpened');

            this.model.set('isOpened', !state);
        },

        loadNeededContent: function (e) {
            var activeBtn = $(e.currentTarget),
                activeClassName = 'active',
                type = activeBtn.attr('data-ui_type');

            Lego.Utils.enableLoader($(Lego.SidebarContent));

            App.ui_items.loadContent(type);

            activeBtn
                .addClass(activeClassName)
                .parent()
                .siblings()
                .find('.button')
                .removeClass(activeClassName);
        }
    });
})(window.jQuery, document, Lego);
