;
(function ($, document, Lego) {
    'use strict';

    /* deskboard
     ========================================================================== */
    Lego.Models.deskboard = Backbone.Model.extend({
        defaults: {
            isTransparent: NO,
            showUIControls: NO
        }
    });

    Lego.Collections.deskboard = Backbone.Collection.extend({
        initialize: function () {
        },
        localStorage: new Store("deskboard")
    });

    Lego.Views.deskboard = Backbone.View.extend({
        model: Lego.Models.deskboard,
        collection: new Lego.Collections.deskboard,
        initialize: function () {
            var self = this,
                saveDeskboardBtn = $('#save_deskboard');

            this.model = new this.model;
            this.model
                .on('change:isTransparent', function (model, isTransparent) {
                    $(Lego.Wrapper).toggleClass('transparent', isTransparent);
                })
                .on('change:showUIControls', function (model, showUIControls) {
                    $(Lego.Wrapper).toggleClass('transparent-ui-controls', showUIControls);
                });

            this.collection
                .on('change', function (model, changed) {
                    saveDeskboardBtn.addClass('changed');
                    if (model.hasChanged('isSaved') && model.get('isSaved')) {
                        saveDeskboardBtn.removeClass('changed');
                    }
                })
                .on('reset', function () {
                    $(Lego.Deskboard).empty();
                })
                .on('add', function (model) {
                    if (!model.get('parentContainerId')) {
                        new Lego.Views.Error({
                            message: 'Ooops :( <br/> No parent found. Please, try again.'
                        });
                        this.collection.remove(model);
                    } else {
                        this.calcOrderIndex(model);
                        this.sortCollection();
                        this.render(model);
                    }
                }.bind(this))
                .on('remove', function (model) {
                    model.set('toDelete', YES);
                }.bind(this));

            this.bindDroppable($(Lego.Deskboard), {});
        },

        render: function (elem) {
            var self = this,
                el = $(Lego.Deskboard),
                ui_type = elem.get('ui_type'),
                styler = null,
                parent = $('.ui-droppable-over').length && $('.ui-droppable-over') ||
                    $('#' + elem.get('parentContainerId')).length && $('#' + elem.get('parentContainerId')) ||
                    el,
                elem = this.extendUIElemModel(elem);

            switch (ui_type) {
                case 'layout':
                    var ui_layout = new Lego.Views.ui_layout({
                        tagName: elem.get('tag'),
                        id: elem.id || Lego.Utils.getGUID()
                    });

                    if (!elem.get('styles')) {
                        elem.set('styles', {
                            'background': 'rgba(206, 225, 245, .5)',
                            'outline': '1px solid #B6BAC0'
                        });
                    }

                    var layout = ui_layout.render(elem.attributes);

                    el.append(layout);

                    layout
                        .draggable({
                            containment: ".mili",
                            grid: [20, 20],
                            scroll: false,
                            stop: function (event, ui) {
                                var position = ui.position,
                                    styles = elem.get('styles');

                                $.extend(styles, {
                                    left: position.left + 'px',
                                    top: position.top + 'px'
                                });

                                elem.set('styles', styles);
                                elem.trigger('change:styles', elem, styles);
                            }
                        });

                    var childs = $('.ui-layout-header, .col-main, .ui-sidebar, .ui-layout-footer', layout);

                    this.bindDroppable(layout, {});
                    this.bindDroppable(childs, {});
                    this.bindSortable(childs, {model: elem});

                    styler = new Lego.Views.styler();
                    styler.render({target: layout, model: elem});

                    break;

                case 'grid':
                    var ui_grid = new Lego.Views.ui_grid(
                        { tagName: elem.get('tag') }
                    );

                    // ids for grid items
                    var model = elem.attributes,
                        items_ids = model.items_ids || [];

                    if (!items_ids.length) {
                        items_ids.length = 0;

                        for (var i = 0; i < model.items; i++) {
                            items_ids[i] = Lego.Utils.getGUID();
                        }
                        model.items_ids = items_ids;
                    }

                    if (!elem.get('styles')) {
                        $.extend(model, {
                            styles: {
                                'background': 'rgba(204, 204, 204, .5)',
                                'outline': '1px solid rgba(51, 51, 51, .3)'
                            }
                        });
                    }

                    var grid = ui_grid.render(model);

                    parent.append(grid);

                    var childs = $('[class*="grid"]', grid);

                    this.bindDroppable(childs, {});
                    this.bindDraggable(grid, {});
                    this.bindSortable(childs, {model: elem});

                    styler = new Lego.Views.styler();
                    styler.render({parent: grid, target: childs, model: elem});

                    break;

                case 'basic':
                    var ui_basic = new Lego.Views.ui_basicView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        basic = ui_basic.render(elem.attributes);

                    parent.append(basic);

                    this.bindDraggable(basic, {});
                    this.bindDroppable(basic, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: basic, model: elem});

                    break;

                case 'button':
                    var ui_btn = new Lego.Views.ui_buttonView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        btn = ui_btn.render(elem.attributes);

                    this.bindDroppable(btn, {accept: '.ui-tooltip'});
                    this.bindDraggable(btn, {});

                    parent.append(btn);

                    styler = new Lego.Views.styler();
                    styler.render({target: btn, model: elem});

                    break;

                case 'button-group':
                    var ui_btn_group = new Lego.Views.ui_button_groupView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        btn_group = ui_btn_group.render(elem.attributes);

                    this.bindDroppable(btn_group, {});
                    this.bindDraggable(btn_group, {});
                    this.bindResizable(btn_group, {});

                    parent.append(btn_group);

                    styler = new Lego.Views.styler();
                    styler.render({target: btn_group, model: elem});

                    break;

                case 'button-dropdown':
                    var ui_btn_dropdown = new Lego.Views.ui_button_dropdownView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        btn_dropdown = ui_btn_dropdown.render(elem.attributes);

                    parent.append(btn_dropdown);

                    this.bindDraggable(btn_dropdown, {});

                    $('[data-toggle="dropdown"]').dropdown();

                    styler = new Lego.Views.styler();
                    styler.render({target: btn_dropdown, model: elem});

                    break;

                case 'message':
                    var ui_message = new Lego.Views.ui_messageView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        message = ui_message.render(elem.attributes);

                    parent.append(message);

                    this.bindDroppable(message, {});
                    this.bindDraggable(message, {});
                    this.bindResizable(message, {});

                    var buttonSet = $('.buttons-set', message);

                    this.bindDroppable(buttonSet, {accept: '.ui-button'});

                    styler = new Lego.Views.styler();
                    styler.render({target: message, model: elem});

                    break;

                case 'table':
                    var ui_table = new Lego.Views.ui_tableView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        table = ui_table.render(elem.attributes);

                    parent.append(table);

                    this.bindDroppable($('th, td', table), {});
                    this.bindDraggable(table, {});
                    this.bindResizable(table, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: table, model: elem});

                    break;

                case 'popup':
                    var ui_popup = new Lego.Views.ui_popupView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        popup = ui_popup.render(elem.attributes);

                    parent.append(popup);

                    var childs = $('.ui-popup-header, .ui-popup-content, .ui-popup-footer', popup);

                    this.bindDroppable(childs, {});
                    this.bindDroppable($('.buttons-set', popup), {accept: '.ui-button'});
                    this.bindDraggable(popup, {});
                    this.bindResizable(popup, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: popup, model: elem});

                    break;

                case 'tab':
                    var ui_tab = new Lego.Views.ui_tabView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        tab = ui_tab.render(elem.attributes);

                    parent.append(tab);

                    this.bindDroppable($('.ui-tab-content .tab-pane', tab), {});
                    this.bindDraggable(tab, {});
                    this.bindResizable(tab, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: tab, model: elem});

                    break;

                case 'accordion':
                    var ui_accordion = new Lego.Views.ui_accordionView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        accordion = ui_accordion.render(elem.attributes);

                    parent.append(accordion);

                    this.bindDroppable($('.ui-accordion-inner', accordion), {});
                    this.bindDraggable(accordion, {});
                    this.bindResizable(accordion, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: accordion, model: elem});

                    break;

                case 'pagination':
                    var ui_pagination = new Lego.Views.ui_paginationView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        pagination = ui_pagination.render(elem.attributes);

                    parent.append(pagination);

                    this.bindDroppable(pagination, {accept: '.util-bg'});
                    this.bindDraggable(pagination, {});
                    this.bindResizable(pagination, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: pagination, model: elem});

                    break;

                case 'breadcrumbs':
                    var ui_breadcrumbs = new Lego.Views.ui_breadcrumbsView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        breadcrumbs = ui_breadcrumbs.render(elem.attributes);

                    parent.append(breadcrumbs);

                    this.bindDroppable(breadcrumbs, {accept: '.util-bg'});
                    this.bindDraggable(breadcrumbs, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: breadcrumbs, model: elem});

                    break;

                case 'nav':
                    var ui_nav = new Lego.Views.ui_navView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        nav = ui_nav.render(elem.attributes);

                    parent.append(nav);

                    this.bindDroppable(nav, {accept: '.util-bg'});
                    this.bindDraggable(nav, {});
                    this.bindResizable(nav, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: nav, model: elem});

                    break;

                case 'placeholder':
                    var ui_placeholder = new Lego.Views.ui_placeholderView(
                        {
                            tagName: elem.get('tag'),
                            id: elem.id || Lego.Utils.getGUID()
                        }
                    );

                    !elem.get('styles') && elem.set('styles', {
                        'width': elem.get('width') + 'px',
                        'height': elem.get('height') + 'px',
                        'line-height': elem.get('height') + 'px'
                    });

                    var placeholder = ui_placeholder.render(elem.attributes);
                    parent.append(placeholder);

                    elem
                        .off('change:styles')
                        .on('change:styles', function () {
                            ui_placeholder.remove();
                            self.render(elem);
                        });

                    this.bindDroppable(placeholder, {accept: '.util-bg'});
                    this.bindDraggable(placeholder, {});
                    this.bindResizable(placeholder, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: placeholder, model: elem});

                    break;

                case 'tags':
                    var ui_tags = new Lego.Views.ui_tagsView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        tags = ui_tags.render(elem.attributes);

                    parent.append(tags);

                    this.bindDroppable(tags, {accept: '.util-bg'});
                    this.bindDraggable(tags, {});
                    this.bindResizable(tags, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: tags, model: elem});

                    break;

                case 'tooltip':
                    var ui_tooltip = new Lego.Views.ui_tooltipView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        tooltip = ui_tooltip.render(elem.attributes);

                    parent.append(tooltip);

                    this.bindDraggable(tooltip, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: tooltip, model: elem});

                    $('.ui-tooltip-tipsy').tipsy({
                        gravity: tooltip.attr('data-gravity') || 'n',
                        title: function () {
                            return $(this).find('.ui-tooltip-content').hide().html();
                        },
                        offset: 8
                    });

                    break;

                case 'rating':
                    var ui_rating = new Lego.Views.ui_ratingView(
                            {
                                tagName: elem.get('tag'),
                                id: elem.id || Lego.Utils.getGUID()
                            }
                        ),
                        rating = ui_rating.render(elem.attributes);

                    parent.append(rating);

                    this.bindDroppable(rating, {accept: '.util-bg'});
                    this.bindDraggable(rating, {});

                    styler = new Lego.Views.styler();
                    styler.render({target: rating, model: elem});

                    break;

                case 'util':
                    var util = new Lego.Views.utilView(
                        {
                            tagName: elem.get('tag'),
                            id: elem.id || Lego.Utils.getGUID()
                        }
                    );

                    if (elem.get('type') == 'dummy') {
                        !elem.get('styles') && elem.set('styles', {
                            'padding-top': 20 + 'px',
                            'outline': '1px solid rgba(51, 51, 51, .3)'
                        });
                    }

                    var utilite = util.render(elem.attributes);

                    styler = new Lego.Views.styler();
                    styler.render({target: utilite, model: elem});

                    parent.append(utilite);

                    switch (elem.get('type')) {
                        case 'ruler':
                            utilite
                                .draggable()
                                .resizable();

                            break;

                        case 'dummy':
                            this.bindDroppable(utilite, {});
                            this.bindDraggable(utilite, {});
                            this.bindResizable(utilite, {});

                            break;

                        case 'lorem':
                            this.bindDroppable(utilite, {});
                            this.bindDraggable(utilite, {});
                            this.bindResizable(utilite, {});

                            break;

                        default:
                            return NO;
                    }

                    break;

                default:
                    return NO;
            }
        },

        bindDroppable: function (elems, params) {
            var params = params || {};

            elems.droppable({
                accept: params.accept,
                over: function (event, ui) {
                    $('.ui-droppable-over').removeClass('ui-droppable-over');

                    if (!$(this).hasClass('mili')) {
                        $(this).addClass('ui-droppable-over');
                    }
                    ui.draggable.trigger('uiOveredIn', $(this));

                },
                drag: function (event, ui) {
                    console.log('drag', ui);
                }
            });
        },

        bindSortable: function (elems, params) {
            var self = this,
                params = params || {},
                model = params.model || null;

            elems.sortable({
                placeholder: "ui-state-highlight",
                create: function (event, ui) {
                },
                stop: function (event, ui) {
                    self.reCalcOrderIndex(self.collection.get($(ui.item).attr('id')));
                    self.sortCollection();
                },
                change: function (event, ui) {
                    $('.ui-state-highlight', $(this)).height($(ui.item).outerHeight(YES));
                }
            });
        },

        bindDraggable: function (elems, params) {
            var self = this,
                params = params || {},
                model = null;

            elems
                .draggable({
                    start: function (event, ui) {
                        var elemId = $(ui.helper).attr('id');

                        model = self.collection.get(elemId);
                    },
                    stop: function (event, ui) {
                        $('.ui-droppable-over').removeClass('ui-droppable-over');
                        $(ui.helper).remove();

                        self.render(model);
                        self.reCalcOrderIndex(model);
                        self.sortCollection();

                        // рендерим детей
                        var renderChilds = function (model) {
                            // определяем возможные id текущего элемента
                            // для простых элементов - это id самого элемента,
                            // для сложных (гриды, табы) - это внутренние обертки
                            var elem = $('#' + model.get('id')),
                                elems = null,
                                ids = [];

                            switch (model.get('ui_type')) {
                                case 'grid':
                                    elems = $('[class*="grid-"]', elem);

                                    _.each(elems, function (el) {
                                        ids.push($(el).attr('id'));
                                    });

                                    break;

                                case 'table':
                                    elems = $('th, td', elem);

                                    _.each(elems, function (el) {
                                        ids.push($(el).attr('id'));
                                    });

                                    break;

                                case 'tab':
                                    elems = $('.ui-tab-content .tab-pane', elem);

                                    _.each(elems, function (el) {
                                        ids.push($(el).attr('id'));
                                    });

                                    break;

                                case 'accordion':
                                    elems = $('.ui-accordion-inner', elem);

                                    _.each(elems, function (el) {
                                        ids.push($(el).attr('id'));
                                    });

                                    break;

                                case 'message':
                                    var btnsSet = $('.buttons-set', elem);

                                    elems = btnsSet.length ? [elem, btnsSet] : elem;

                                    _.each(elems, function (el) {
                                        ids.push($(el).attr('id'));
                                    });

                                    break;

                                case 'popup':
                                    elems = $('.ui-popup-header, .ui-popup-content, .ui-popup-footer, .buttons-set', elem);

                                    _.each(elems, function (el) {
                                        ids.push($(el).attr('id'));
                                    });

                                    break;

                                default:
                                    ids.push(model.get('id'));

                                    break;
                            }

                            // ищем детей по каждому из возможных родителей
                            var childs = [];

                            _.each(ids, function (id) {
                                childs.push(self.collection.where({'parentContainerId': id}));
                            });

                            var foundedChilds = _.flatten(childs);

                            _.each(foundedChilds, function (child) {
                                self.render(child);

                                // повторяем для каждого найденного элемента, если он также является родителем
                                renderChilds(child);
                            });
                        };

                        renderChilds(model);
                    }
                })
                .on('uiOveredIn', function (e, elem) {
                    model && model.set('parentContainerId', elem.id);
                });
        },

        bindResizable: function (elems, params) {
            var self = this,
                params = params || {},
                model = null;

            var calc = function (ui) {
                var elem = $(ui.element),
                    size = ui.size,
                    model = self.collection.get(elem.attr('id')),
                    origStyles = model.get('styles') || {};

                $.extend(origStyles, {
                    width: size.width + 'px',
                    height: size.height + 'px'
                });

                if (model.get('ui_type') == 'placeholder') {
                    $.extend(origStyles, {
                        'line-height': size.height + 'px'
                    });
                }

                model.set('styles', origStyles);
                model.trigger('change:styles', elem, origStyles);
            };

            elems
                .resizable({
                    grid: [10, 10],
                    stop: function (event, ui) {
                        calc(ui);
                    }
                });
        },

        // extend basic ui model with common for deskboard attributes
        extendUIElemModel: function (model) {
            var params = {
                isClosable: YES,
                toDelete: NO,
                isSaved: NO,
                isStylable: YES
            };

            model.set(params, {silent: YES});

            return model;
        },

        calcOrderIndex: function (model) {
            var parentId = model.get('parentContainerId'),
                modelsWithSameParent = this.collection.where({'parentContainerId': parentId});

            var modelsWithSameParentButThis = _.map(modelsWithSameParent, function (elem) {
                if (elem.get('id') != model.get('id')) {
                    return elem;
                }
            });

            // ищем максимальный индекс
            if (modelsWithSameParentButThis) {
                var maxElem = _.max(modelsWithSameParentButThis, function (model) {
                    if (model) {
                        return model.get('orderIndex');
                    }
                });
            }
            if (maxElem) {
                var max = maxElem.get('orderIndex');
            }

            // если у модели еще нет индекса
            if (!model.get('orderIndex') && model.get('orderIndex') != 0) {
                model.set('orderIndex', max || max == 0 ? max + 1 : 0);
            }
        },

        reCalcOrderIndex: function (model) {
            var parentId = model.get('parentContainerId') || null,
                parent = $('#' + parentId),
                modelElem = $('> [class*="ui-"]', parent),
                collection = this.collection;

            _.each(modelElem, function (elem, index) {
                var id = $(elem).attr('id') || '',
                    modelInCollection = collection.get(id);

                modelInCollection && modelInCollection.set('orderIndex', index);
            });
        },

        sortCollection: function () {
            var collection = this.collection,
                models = collection.models,
                parentIds = [],
                newOrder = [];

            // Ищем все элементы без родителей
            var withoutParents = collection.where({'parentContainerId': null});
            newOrder.push(withoutParents);

            // собираем все 'parentContainerId'
            _.each(models, function (model) {
                parentIds.push(model.get('parentContainerId'));
            });

            // оставляем только уникальные
            var parentIdsUniq = _.uniq(parentIds);

            // пробегаемся по уникальным 'parentContainerId' и ищем модели с общим родителем
            var sameModels = [];
            _.each(parentIdsUniq, function (parentId) {
                sameModels = collection.where({'parentContainerId': parentId});

                // сортируем по индексу модели с одинаковым родителем
                var sortedModels = sameModels.sort(function (a, b) {
                    return a.get('orderIndex') > b.get('orderIndex');
                });

                newOrder.push(sortedModels);
            });

            // TODO:
            // тихонько обновляем коллекцию с новым порядком моделей,
            // т.к. родной comparator глюкавит, ну или я туплю
            collection.reset(_.flatten(newOrder), {silent: YES});
        },

        initPopup: function () {
            var self = this;

            var popupView = Backbone.View.extend({
                className: 'fade',
                template: _.template($('#deskboard-code-template').html()),

                events: {
                    'click .close': 'remove',
                    'click .ui-button-cancel': 'remove',
                    'click .ui-button-special': 'saveDeskboard',
                    'click .ui-tab-nav a': 'toggleBtnsSet'
                },

                initialize: function () {
                    var that = this;

                    $(window)
                        .on('keyup.closeDeskCode', function (e) {
                            var keyCode = e.keyCode;

                            switch (keyCode) {
                                case Lego.KeyCodes.ESC :
                                    that.remove();

                                    break;

                                default:
                                    return NO;
                            }
                        });

                    this.render();

                    if ($.isEmptyObject(self.collection.localStorage.findAll())) {
                        var setTab = $('[data-type="set"]', this.el);

                        setTab.trigger('click');
                        this.toggleBtnsSet({}, {elem: setTab});
                    }
                },
                toggleBtnsSet: function (e, params) {
                    var params = params || {},
                        elem = params.elem || $(e.currentTarget),
                        tabType = elem.attr('data-type'),
                        btnsSet = $('.buttons-set', this.el),
                        btnSave = $('<button class="ui-button ui-button-special">Save</button>');

                    if (tabType == 'set') {
                        btnsSet.append(btnSave);
                    } else {
                        $('.ui-button-special', btnsSet).remove();
                    }
                },
                saveDeskboard: function () {
                    var value = $('#new_desk_code').val();

                    if (value) {
                        var models = jQuery.parseJSON(value);

                        self.collection.reset(models);
                        App.menu.clearSavedDeskboard();
                        App.menu.saveDeskboard();
                        App.menu.loadDeskboard();

                        this.remove();
                    } else {
                        new Lego.Views.Error({
                            message: 'Please, insert new code to textarea'
                        });
                    }
                },
                render: function () {
                    $('body').append($(this.el).append(this.template({
                        desk_code: JSON.stringify(self.collection.localStorage.findAll())
                    })));
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

            new popupView();
        }
    });
})(window.jQuery, document, Lego);
