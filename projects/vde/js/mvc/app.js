/* Main backbone app
 ========================================================================== */

;
(function ($, document, Lego) {
    'use strict';

    /* Main App
     ========================================================================== */
    Lego.Views.App = Backbone.View.extend({
        events: {},

        initialize: function () {
            // notes
            this.notes = new Lego.Collections.note;

            // init main page
            this.page = new Lego.Views.page;

            // init app menu
            this.menu = new Lego.Views.menu;

            // init right sidebar
            this.right_sidebar = new Lego.Views.sidebar;

            // ui items list
            this.ui_items = new Lego.Views.uiItemsList;

            // init deskboard
            this.deskboard = new Lego.Views.deskboard;
        }
    });

})(window.jQuery, document, Lego);

var App = new Lego.Views.App;

// Loading deskboard
App.menu.loadDeskboard({silent: YES});