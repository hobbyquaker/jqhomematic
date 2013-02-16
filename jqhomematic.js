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


;(function ($) {

var connected = false,
    settings = {},
    cache = [],
    refreshScript = '',
    methods = {
        connect : function ( options ) {
            if (connected) {
                $.error( 'jQuery.homematic already connected!' );
                return false;
            }

            settings = $.extend({
                'ccu':              undefined,
                'api':              '/addons/webapi/',
                'protocol':         'http',
                'user':             undefined,
                'password':         undefined,
                'debug':            false,
                'regaDown':         function () { },
                'regaUp':           function () { },
                'ccuUnreachable':   function () { }
            }, options);

            if (settings.ccu) {
                settings.url = settings.protocol + '://' + settings.ccu + settings.api;
            } else {
                settings.url = settings.api;
            }

            buildRefreshScript();
            refreshData(refreshUI);
            connected = true;
        },
        init : function( options ) {


            this.each(function() {


                var $this = $(this),
                    data = $this.data('homematic');
                // If the plugin hasn't been initialized yet
                if ( ! data ) {

                    /*
                     Do more setup stuff here
                     */

                    $(this).data('homematic', {
                        id: $this.attr("data-hm-id"),
                        wid: $this.attr("data-hm-wid"),
                        type: $this.attr("data-hm-type"),
                        refresh: true
                    });



                } else {
                    $.error("homematic init Element wurde bereits initialisiert.");
                }





            });
            return this;

        },
        script: function (script, success, error) {
            if (settings.debug) {
                console.log(script);
            }
            var url = settings.url + 'hmscript.cgi?content=plain';
            if (settings.session) {
                url += '&session=' + settings.session;
            }
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'text',
                data: script,
                success: success,
                error: error
            });
        },
        state: function(id, value) {
            if (value) {
                methods.script('dom.GetObject('+id+').State('+value+');');
            } else {
                methods.script('dom.GetObject('+id+').State();');
            }
        },
        runprogram: function(id) {},
        checkrega: function(success, error) {
            var url = '/addons/webapi/checkrega.cgi';
            if (settings.ccu) {
                url = settings.protocol + '://' + settings.ccu + url;
            }
            $.ajax({
                url: url,
                success: function(data) {
                    if (data == 'OK') {
                        if (success) { success(); }
                    } else {
                        if (error) { error(data); }
                    }
                },
                error: function(a, b, c) {
                    error();
                }
            });
        },
        destroy: function () {
            return this.each(function() {

            });
        }
    };

    var bindEvent = function () {

    };

    var buildRefreshScript = function () {
        var DPs = {};

        $('*[data-hm-id]').each(function () {

            var data = $(this).data('homematic');
            DPs['hm'+data.id] = data;
        });



        refreshScript = 'object o;\nobject w;\nWrite("{");\n';

        var first = true;

        for (var key in DPs) {

            if (DPs[key].refresh) {
                if (DPs[key].wid > 0) {
                    refreshScript += 'w = dom.GetObject(' + DPs[key].wid + ');\n';
                    refreshScript += 'if (w.Value() == false) {\n';
                }

                if (!first) {
                    refreshScript += 'WriteLine(",");\n';
                } else {
                    first = false;
                }

                refreshScript += 'o = dom.GetObject(' + DPs[key].id + ');\n';
                refreshScript += 'Write("\\"hm' + DPs[key].id + '\\":{\\"id\\":\\"'+DPs[key].id+'\\",");\n';
                if (DPs[key].type !== "PROGRAM") {
                    refreshScript += 'Write("\\"val\\":\\"");\n';
                    refreshScript += 'WriteURL(o.Value());\nWrite("\\",");\n';
                }
                refreshScript += 'Write("\\"timestamp\\":\\"" # o.Timestamp() # "\\"}");\n';

                if (DPs[key].wid > 0) {
                    refreshScript += '}\n';
                }

            }
        }

        refreshScript += 'Write("}");';
       // console.log(refreshScript);
    }

    var refreshData= function (success) {
        var url = settings.url + 'hmscript.cgi?content=json';
        if (settings.session) {
            url += '&session=' + settings.session;
        }
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: refreshScript,
            success: function (data) {
                cache = data;
                if (success) { success(data); }
            }

            // Todo error handling
        });
    }

    var refreshUI = function (data) {
        if (!data) { data = cache; }
        for (var key in data) {
            $("*[data-hm-id='"+data[key].id+"']").val(data[key].val);
        }
    }


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