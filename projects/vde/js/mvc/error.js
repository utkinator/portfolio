;
(function ($, document, Lego) {
    'use strict';

    /* error handler
     ========================================================================== */
    Lego.Models.Error = Backbone.Model.extend({
        defaults: {
            message: 'Unknown error happend'
        }
    });

    Lego.Collections.Error = Backbone.Collection.extend({
        model: Lego.Models.Error,
        url: function () {
            return NO;
        }
    });

    Lego.Views.Error = Backbone.View.extend({
        model: new Lego.Models.Error,
        className: 'error',
        template: _.template($('#error-template').html()),
        timerID: null,
        appearanceSpeed: '500',
        visibilityTime: '5000',
        callback: null,

        events: {
            "click .error-content": "remove",
            "mouseenter .error-content": "onMouseOver",
            "mouseleave .error-content": "setTimer"
        },

        initialize: function (params) {
            this.render(params);
        },

        render: function (params) {
            var el = $(this.el),
                body = $('body'),
                model = this.model;

            $.extend(model.attributes, params);

            this.template = el.append(this.template(model.attributes));

            params.callback && (this.callback = params.callback);

            body.append(this.template.hide().fadeIn(this.appearanceSpeed));
            this.setTimer();
        },

        setTimer: function () {
            this.timerID && clearTimeout(this.timerID);
            this.timerID = setTimeout(function () {
                this.remove();
            }.bind(this), this.visibilityTime);
        },

        onMouseOver: function () {
            this.timerID && clearTimeout(this.timerID);
        },

        remove: function () {
            var self = this;

            $(this.el)
                .stop(YES, YES)
                .fadeOut(self.appearanceSpeed, function () {
                    $(this).remove();
                    self.callback && self.callback();
                });
        }
    });
})(window.jQuery, document, Lego);
