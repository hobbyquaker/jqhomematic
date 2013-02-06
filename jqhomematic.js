/**
 *  jQuery HomeMatic Plugin
 *  https://github.com/hobbyquaker/jqhomematic/
 *
 *  Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker
 *
 *  This Software is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License
 *  Version 3 as published by the Free Software Foundation.
 *  http://www.gnu.org/licenses/gpl.html
 *  http://www.gnu.de/documents/gpl.de.html
 *
 *  This software comes without any warranty, use it at your own risk
 *
 */


(function ($) {

    var homematicReady = false,
        settings,
        hmObjects = [],
        refreshScript = "",
        methods = {
            connect : function ( options ) {
                console.log("connect");
                if (settings == undefined) {
                    settings = $.extend({
                        'ccu':          undefined,
                        'api':          '/addons/jqhm/hmscript.cgi',
                        'protocol':     'http',
                        'debug':        false
                    }, options);

                    if (options.debug) { console.log("jqhomematic: debug"); }
                    if (settings.ccu) {
                        settings.url = settings.protocol + "://" + settings.ccu + settings.api;
                    } else {
                        settings.url = settings.api;
                    }
                }
                buildRefreshScript();
            },
            init : function( options ) {
                console.log("init");
                homematicReady = true;


                this.each(function() {

                        var obj = $(this);
                        var element = $.extend({
                            'obj':          obj,
                            tag :           obj.prop( 'tagName' ),
                            type :          obj.attr( 'type' ),
                            id :            obj.attr( 'data-hm-id' ),
                            wid :           obj.attr( 'data-hm-wid' ),
                            value :         obj.attr( 'data-hm-value' ),
                            refresh :       true
                        }, options);

                        if ( element.id > 0 ) {

                            hmObjects.push(element);
                            buildRefreshScript();

                        }



                });
                console.log(hmObjects);
                return this;

            },
            script: function (script, success, error) {
                if (settings.debug) {
                    console.log(script);
                }
                $.ajax({
                    url: settings.url,
                    type: "POST",
                    dataType: "text",
                    data: script,
                    success: success,
                    error: error
                });
            },
            state: function(id, value) {
                methods.script("dom.GetObject("+id+").State("+value+")");
            },
            destroy: function () {
            return this.each(function() {
                $(this).find("*[data-hm-id]").each(function () {
                    var element =   $(this),
                        tag =       element.prop('tagName'),
                        type,
                        id =        element.attr("data-hm-id"),
                        value =     element.attr("data-hm-value");
                    console.log(" hm-id=" + id);
                });
            });
        }
    };

    var buildRefreshScript = function () {
        var DPs = {};
        for (var i = 0; i < hmObjects.length; i++) {
            DPs["hm"+hmObjects[i].id] = hmObjects[i];
        }
        for (var key in DPs) {

        }
    }

    var hmUpdate = function(elements) {
        if (elements === undefined) {
            elements = rootElements;
        }

    }

    var hmAddObject = function (id) {
        if (!hmObjects["hm"+id]) {
            hmObjects["hm"+id] = {};
        }
    };


    $.fn.homematic = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.homematic' );
        }
    }





})(jQuery);