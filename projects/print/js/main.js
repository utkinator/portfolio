(function(ko) {

    'use strict';

    Array.prototype.chunk = function(chunkSize) {
        var array=this;
        return [].concat.apply([],
            array.map(function(elem,i) {
                return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
            })
        );
    };

    var chunkData = function(params) {
        var deferred = $.Deferred(),
            chunkSize = params.chunkSize || 500,
            data = params.data,
            processFunction = params.processFunction,
            index = 0,
            len = data.length;

        (function doChunk() {
            var count = chunkSize;

            while(count-- && index < len) {
                processFunction(data, index, data[index]);
                ++index;
            }

            if (index < len) {
                setTimeout(doChunk, 1);
            } else if (index === len) {
                deferred.resolve(data);
            }
        })();

        return deferred.promise();
    };

    var app = {
        processing: ko.observable(false),
        sortOrder: ko.observable('order'), // alphabetical
        lang: ko.observable('en'), // sv, no, dn, en
        langs: ko.observableArray([
            { value: 'en', label: 'English' },
            { value: 'sv', label: 'Svenska' }
        ]),
        layoutView: ko.observable('layout-3'), // 'layout-5'
        libView: ko.observable('small'), // 'large', 'small', 'list'
        toggleImageSelection: function(image) {
            image.selected(!image.selected());
        },
        isAllSelected: ko.observable(false),
        toggleImagesSelection: function() {
            this.isAllSelected(!this.isAllSelected());
            this.fetchImagesLib(this.isAllSelected());
        },
        deselectImages: function() {
            ko.utils.arrayMap(this.imagesLib(), $.proxy(function(image) {
                image.selected(false);
            }, this));
        },
        fetchImagesLib: function(selected) {
            var fetchedImages = ko.utils.arrayMap(this.lib()[app.lang()], function(image, index) {
                return {
                    sortOrder: ko.observable(index), // or ko.observable(image.sortOrder),
                    name: ko.observable(image.name),
                    file: ko.observable(image.file),
                    selected: ko.observable(selected)
                };
            });

            app.isAllSelected(selected);
            this.imagesLib(fetchedImages);
        },
        lib: ko.observableArray(),
        imagesLib: ko.observableArray([]),
        printImagesLabel: ko.observable(true),
        getMaxImagesPerPage: function() {
            var maxImagesPerPage3 = 54,
                maxImagesPerPage5 = 20;

            return app.layoutView() === 'layout-3' ? maxImagesPerPage3 : maxImagesPerPage5;
        }
    };

    app.imagesToPrint = ko.computed(function() {
        var arr = app.imagesLib().slice();

        arr.sort(app.sortOrder() === 'order' ?
                    app.sortByOrder :
                    app.sortByAlphabet);

        return ko.utils.arrayFilter(arr, function(item) {
            return item.selected();
        });
    });

    app.neededPagesLength = ko.computed(function() {
        return Math.ceil(app.imagesToPrint().length / app.getMaxImagesPerPage());
    });

    app.pages = ko.observableArray();
    app.imagePlaceholderLength = ko.observable();
    app.trigger = ko.observable(1);

    app.clearPages = function() {
        app.pages([]);

        return this;
    };
    app.addEmptyPage = function() {
        app.pages.push(new Array(app.getMaxImagesPerPage()));
        app.imagePlaceholderLength(app.getMaxImagesPerPage());

        return this;
    };
    app.clearAndAddPage = function() {
        app
          .clearPages()
          .addEmptyPage();
    };
    app.removePage = function(page, e) {
        var layout = $(e.currentTarget).closest('.layout'),
            layoutIndex = layout.index();

        if (app.imagePlaceholderLength() === app.getMaxImagesPerPage()) {
            app.trigger(Math.random());
            return;
        }

        app.processing(true);

        chunkData({
            data: app.pages()[layoutIndex],
            chunkSize: 10,
            processFunction: function(data, index, image) {
                image && image.selected(false);
            }
        }).done(function() {
            app.processing(false);
        });
    };
    app.imagesToRender = ko.computed(function() {
        var selectedImages = app.imagesToPrint(),
            itemsPerPage = app.getMaxImagesPerPage(),
            neededPages = app.neededPagesLength(),
            trigger = app.trigger();

        if (!selectedImages.length) {
            app.clearAndAddPage();
            return;
        }

        // TODO: optimize this!
        var arr = new Array(neededPages * itemsPerPage),
            filledArr = selectedImages.concat(arr).slice(0, neededPages * itemsPerPage);

        app.imagePlaceholderLength(ko.utils.arrayFilter(filledArr, function(item) {
            return item === undefined;
        }).length);

        app.pages(filledArr.chunk(itemsPerPage).slice(0, neededPages));
    });
    app.isNewPageNeeded = ko.computed(function() {
        return app.imagePlaceholderLength() === 0;
    });

    app.sortByOrder = function(a, b) {
        if (a.sortOrder() < b.sortOrder()) return -1;
        if (a.sortOrder() > b.sortOrder()) return 1;
        return 0;
    };

    app.sortByAlphabet = function(a, b) {
        if (a.name().toLowerCase() < b.name().toLowerCase()) return -1;
        if (a.name().toLowerCase() > b.name().toLowerCase()) return 1;
        return 0;
    };

    app.sortedImagesLib = ko.computed(function() {
        var clonedImages = app.imagesLib().slice();

        if (!clonedImages.length) {
            return;
        }

        return clonedImages.sort(
                app.sortOrder() === 'order' ?
                app.sortByOrder :
                app.sortByAlphabet
        );
    });

    app.toggleSorting = function() {
        if (app.sortOrder() === 'order') {
            app.sortOrder('alphabetical');
        } else {
            app.sortOrder('order')
        }
    };

    ko.applyBindings(app);

    app.processing(true);

    function format(state) {
        return "<img class='flag' src='img/flags/" + state.id.toLowerCase() + ".png'/>" + state.text;
    }

    $('#lang').select2({
        formatResult: format,
        formatSelection: format,
        minimumResultsForSearch: -1,
        escapeMarkup: function(m) { return m; }
    }).change(function() {
        app.fetchImagesLib(false);
    });

    $.getJSON("./js/library.json", function(data) {
        app.lib(data);
        app.fetchImagesLib(false);
        app.processing(false);
    });

    $.event.props.push('dataTransfer');

    $(document)
        .on('dragover', 'section', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(this).addClass('dragover');
        })
        .on('dragleave', 'section', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(this).removeClass('dragover');
        })
        .on('dragstart', 'aside .image-container', function(e) {
            e.dataTransfer.setData("text", JSON.stringify({
                index: $(e.currentTarget).index(),
                name: $(e.currentTarget).find('p').text()
            }));
        })
        .on('dragstart', '.layout .image-container img', function() {
            return false;
        })
        .on('drop', 'section', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var data = JSON.parse(e.dataTransfer.getData("text")),
                libImage = ko.utils.arrayFilter(app.imagesLib(), function(item) {
                    return item.name() === data.name;
                })[0];

            libImage.selected(true);

            $(this).removeClass('dragover');
        });
})(window.ko);