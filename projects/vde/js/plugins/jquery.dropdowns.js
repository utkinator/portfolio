;
(function ($, document) {
    'use strict';

    $.fn.dropdown = function (options) {
        var self = this;

        var defaults = {
            btnsGroup: '.ui-button-group',
            btnArrow: '.arrow',
            activeClass: 'active'
        };

        var options = $.extend({}, defaults, options);
        var btns = $(this);

        /* Reset all dropdowns */
        this.reset = function () {
            btns.each(function (index, btn) {
                $(btn)
                    .removeClass(options.activeClass)
                    .closest(options.btnsGroup)
                    .removeClass(options.activeClass);

                $(options.btnArrow).text('▼');
            });
        };

        /* document Event bindings */
//        jQuery(document).on('click.hideDropdown', this.reset);
        jQuery(document).on('keyup.hideDropdown', function (e) {
            var ESC_CODE = '27';

            if (e.keyCode == ESC_CODE) {
                self.reset();
            }
        });

        return this.each(function () {
            var elem = $(this),
                arrow = $(options.btnArrow, elem);

            elem.off('click.toggleDropdown').live('click.toggleDropdown', function () {
                elem
                    .toggleClass(options.activeClass)
                    .closest(options.btnsGroup)
                    .toggleClass(options.activeClass);

                elem.hasClass(options.activeClass) ? arrow.text('▲') : arrow.text('▼');

                return false;
            });
        });
    };
})(window.jQuery, document);