Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

(function ($) {

    var rootElements, homematicReady = false;

    var hmObjects = [];

    var methods = {
        init : function( options ) {
            console.log("init");
            console.log(options);
            console.log(this);
            rootElements = this;
            homematicReady = true;
            this.each(function() {
                $(this).find("*[data-hm-id]").each(function () {
                    var element =   $(this),
                        tag =       element.prop('tagName'),
                        type,
                        id =        element.attr("data-hm-id"),
                        value =     element.attr("data-hm-value");
                    if (id != "") {
                        console.log(" hm-id=" + id);

                        hmAddObject(id);

                        switch (tag) {
                            case "INPUT":
                                element.bind("change.homematic", function () {
                                    hmSet(id, element.val());
                                });

                                break;
                            case "TEXTAREA":
                                element.bind("change.homematic", function () {
                                    hmSet(id, element.text());

                                });
                                break;
                            case "BUTTON":
                                element.bind("click.homematic", function () {
                                    hmSet(id, value);

                                });
                                break;
                            case "SELECT":
                                element.bind("change.homematic", function () {
                                    hmSet(id, element.find('option:selected').val());

                                });
                                break;
                            default:
                            // jQuery UI Slider

                            // KendoUI Slider

                            // jQuery Mobile Slider
                        }
                    }


                });
            });
            console.log("objects: " + hmObjects);
            return this;

        },
        update: function (args) {
            console.log("update");
            console.log(options);
            console.log(this);
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

                    element.unbind(".homematic");

                });
            });
        }
    };

    var hmUpdate = function(elements) {
        if (elements === undefined) {
            elements = rootElements;
        }

    }

    var hmAddObject = function (id) {
        if (hmObjects.indexOf(id) == -1) {
            hmObjects.push(id);
        }
    };

    var hmSet = function(id, value) {
        console.log("hmSet("+id+", "+value+")");
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