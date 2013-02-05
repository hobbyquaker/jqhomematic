#!/bin/tclsh

#
#   hmscript.cgi Version 1.0
#   Ausf�hren eines Homematic Scripts, f�r die Verwendung mit dem jQuery HomeMatic Plugin
#   2'2013 https://github.com/hobbyquaker
#
#   Erwartet ein Homematic Script als POST Daten
#
#   (Dieses cgi dient quasi als Proxy da der Zugriff via XHR auf http://ccu:8181 wegen der Same-Origin-Policy nicht m�glich ist)
#
#   Achtung: Dieses CGI er�ffnet jedem der Zugriff auf Port 80 (http) der CCU hat die M�glichkeit HomeMatic-Scripte ohne Authentifizierung auszuf�hren!
#

load tclrega.so

proc escape { str } {
  set jsonmap {
    "\"" "\\\""
    "\\" "\\\\"
    "\b"  "\\b"
    "\f"  "\\f"
    "\n"  "\\n"
    "\r"  "\\r"
    "\t"  "\\t"
  }

  return "[string map $jsonmap $str]"
}

proc utf8-decode str {
  set utfmap {
   "ä" "�"
   "ö" "�"
   "ü" "�"
   "�?" "�"
   "�?" "�"
   "�?" "�"
   "�?" "�"
  }
  return "[string map $utfmap $str]"
}


puts "Content-Type: text/json;Charset=ISO-8859-1"
# Dieser Header Erlaubt Browsern XHR �ber Domain-Grenzen hinweg (Same-Origin-Policy)
puts "Access-Control-Allow-Origin: *"
puts ""

set postdata [utf8-decode [read stdin]]

array set script_result [rega_script $postdata]

puts -nonewline $script_result(STDOUT)
