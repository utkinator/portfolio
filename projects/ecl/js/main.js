(function($) {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    var self = this;

    $.event.props.push('dataTransfer');

    this.selectedDevice = null;

    var isDeviceChanged = function() {
        setTimeout(function() {
            $('.btn-clean').prop('disabled', !$('.control-content img, .text-label', $('.device').not('.hidden')).length);
        }, 100);
    };

    var isControlChanged = function(control) {
        setTimeout(function() {
            control
                .parent()
                .find('.icon-remove')[!!$('img, .text-label, .text', control).length ? 'show' : 'hide']();
        }, 100);
    };

    var handleFileSelect = function(evt) {
        var imgParent = window.currentElement,
            files = [],
            reader = new FileReader();

        evt.stopPropagation();
        evt.preventDefault();

        if (evt.target.id == "fileElem") {
            files = evt.target.files;
        } else {
            files = evt.dataTransfer.files;
        }

        if (files.length) {
            reader.onload = (function(theFile) {
                return function(e) {
                    var img = document.createElement('img');

                    img.src = e.target.result;
                    img.onload = function() {
                        window.URL.revokeObjectURL(this.src);
                    };

                    imgParent
                        .html(img)
                        .closest('.image')
                            .removeClass('active');

                    evt.target.value = '';
                };
            })(files[0]);

            reader.readAsDataURL(files[0]);
        } else {
            var img = document.createElement('img');

            img.src = evt.dataTransfer.getData("text");
            imgParent
                .html(img)
                .closest('.image')
                    .removeClass('active');

            evt.target.value = '';
        }

        isDeviceChanged();
        isControlChanged(imgParent);
    };

    var toggleCustomizeMode = function(bodyFirst) {
        var devices = $('.device-selection a'),
            timeout = 200;

        bodyFirst && $('body').toggleClass('customizing customizing-on');
        $('.device').addClass('hidden');

        for (var i=0, len=devices.length; i<len; i++) {
            var device = devices[i];

            (function(item, i) {
                setTimeout(function() {
                    $(item).toggleClass('flyout');

                    if (i === devices.length - 1) {
                        setTimeout(function() {
                            if (!bodyFirst) {
                                $('body').toggleClass('customizing customizing-on');
                                $('.' + self.selectedDevice).removeClass('hidden');
                            }
                            isDeviceChanged();
                        }, timeout);
                    }
                }, timeout * i);
            })(device, i);
        }
    };

    var toggleImageLibrary = function() {
        $('body').toggleClass('opened');
    };

    var toggleTextMode = function(container) {
        var textPlaceholder = $('.control-content, .text', container),
            textLabel = $('.text-label', container),
            textarea = $('<textarea/>', {
                html: textLabel.text(),
                'autofocus': true
            }),
            btnOk = $('<button/>', {
                'class': 'btn-ok green icon-checkmark'
            }),
            btnCancel = $('<button/>', {
                'class': 'btn-ok red icon-close'
            }),
            btns = $('<div/>', {
                'class': 'btns'
            }),
            textFieldContainer = $('<div/>', {
                'class': 'text-container'
            });

        btns.append(btnOk, btnCancel);
        textFieldContainer.append(textarea, btns);

        setTimeout(function() {
            textarea.focus();
        }, 0);

        btnOk
            .off('click.applyText')
            .on('click.applyText', function() {
                var btnText = textarea.val();

                if (btnText) {
                    textLabel = $('<p/>', {
                        'class': 'text-label',
                        html: '<span>' + btnText + '</span>'
                    });
                    textPlaceholder.html(textLabel);
                }

                $('.text-container', container).remove();

                isDeviceChanged();
                isControlChanged(textPlaceholder);
            });

        btnCancel
            .off('click.cancelTextMode')
            .on('click.cancelTextMode', function() {
                $('.text-container', container).remove();

                isDeviceChanged();
                isControlChanged(textPlaceholder);
            });

        $('.text-container').remove();
        container.append(textFieldContainer);
    };

    $(document)
        .on('click.turnCustomizingOn', '.customizing .device-selection a', function(e) {
            var selectedType = $(this).attr('class');

            self.selectedDevice = selectedType;

            toggleCustomizeMode(false);

            e.preventDefault();
        })
        .on('click.selectImageFromFile', '.customizing-on .control-content', function(e) {
            e.stopPropagation();

            window.currentElement = $(this);
            $('#fileElem').trigger('click');
        })
        .on('click.selectImageFromFile', '.controls', function(e) {
            e.stopPropagation();
        })
        .on('click.selectImageFromFile', '.controls .button-text', function(e) {
            e.stopPropagation();

            toggleTextMode($(this).closest('.image, .tag'));
        })
        .on('click.removeImageFromFile', '.controls .icon-remove', function(e) {
            e.stopPropagation();

            var control = $(this).closest('.image, .tag').find('.control-content, .text');

            control.empty();

            isDeviceChanged();
            isControlChanged(control);
        })
        .on('click.turnCustomizingOff', '.btn-back', function() {
            toggleCustomizeMode(true);

            if ($('body').hasClass('opened')) {
                $('.btn-lib').trigger('click.toggleLib');
            }

            isDeviceChanged();
        })
        .on('click.toggleLib', '.btn-lib', function() {
            $(this).toggleClass('active');
            toggleImageLibrary();
        })
        .on('click.cleanLayout', '.btn-clean', function() {
            $('.control-content', $('.device').not('.hidden')).empty();
            isDeviceChanged();
            $('.icon-remove', $('.device').not('.hidden')).trigger('click.removeImageFromFile');
        })
        .on('change', '#fileElem', function(e) {
            handleFileSelect(e);
        });

    $(document)
        .on('dragover', '.customizing-on .control-content', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(this)
                .closest('.image')
                .addClass('active');
            window.currentElement = $(this);
        })
        .on('dragleave', '.customizing-on .control-content', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(this)
                .closest('.image')
                .removeClass('active');
            window.currentElement = null;
        })
        .on('drop', '.customizing-on .control-content', function(e) {
            e.preventDefault();
            e.stopPropagation();

            handleFileSelect(e);
        })
        .on('dragstart', 'aside img', function(e) {
            e.dataTransfer.setData("text", e.target.src);
        });

//    $('.customizing .device-selection a').eq(2).trigger('click');
})(window.jQuery);