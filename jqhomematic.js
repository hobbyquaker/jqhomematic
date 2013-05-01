/**
 *  jQuery HomeMatic Plugin
 *  https://github.com/hobbyquaker/jqhomematic/
 *
 *  Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker
 *  MIT License (MIT)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 *  documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 *  the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 *  THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
;

var homematic = {
    uiState: {},                // can Observable f�r UI
    setState: {},               // can Observable zum setzen von Werten
    ccu: {},                    // Logikschicht-Daten
    dpWorking: {}
};

(function ($) {

var version =               '0.7',

    connected =             false,
    ready =                 false,
    setStateTimers =        {},
    refreshTimer,
    cancelNextRefresh =     false,

    settings =      {
        'ccu':              undefined,
        'api':              '/addons/webapi/',
        'protocol':         'http',
        'debug':            true,
        'loadCcuData':      true,
        'cache':            true,
        'dataTypes': [
            "variables",
            "programs",
            "devices"
        ],
        'storageKey':       'jqhm',
        'setStateDelay':    1250,
        'autoRefresh':      false,
        'refreshInterval':  7500,
        'regaDown':         function() {},
        'regaUp':           function() {},
        'connected':        function() {},
        'ready':            function() { funcs.debug("ready"); },
        'loading':          function(txt) {}
    },

    funcs = {
        init: function (options) {
            if (connected) {
                $.error( 'jQuery.homematic already connected!' );
                return false;
            }

            settings = $.extend(settings, options);

            if (settings.ccu) {
                settings.url = settings.protocol + '://' + settings.ccu + settings.api;
            } else {
                settings.url = settings.api;
            }

            homematic.uiState = new can.Observe({"_65535":{"Value":0}});
            homematic.setState = new can.Observe({"_65535":{"Value":0}});

            funcs.checkRega(function() {
                connected = true;

                if (settings.loadCcuData && settings.cache) {
                    var cache = storage.get(settings.storageKey);
                    var cacheReady = false;
                    if (cache && cache !== null) {
                        cacheReady = true;
                        for (var index in settings.dataTypes) {
                            if (!cache[settings.dataTypes[index]]) {
                                cacheReady = false

                            } else {
                                settings.loading("cache hit " + settings.dataTypes[index])

                            }
                        }
                    }

                    if (cacheReady) {
                        ccu = $.extend(ccu, cache);
                        console.log(ccu);
                        ready = true;
                        settings.ready();
                    }
                }
                if (settings.loadCcuData) {
                    if (!ready) {
                        for (var index in settings.dataTypes) {
                            funcs.loadCcuData(settings.dataTypes[index]);
                        }
                        funcs.waitTillReady();
                    }
                } else {
                    if (!ready) {
                        ready = true;
                        settings.ready();
                    }
                }

                funcs.refreshVisible();

                homematic.setState.bind("change", function (e, attr, how, newVal, oldVal) {
                if (how == "set" || how == "add") {
                    funcs.stateDelayed(attr, newVal.Value);
                }
            });

            }, function () {
                connected = false;
                settings.regaDown();
            });



        },                     // Homematic Plugin initialisieren
        setState: function (id, val) {
            cancelNextRefresh = true;
            homematic.setState.attr("_"+id, {Value:"\""+val+"\""});
            funcs.uiState(id, val);
        },                 // Wert-�nderung in homematic.setState schreiben
        uiState: function (id, val) {
            homematic.uiState.attr("_"+id+".Value", val);
        },                  // Wert-�nderung in homematic.uiState schreiben
        stateDelayed: function (attr, val) {
            if (!setStateTimers[attr]) {
                funcs.state(attr.slice(1), val);
                homematic.setState.removeAttr(attr);
                setStateTimers[attr] = setTimeout(function () {
                    if (homematic.setState[attr]) {
                        setStateTimers[attr] = undefined;
                        funcs.stateDelayed(attr, homematic.setState.attr(attr + ".Value"));
                    }
                    setStateTimers[attr] = undefined;
                }, settings.setStateDelay);
            }
        },           // Wert-�nderungs-Frequenz begrenzen
        clearCache: function () {
            storage.set(settings.storageKey, null);
            window.location.reload();
        },                      // Clear cached data in object ccu and trigger reload
        script: function (script, success, error) {
            //funcs.debug(script);
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
        },    // Runs a Homematic Script
        state: function(id, value) {
            if (value) {
                funcs.script('dom.GetObject('+id+').State('+value+');', function () { cancelNextRefresh = false; });
            }
        },                   // Sets a Homematic Datapoint
        runProgram: function(id) {
            funcs.script('dom.GetObject('+id+').RunProgram();');
        },                     // Starts a Homematic Program
        checkRega: function(success, error) {
            funcs.debug("checkRega()");
            var url = '/addons/webapi/checkrega.cgi';
            if (settings.ccu) {
                url = settings.protocol + '://' + settings.ccu + url;
            }
            $.ajax({
                url: url,
                success: function(data) {
                    if (data == 'OK') {
                        settings.regaUp();
                        if (success) { success(); }
                    } else {
                        settings.regaDown();
                        if (error) { error(data); }
                    }
                },
                error: function(a, b, c) {
                    settings.regaDown();
                    error(a,b,c);
                }
            });
        },          // ReGaHss running? (= Port 8181 reachable)
        loadCcuData: function (dataType) {
            // Achtung jQuery Version
            // Wird in Zukunft $.ajax.active
            if ($.active > 0) {
                setTimeout(function() {
                    funcs.loadCcuData(dataType);
                }, 100);
                return false;
            }
            settings.loading("loadCcuData("+dataType+")")
            funcs.debug("loadCcuData("+dataType+")");
            $.ajax({
                url: 'fn/' + dataType + '.fn',
                type: 'GET',
                dataType: 'text',
                success: function (data) {
                    var url = settings.url + 'hmscript.cgi?content=json';
                    if (settings.session) {
                        url += '&session=' + settings.session;
                    }
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (res) {
                            settings.loading("loadCcuData("+dataType+") finished");
                            funcs.debug("loadCcuData("+dataType+") finished");
                            ccu[dataType] = res;
                            if (settings.cache) {
                                settings.loading("caching " + dataType);
                                funcs.debug("caching " + dataType);
                                storage.extend(settings.storageKey, ccu);
                            }
                        }
                    });
                }
            });
            return true;
        },             // Run homematic scripts and insert results in Object ccu
        refresh: function (DPs) {
            if (cancelNextRefresh) {
                cancelNextRefresh = false;
                $(".jqhmRefresh").hide();

                return false;
            }
            var script = funcs.buildRefreshScript(DPs);
            funcs.script(script, function(data) {
                data = $.parseJSON(data);
                if (cancelNextRefresh) {
                    cancelNextRefresh = false;
                    $(".jqhmRefresh").hide();

                    return false;
                }
                for (var dp in data) {
                    //jqhm[dp].attr('Value', data[dp].Value);
                    //jqhm[dp].attr('Timestamp', data[dp].Timestamp);

                    homematic.uiState.attr(dp + ".Value", data[dp].Value);
                    homematic.uiState.attr(dp + ".Timestamp", data[dp].Timestamp);
                }
                $(".jqhmRefresh").hide();


            });
        },                      // Refresh of all Datapoints in Array DPs
        addUiState: function(id) {
            var sid = '_' + id;
            homematic.uiState.attr(sid, {'id':id,'wid':undefined,'Value':0,'Timestamp':''});
        },                     // uiState Objekt initialisieren
        viewsVisible: function () {
            var views = [];
            $("*[data-hm-id]").each(function () {
                var id = $(this).attr("data-hm-id");
                var wid = $(this).attr("data-hm-wid");
                if (wid) {
                    homematic.dpWorking["_"+id] = wid;
                }
                if (views.indexOf(id) === -1) {
                    views.push(id);
                }
            });
            return views;
        },                    // Returns Array of all visible Datapoints
        refreshVisible: function () {
            funcs.debug("refreshVisible()");
            $(".jqhmRefresh").show();
            funcs.refresh(funcs.viewsVisible());
            if (settings.autoRefresh) {
                clearTimeout(refreshTimer)
                refreshTimer = setTimeout(funcs.refreshVisible, settings.refreshInterval);
            }
        },                  // Wraps funcs.refresh(funcs.viewsVisible())
        shell: function (cmdline, success, error) {
            var url = settings.url + 'process.cgi';
            if (settings.session) {
                url += '&session=' + settings.session;
            }
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'text',
                data: cmdline,
                success: success,
                error: error
            });
        },    // �bergibt Commandline an /bin/sh, success(data) beinhaltet stdout
        buildRefreshScript: function (DPs) {
            var refreshScript = 'var first = true;\nobject o;\nobject w;\nWrite("{");\n';

            var first = true;
            for (var dp in DPs) {

                var id = DPs[dp];

                if (id != 65535) {

                    var type; // PROGRAMME ERKENNEN?

                    if (homematic.dpWorking["_"+id]) { // WORKING ID
                        refreshScript += 'w = dom.GetObject(' + homematic.dpWorking["_"+id] + ');\n';
                        refreshScript += 'if (w.Value() == false) {\n';
                    }

                    refreshScript += 'if (first) {\nfirst = false;\n } else {\n WriteLine(",");\n}\n';


                    refreshScript += 'o = dom.GetObject(' + id + ');\n';
                    refreshScript += 'Write("\\"_' + id + '\\":{");\n';
                    if (type !== "PROGRAM")�{
                        refreshScript += 'Write("\\"Value\\":\\"");\n';
                        refreshScript += 'WriteURL(o.Value());\nWrite("\\",");\n';
                    }
                    refreshScript += 'Write("\\"Timestamp\\":\\"" # o.Timestamp() # "\\"}");\n';

                    if (homematic.dpWorking["_"+id]) { // Working ID
                        refreshScript += '}\n';
                    }
                }
            }
            refreshScript += 'Write("}");';
            return refreshScript;
        },           // Homematic Script zum Refresh der Datenpunkte erzeugen
        waitTillReady: function () {
            var allReady = true;
            for (var index in settings.dataTypes) {
                if (ccu[settings.dataTypes[index]] === undefined) {
                    allReady = false;
                }
            }
            if (allReady) {
                ready = true;
                settings.ready();
                return true;
            } else {
                setTimeout(funcs.waitTillReady, 80);
                return false;
            }
        },                   // Warten bis das Plugin initialisiert. Feuert ready Event
        debug: function (txt) {
            if (settings.debug) {
                console.log(txt);
            }
        }                         // Debugausgabe in die Browserconsole
    },
    methods = {};

    $.fn.homematic = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.homematic' );
        }
    }
    $.homematic = function( func ) {
        if ( funcs[func] ) {
            return funcs[ func ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof func === 'object' || ! func ) {
            return funcs.init.apply( this, arguments );
        } else {
            $.error( 'Function ' +  func + ' does not exist on jQuery.homematic' );
        } 
    }



})(jQuery);