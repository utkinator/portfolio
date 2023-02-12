;
(function ($, document, Lego) {
    'use strict';

    /* app menu MVC
     ========================================================================== */
    Lego.Models.menu = Backbone.Model.extend({
        defaults: {
            isOpened: NO
        }
    });

    Lego.Views.menu = Backbone.View.extend({
        model: new Lego.Models.menu,
        tagName: 'aside',
        className: 'menu',
        ruler: null,
        visibilityClassName: 'opened',
        template: _.template($('#menu-template').html()),

        events: {
            'click .menu-toggle': 'toggleMenuVisibility',
            'click #new_note': 'newNote',
            'click #load_notes': 'loadNotes',
            'click #save_deskboard': 'saveDeskboard',
            'click #load_deskboard': 'loadDeskboard',
            'click #clear_deskboard': 'clearDeskboard',
            'click #clear_saved_deskboard': 'clearSavedDeskboard',
            'click #ruler': 'toggleRuler',
            'click #toggle_view': 'toggleDeskboardView',
            'click #toggle_ui_controls': 'toggleUIControls',
            'click #get_code': 'getCode',
            'click #get_set_deskboard_code': 'getSetDeskboardDode',
            'click #save_preset': 'savePreset'
        },

        initialize: function () {
            var el = $(this.el),
                model = this.model;

            model
                .on('change:isOpened', function (model, isOpened) {
                    var arrow = $('.menu-toggle', el);

                    isOpened ? arrow.text('◄') : arrow.text('►');
                    el.toggleClass(this.visibilityClassName, isOpened);
                }.bind(this));

            this.template = el.append(this.template);
            this.model.set('isOpened', YES);

            this.render();
        },

        render: function () {
            this.template.insertBefore($(Lego.Wrapper));
        },

        toggleMenuVisibility: function () {
            var state = this.model.get('isOpened');

            this.model.set('isOpened', !state);
        },

        newNote: function () {
            new Lego.Views.note;

            return NO;
        },

        loadNotes: function () {
            App.notes.fetch({
                success: function (resp) {
                    _.each(resp.models, function (note) {
                        new Lego.Views.note(note);
                    });
                },
                error: function (notes, message) {
                    new Lego.Views.Error({
                        message: message
                    });
                }
            });

            return false;
        },

        saveDeskboard: function () {
            var saveBtn = $('#save_deskboard'),
                collection = App.deskboard.collection,
                elems = App.deskboard.collection.models;

            // save all elems to localStorage
            _.each(elems, function (elem) {
                elem.save('isSaved', YES, {
                    success: function () {
                    },
                    error: function () {
                        saveBtn.removeClass('changed');
                    }
                });
            });

            // ищем все модели, помеченные на удаление и удаляем их
            var toDelete = collection.where({toDelete: YES});

            collection.remove(toDelete);

            _.each(toDelete, function (model) {
                App.deskboard.collection.localStorage.destroy(model);
            });
        },

        loadDeskboard: function (params) {
            var params = params || {},
                deskboard = App.deskboard,
                deskboardElems = deskboard.collection.localStorage.findAll();

            if (!$.isEmptyObject(deskboardElems)) {
                deskboard.collection.reset();
                deskboard.collection.add(deskboardElems);
            } else {
                if (!params.silent) {
                    new Lego.Views.Error({
                        message: 'Nothing to load'
                    });
                }
            }
        },

        clearDeskboard: function () {
            $(Lego.Deskboard).empty();
        },

        clearSavedDeskboard: function () {
            var elems = App.deskboard.collection.localStorage.findAll();

            _.each(elems, function (elem) {
                App.deskboard.collection.localStorage.destroy(elem);
            });
        },

        getSetDeskboardDode: function () {
            App.deskboard.initPopup();

            return NO;
        },

        savePreset: function () {
            var self = this,
                deskboardCode = null;

            this.saveDeskboard();
            deskboardCode = JSON.stringify(App.deskboard.collection.localStorage.findAll());

            if (deskboardCode.length > 2) {
                this.toggleDeskboardView();
                this.toggleUIControls();

                html2canvas($(Lego.Deskboard), {
                    onrendered: function (canvas) {
                        App.ui_items.presets_collection.add({
                            code: deskboardCode,
                            canvas: canvas.toDataURL()
                        });

                        self.toggleDeskboardView();
                        self.toggleUIControls();
                    }
                });

                // open "Presets" in sidebar
                $('[data-ui_type="preset"]').trigger('click');
            } else {
                new Lego.Views.Error({
                    message: 'No code detected'
                });
            }
        },

        toggleRuler: function () {
            if (!this.ruler) {
                this.ruler = new Lego.Views.ruler;
            } else {
                this.ruler.remove();
                this.ruler = null;
            }
            $('#ruler').toggleClass('active');
        },

        toggleDeskboardView: function () {
            var isTransparent = App.deskboard.model.get('isTransparent');

            App.deskboard.model.set('isTransparent', !isTransparent);
            $('#toggle_view').toggleClass('active', !isTransparent);

            return NO;
        },

        toggleUIControls: function () {
            var showUIControls = App.deskboard.model.get('showUIControls');

            App.deskboard.model.set('showUIControls', !showUIControls);
            $('#toggle_ui_controls').toggleClass('active', !showUIControls);

            return NO;
        },

        getCode: function () {
            new Lego.Views.getcoderView;

            return NO;
        }
    });
})(window.jQuery, document, Lego);
