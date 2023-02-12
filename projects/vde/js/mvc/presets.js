Lego.Models.preset = Backbone.Model.extend({
    defaults: {
        ui_type: 'preset',
        code: null
    }
});

Lego.Views.presetView = Backbone.View.extend({
    model: Lego.Models.preset,
    className: 'preset',
    template: _.template($('#preset-template').html()),

    initialize: function () {
        this.model = new this.model;
    },
    render: function (model) {
        var el = $(this.el),
            canvas = model.get('canvas'),
            elem = $('<div/>');

        elem.css({'background-image': 'url(' + canvas + ')'});

        return el.append(elem);
    }
});

Lego.Collections.presets = Backbone.Collection.extend({
    model: Lego.Models.preset,
    localStorage: new Store('presets'),

    initialize: function () {
        this
            .on('add', function (model) {
                model.save();
            });
    },

    fetch: function () {
        var savedPresets = this.localStorage.findAll();

        if (savedPresets.length) {
            this.reset(savedPresets);
        } else {
            App.ui_items.nothingToLoad();
        }
    }
});