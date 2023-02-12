;
(function ($, document, Lego) {
    'use strict';

    /* UI Items List Builder
     ========================================================================== */
    Lego.Views.uiItemsList = Backbone.View.extend({
        tagName: 'ul',
        className: 'elems-list',
        ui_grid_form: null,

        events: {},

        initialize: function () {
            var self = this;

            // layouts init
            this.layout_collection = new Lego.Collections.ui_layout;
            this.layout_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // grids init
            this.grid_collection = new Lego.Collections.ui_grid;
            this.grid_collection
                .on('add', function () {
                    this.render(this.grid_collection.models);
                }.bind(this))
                .bind('reset', function (collection) {
                    this.render(collection.models);
                }.bind(this));

            // basics init
            this.basics_collection = new Lego.Collections.ui_basic;
            this.basics_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // buttons init
            this.buttons_collection = new Lego.Collections.ui_button;
            this.buttons_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // messages init
            this.messages_collection = new Lego.Collections.ui_message;
            this.messages_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // tables init
            this.tables_collection = new Lego.Collections.ui_table;
            this.tables_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // popups init
            this.popups_collection = new Lego.Collections.ui_popup;
            this.popups_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // tabs init
            this.tabs_collection = new Lego.Collections.ui_tab;
            this.tabs_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // paginations init
            this.paginations_collection = new Lego.Collections.ui_pagination;
            this.paginations_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // breadcrumbs init
            this.breadcrumbs_collection = new Lego.Collections.ui_breadcrumbs;
            this.breadcrumbs_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // navs init
            this.navs_collection = new Lego.Collections.ui_nav;
            this.navs_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // placeholders init
            this.placeholders_collection = new Lego.Collections.ui_placeholder;
            this.placeholders_collection
                .on('add', function () {
                    this.render(this.placeholders_collection.models);
                }.bind(this))
                .bind('reset', function (collection) {
                    this.render(collection.models);
                }.bind(this));

            // tags init
            this.tags_collection = new Lego.Collections.ui_tags;
            this.tags_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // tooltips init
            this.tooltips_collection = new Lego.Collections.ui_tooltip;
            this.tooltips_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // tooltips init
            this.ratings_collection = new Lego.Collections.ui_rating;
            this.ratings_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // utils init
            this.utils_collection = new Lego.Collections.util;
            this.utils_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // backgrounds init
            this.backgrounds_collection = new Lego.Collections.backgrounders;
            this.backgrounds_collection.bind('reset', function (collection) {
                this.render(collection.models);
            }.bind(this));

            // presets init
            this.presets_collection = new Lego.Collections.presets;
            this.presets_collection
                .bind('reset', function (collection) {
                    this.render(collection.models);
                }.bind(this))
                .bind('add', function (model) {
                    this.render(this.presets_collection.models);
                }.bind(this));
        },

        render: function (elems) {
            var self = this,
                renderedElem = null,
                deskboard_elems = null;

            $(Lego.SidebarContent)
                .empty()
                .append($(this.el).empty());

            _.each(elems, function (elem) {
                var ui_type = elem.get('ui_type');

                switch (ui_type) {
                    case 'layout':
                        var ui_layout = new Lego.Views.ui_layout(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_layout.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    ui_layout.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_layout.currentModel);

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_layout.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'grid':
                        var ui_grid = new Lego.Views.ui_grid(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_grid.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    ui_grid.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_grid.currentModel);

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_grid.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'basic':
                        var ui_basic = new Lego.Views.ui_basicView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_basic.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block elems-list-item-nostyles" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    ui_basic.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_basic.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_basic.currentModel.parentContainerId = elem.id;
                            });

                        break;

                    case 'button':
                        var ui_btn = new Lego.Views.ui_buttonView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_btn.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    ui_btn.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_btn.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_btn.currentModel.parentContainerId = elem.id;
                            });

                        break;

                    case 'button-group':
                        var ui_btn_group = new Lego.Views.ui_button_groupView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_btn_group.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    ui_btn_group.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_btn_group.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_btn_group.currentModel.parentContainerId = elem.id;
                            });

                        break;

                    case 'button-dropdown':
                        var ui_btn_dropdown = new Lego.Views.ui_button_dropdownView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_btn_dropdown.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    ui_btn_dropdown.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_btn_dropdown.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_btn_dropdown.currentModel.parentContainerId = elem.id;
                            });

                        $('[data-toggle="dropdown"]').dropdown();

                        break;

                    case 'message':
                        var ui_message = new Lego.Views.ui_messageView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_message.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_message.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_message.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_message.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'table':
                        var ui_table = new Lego.Views.ui_tableView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_table.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_table.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_table.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_table.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'popup':
                        var ui_popup = new Lego.Views.ui_popupView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_popup.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_popup.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_popup.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_popup.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'tab':
                        var ui_tab = new Lego.Views.ui_tabView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_tab.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_tab.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_tab.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_tab.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'accordion':
                        var ui_accordion = new Lego.Views.ui_accordionView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_accordion.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_accordion.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_accordion.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_accordion.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'pagination':
                        var ui_pagination = new Lego.Views.ui_paginationView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_pagination.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_pagination.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_pagination.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_pagination.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'breadcrumbs':
                        var ui_breadcrumbs = new Lego.Views.ui_breadcrumbsView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_breadcrumbs.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_breadcrumbs.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_breadcrumbs.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_breadcrumbs.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'nav':
                        var ui_nav = new Lego.Views.ui_navView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_nav.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_nav.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_nav.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_nav.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'placeholder':
                        var ui_placeholder = new Lego.Views.ui_placeholderView(
                            {tagName: elem.get('tag')}
                        );

                        !elem.get('styles') && elem.set('styles', {
                            'width': 100 + 'px',
                            'height': 100 + 'px',
                            'line-height': 100 + 'px'
                        });

                        renderedElem = ui_placeholder.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_placeholder.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_placeholder.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_placeholder.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'tags':
                        var ui_tags = new Lego.Views.ui_tagsView();

                        renderedElem = ui_tags.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_tags.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_tags.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_tags.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'tooltip':
                        var ui_tooltip = new Lego.Views.ui_tooltipView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_tooltip.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_tooltip.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_tooltip.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_tooltip.currentModel.parentContainerId = elem.id;
                            });

                        $('.ui-tooltip-tipsy').tipsy({
                            gravity: renderedElem.attr('data-gravity') || 'n',
                            title: function () {
                                return $(this).find('.ui-tooltip-content').hide().html();
                            },
                            offset: 8
                        });

                        break;


                    case 'rating':
                        var ui_rating = new Lego.Views.ui_ratingView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = ui_rating.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    ui_rating.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(ui_rating.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                ui_rating.currentModel.parentContainerId = elem.id;
                            });

                        break;

                    case 'util':
                        var util = new Lego.Views.utilView(
                            {tagName: elem.get('tag')}
                        );

                        renderedElem = util.render(elem.attributes);
                        deskboard_elems = App.deskboard.collection;

                        $(self.el)
                            .append($('<li class="elems-list-item elems-list-item-block" />')
                                .append(renderedElem));

                        // add events for rendered elem in sidebar
                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function (event, ui) {
                                    util.currentModel.id = Lego.Utils.getGUID();

                                    deskboard_elems.add(util.currentModel);

                                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                util.currentModel.parentContainerId = elem.id;
                            });
                        break;

                    case 'background':
                        var bgView = new Lego.Views.backgrounderView,
                            elemIdToSetBg = null,
                            overedElemModel = null;

                        renderedElem = bgView.render(elem);

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        renderedElem
                            .draggable({
                                stop: function (event, ui) {
                                    if (elemIdToSetBg) {
                                        var origStyles = overedElemModel.get('styles') || {},
                                            imgUrl, newStyle = null;

                                        if (elem.get('path')) {
                                            imgUrl = 'url(' + elem.get('path') + elem.get('type') + '/' + elem.get('name') + '.gif)';
                                            newStyle = {
                                                'background-image': imgUrl
                                            };
                                        } else {
                                            newStyle = {
                                                'background-color': elem.get('bgcolor')
                                            };
                                        }

                                        $.extend(origStyles, newStyle);

                                        overedElemModel.set('styles', origStyles);
                                        overedElemModel.trigger('change:styles', overedElemModel, origStyles);
                                    }

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            })
                            .on('uiOveredIn', function (e, elem) {
                                var el = $(elem),
                                    overedElemId = el.attr('id') || $(Lego.Deskboard).attr('id');

                                if ($(elem).is('[class*="grid-"]')) {
                                    overedElemId = $(elem).parent('.ui-grid-row').attr('id');
                                }

                                if ($(elem).is('[class*="ui-layout-"]') || $(elem).is('[class*="col-"]')) {
                                    overedElemId = $(elem).closest('.ui-layout').attr('id');
                                }

                                if ($(elem).is('td') || $(elem).is('th')) {
                                    overedElemId = $(elem).closest('.ui-table').attr('id');
                                }

                                if ($(elem).is('[class*="tab-pane"]')) {
                                    overedElemId = $(elem).closest('.ui-tab').attr('id');
                                }

                                if ($(elem).is('[class*="ui-accordion-inner"]')) {
                                    overedElemId = $(elem).closest('.ui-accordion').attr('id');
                                }

                                if ($(elem).is('[class*="ui-popup-"]')) {
                                    overedElemId = $(elem).closest('.ui-popup').attr('id');
                                }

                                overedElemModel = App.deskboard.collection.get(overedElemId);
                                elemIdToSetBg = overedElemModel ? overedElemId : null;
                            });
                        break;

                    case 'preset':
                        var presetView = new Lego.Views.presetView;

                        renderedElem = presetView.render(elem);

                        $(self.el)
                            .append($('<li class="elems-list-item" />')
                                .append(renderedElem));

                        renderedElem
                            .draggable({
                                containment: Lego.Deskboard,
                                stop: function () {
                                    var models = jQuery.parseJSON(elem.get('code'));

                                    App.deskboard.collection.reset(models);
                                    App.menu.clearSavedDeskboard();
                                    App.menu.saveDeskboard();
                                    App.menu.loadDeskboard();

                                    $(this).animate({
                                        left: 0,
                                        top: 0
                                    }, 500);
                                }
                            });

                        break;

                    default:
                        return NO;
                }
            });
            Lego.Utils.disableLoader($(Lego.SidebarContent));
        },

        loadContent: function (type) {
            var self = this;

            this.ui_grid_form && this.ui_grid_form.remove();

            switch (type) {
                case 'layout':
                    // fetch layouts
                    this.layout_collection.fetch();
                    break;

                case 'grid':
                    // fetch layouts
                    this.grid_collection.fetch();

                    var add_ui_grid_form = Backbone.View.extend({
                        className: 'add-ui-grid',
                        template: _.template($('#ui-add-grid-template').html()),

                        events: {
                            'submit #add-grid-form': 'submitForm',
                            'change #grid-is-collapsed': 'submitForm',
                            'keyup #grid-layout': 'calcQty'
                        },

                        initialize: function () {
                            this.template = $(this.el).append(this.template);

                            this.render();
                        },
                        render: function () {
                            this.template.insertBefore($('.sidebar .sidebar-content'));
                        },
                        submitForm: function () {
                            var form = $('#add-grid-form'),
                                inputs = $('input', form),
                                data = form.serializeArray();

                            var qty = this.calcQty();

                            if (qty != 0) {
                                new Lego.Views.Error({
                                    message: 'Summ of grids should be 12'
                                });
                            } else {
                                // создаем новый грид и добавляем его в коллекцию гридов
                                var grid = new Lego.Views.ui_grid(),
                                    model = grid.model,
                                    newLayout = data[0].value.match(/[0-9]/g),
                                    modelData = {};

                                modelData = {
                                    items_layout: newLayout,
                                    items: newLayout.length,
                                    type: 12 / newLayout.length
                                };
                                if (data[1]) {
                                    modelData.grid_type = data[1].value;
                                }
                                model.set(modelData);
                                self.grid_collection.add(model);
                            }

                            return NO;
                        },
                        calcQty: function () {
                            var max = 12,
                                summ = 0,
                                left = max - summ,
                                leftContainer = $('#grid-layout-qty'),
                                layout = $('#grid-layout').val();

                            var cleanedArray = layout.match(/[0-9]/g);

                            _.each(cleanedArray, function (num) {
                                num = num - 0;
                                summ += num;
                            });

                            left = max - summ;
                            leftContainer.text(left);

                            return left;
                        },
                        remove: function () {
                            $(this.el).remove();
                        }
                    });
                    this.ui_grid_form = new add_ui_grid_form;

                    break;

                case 'basic':
                    // fetch basics
                    this.basics_collection.fetch();
                    break;

                case 'button':
                    // fetch buttons
                    this.buttons_collection.fetch();
                    break;

                case 'message':
                    // fetch messages
                    this.messages_collection.fetch();
                    break;

                case 'table':
                    // fetch tables
                    this.tables_collection.fetch();
                    break;

                case 'popup':
                    // fetch popups
                    this.popups_collection.fetch();
                    break;

                case 'tab':
                    // fetch tabs
                    this.tabs_collection.fetch();
                    break;

                case 'pagination':
                    // fetch pagination
                    this.paginations_collection.fetch();
                    break;

                case 'breadcrumbs':
                    // fetch breadcrumbs
                    this.breadcrumbs_collection.fetch();
                    break;

                case 'nav':
                    // fetch navs
                    this.navs_collection.fetch();
                    break;

                case 'placeholder':
                    Lego.Utils.enableLoader($(Lego.SidebarContent));

                    // fetch placeholders
                    this.placeholders_collection.fetch();
                    break;

                case 'tags':
                    // fetch tags
                    this.tags_collection.fetch();
                    break;

                case 'tooltip':
                    // fetch tooltips
                    this.tooltips_collection.fetch();
                    break;

                case 'rating':
                    // fetch tooltips
                    this.ratings_collection.fetch();
                    break;

                case 'util':
                    // fetch utils
                    this.utils_collection.fetch();
                    break;

                case 'background':
                    // fetch backgrounds
                    this.backgrounds_collection.fetch();
                    break;

                case 'preset':
                    var self = this;

                    var deletePresets = Backbone.View.extend({
                        className: 'presets-controls-wrapper',
                        events: {
                            'click #delete_presets': function () {
                                _.each(self.presets_collection.models, function (model) {
                                    self.presets_collection.localStorage.destroy(model);
                                });
                                self.presets_collection.reset().fetch();
                            }
                        },

                        initialize: function () {
                            this.render();
                        },

                        render: function () {
                            var btn = $('<button id="delete_presets">Delete presets</button>');

                            this.remove();

                            $(Lego.SidebarContent)
                                .prepend($(this.el).append(btn));
                        },

                        remove: function () {
                            $('.presets-controls-wrapper').remove();
                        }
                    });

                    this.presets_collection
                        .on('reset', function () {
                            new deletePresets;
                        })
                        .on('add', function () {
                            new deletePresets;
                        });

                    // fetch backgrounds
                    this.presets_collection.fetch();

                    break;

                default:
                    this.nothingToLoad();
                    break;
            }
        },

        nothingToLoad: function () {
            var sidebar = $(Lego.SidebarContent);

            sidebar.html('<p class="no-content">Choose UI element</p>');
            Lego.Utils.disableLoader(sidebar);

            new Lego.Views.Error({
                message: 'Nothing to load',
                callback: function () {
                    console.log('some your callback');
                }
            });
        }
    });
})(window.jQuery, document, Lego);
