;
(function ($, document, Lego) {
    'use strict';

    /* Notes
     ========================================================================== */
    Lego.Models.note = Backbone.Model.extend({
        defaults: {
            id: null,
            title: 'New note',
            content: 'Click to edit',
            date: null,
            time: null,
            num: null,
            qty: null,
            coords: {
                left: 0,
                top: 0
            },
            isPined: NO,
            wasMoved: NO,
            isNew: YES
        },

        getCoords: function () {
            var coordinates = this.get('coords'),
                startX = coordinates.left || 50,
                startY = coordinates.top || 150,
                offsetX = 5,
                offsetY = 30,
                num = this.get('num'),
                coords = {
                    left: startX + offsetX * num,
                    top: startY + offsetY * num
                };

            if (this.get('wasMoved')) {
                coords = {
                    left: startX,
                    top: startY
                }
            }

            return coords;
        }
    });

    Lego.Collections.note = Backbone.Collection.extend({
        model: Lego.Models.note,
        localStorage: new Store("notes"),

        getNoteIndex: function (model) {
            return _.indexOf(this.models, this.getByCid(model.cid));
        },

        removeNote: function (model) {
            this.remove(this.getByCid(model.cid));
        }
    });

    Lego.Views.note = Backbone.View.extend({
        model: Lego.Models.note,
        className: 'note',
        template: _.template($('#note-template').html()),
        editableElem: null,

        events: {
            'click .close': 'closeNote',
            'blur .note-content, .note-title > strong': 'saveNote',
            'click .pin': 'pinNote'
        },

        initialize: function (note) {
            var self = this,
                el = $(this.el),
                id = Lego.Utils.getGUID(),
                date = Lego.Utils.getDate(NO, 'dd.mm.HH', NO),
                time = Lego.Utils.getDate(NO, 'H:M', NO),
                notes = App.notes;

            this.model = note || new this.model;

            this.model
                .on('change:qty', function (model) {
                    model.set({
                        num: App.notes.getNoteIndex(model) + 1
                    });
                    this.render(model);
                }.bind(this))
                .on('change:isPined', function (model, isPined) {
                    if (!isPined) {
                        el.removeClass('pined');
                        el.draggable('enable');
                    } else {
                        el.addClass('pined');
                        el.draggable('disable');
                    }
                }.bind(this));

            notes
                .on('add', function () {
                    self.model.set({qty: this.length});
                })
                .on('remove', function () {
                    !!notes.length && self.model.set({qty: this.length});
                });

            this.model.set({
                id: id,
                date: date,
                time: time
            });

            this.model.get('isNew') ? notes.add(this.model) : this.render(this.model);
        },

        render: function (model) {
            var el = $(this.el),
                note = el.empty().append(this.template(model.attributes));

            $('body').append(note);

            var coords = this.model.getCoords();
            el.css({
                left: coords.left,
                top: coords.top
            });

            note.draggable({
                handle: '.note-title',
                stop: function () {
                    var newCoords = {
                        left: note.offset().left,
                        top: note.offset().top
                    };

                    this.model.set({
                        coords: newCoords,
                        wasMoved: YES
                    });

                    if (!this.model.get('isNew')) {
                        this.model.save();
                    }
                }.bind(this)
            });
        },

        closeNote: function () {
            var self = this;

            $(this.el).fadeOut('fast', function () {
                $(this).remove();

                App.notes.removeNote(self.model);
            })
        },

        saveNote: function () {
            var note = this.model,
                el = $(this.el),
                title = $('.note-title > strong', el).html(),
                content = $('.note-content', el).html();

            note.save({
                title: title,
                content: content,
                isNew: NO
            });
        },

        pinNote: function () {
            var model = this.model,
                state = model.get('isPined');

            model.set('isPined', !state);
        }
    });
})(window.jQuery, document, Lego);
