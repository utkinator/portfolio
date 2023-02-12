;
(function ($, document, Lego) {
    'use strict';

    /* Backgrounder
     ========================================================================== */

    Lego.Models.backgrounder = Backbone.Model.extend({
        defaults: {
            ui_type: 'background',
            type: 'middle', // ['small', 'big']
            name: 'default',
            path: Lego.Path.img + 'bgs/'
        }
    });

    Lego.Collections.backgrounders = Backbone.Collection.extend({
        model: Lego.Models.backgrounder,
        localStorage: new Store("backgrounds"),

        initialize: function () {
            var self = this;

        },

        fetch: function () {
            this.reset([
                { type: 'single', name: 'transparent', bgcolor: 'transparent' },
                { type: 'single', name: 'black', bgcolor: '#000' },
                { type: 'single', name: 'white', bgcolor: '#fff' },
                { type: 'single', name: '1', bgcolor: '#6495ed' },
                { type: 'single', name: '2', bgcolor: '#DB5800' },
                { type: 'single', name: '3', bgcolor: '#8EA107' },
                { type: 'single', name: '4', bgcolor: '#8C644C' },
                { type: 'single', name: '5', bgcolor: '#FAFAC0' },
                { type: 'single', name: '6', bgcolor: '#293033' },
                { type: 'single', name: '7', bgcolor: '#703427' },
                { type: 'single', name: '8', bgcolor: '#FFCA9D' },
                { type: 'single', name: '9', bgcolor: '#D4607E' },
                { type: 'single', name: '10', bgcolor: '#91B6B8' },
                { type: 'single', name: '11', bgcolor: '#823731' },
                { type: 'single', name: '12', bgcolor: '#B7CBD9' },
                { type: 'small' },
                { type: 'small', name: '1' },
                { type: 'middle' },
                { type: 'middle', name: '1' },
                { type: 'middle', name: '2' },
                { type: 'middle', name: '3' },
                { type: 'middle', name: '4' },
                { type: 'middle', name: '5' },
                { type: 'middle', name: '6' },
                { type: 'middle', name: '7' },
                { type: 'middle', name: '8' },
                { type: 'middle', name: '9' },
                { type: 'middle', name: '10' },
                { type: 'middle', name: '11' },
                { type: 'middle', name: '12' },
//                { type: 'middle', name:'13' },
                { type: 'middle', name: '14' },
                { type: 'middle', name: '15' },
                { type: 'middle', name: '16' },
                { type: 'middle', name: '17' },
                { type: 'middle', name: '18' },
                { type: 'middle', name: '19' },
//                { type: 'middle', name:'20' },
                { type: 'middle', name: '21' },
                { type: 'middle', name: '22' },
                { type: 'middle', name: '23' },
                { type: 'middle', name: '24' },
                { type: 'middle', name: '25' },
                { type: 'middle', name: '26' },
                { type: 'middle', name: '27' },
                { type: 'middle', name: '28' },
                { type: 'middle', name: '29' },
                { type: 'middle', name: '30' },
                { type: 'middle', name: '31' },
                { type: 'big', name: '1' },
                { type: 'big', name: 'default' }
            ]);
        }
    });

    Lego.Views.backgrounderView = Backbone.View.extend({
        model: Lego.Models.backgrounder,
        className: 'util-bg',
        template: _.template($('#util-backgrounder-template').html()),

        events: {},

        initialize: function () {
        },

        render: function (model) {
            var model = model || new this.model,
                type = model.get('type'),
                name = model.get('name'),
                el = $(this.el),
                classNamePrefix = 'util-bg-';

            el.toggleClass(classNamePrefix + model.get('type'), type);
            el.toggleClass(classNamePrefix + model.get('type') + '-' + model.get('name'), name);

            if (type == 'single') {
                model.set('path', null)
            }

            return $(this.el).append(this.template(model.attributes));
        }
    });

})(window.jQuery, document, Lego);
