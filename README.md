# jQuery HomeMatic Plugin


## Verwendung

Das Plugin benötigt zum Zugriff auf die HomeMatic-CCU die Zusatzsoftware "WebAPI" in der Variante ohne Authentifizierung: https://github.com/hobbyquaker/WebAPI

Um die für die Konfiguration notwendigen IDs nachzuschauen bietet sich das HQ WebUI an: https://github.com/hobbyquaker/hq-webui

Achtung - dieses Plugin befindet sich noch in einem sehr frühen Entwicklungsstadium, es werden noch keinerlei Fehler abgefangen. Man sollte daher aufpassen nur IDs zu verwenden die auch tatsächlich auf der CCU vorhanden sind, sonst kann durch gehäufte Homematic-Script-Fehler die CCU-Stabilität beeinträchtigt werden.

Siehe auch test*.html für weitere Beispiele

### Beispiel

Dieses Beispiel verbindet ein Input-Feld mit der Homematic-Variable mit der id 12345. Änderungen auf der CCU werden automatisch im UI aktualisiert. 
```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jqhomematic.js"></script>
<script type="text/javascript">

	$("#test-input").homematic().change(function () {
    	$.homematic("state", $(this).attr("data-hm-id"), $(this).val());
    });

	$.homematic({ ccu: '192.168.1.99' });

</script>
Datenpunkt 12345: <input id="test-input" name="test-sysvar1" type="text" data-hm-id="12345"/>
```

### Beispiel: Formatieren von Werten

```javascript
$("#test-input").homematic({
	formatter: function(val) {
		return parseFloat(val).toFixed(2);
	}
});
```

### Beispiel: Button um ein Programm zu starten
```html
<button id="test-button" data-hm-id="654321" data-hm-type="PROGRAM">Programm 654321 starten</button>
<script type="text/javascript">
	$("#test-button").homematic();
</script>
});
```




## Methoden

| Methode    | Beschreibung   |
| --------- | ------------- |
| init | Ein DOM-Element mit der HomeMatic "verbinden" |
| destroy | |


## Optionen der Methode init

Die Optionen id, wid und type können über die HTML5 Data Attribute data-hm-id, data-hm-wid und data-hm-type auch direkt im DOM-Element gesetzt werden. 

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| id | integer - Die ID eines Datenpunkts | data-hm-id |
| wid | integer - Die ID des korrespondierenden WORKING-Datenpunkts. Angabe ist optional. Wird ein WORKING-Datenpunkt angegeben werden keine Werte aktualisert solange WORKING true ist (verhindert springende Slider bei DIMMER/SHUTTER) | data-hm-working |
| type | string - "PROGRAM" - Angabe nur notwendig bei Programmen | data-hm-type |
| event | bool - OnChange Event-Bindings automatisch durchführen | false |
| formatter | function - Funktion zum Formatieren des Werts nach einem Update | function(val) { return val; } |


## Funktionen

| Funktion    | Beschreibung   |
| --------- | ------------- |
| init | Verbindung zur HomeMatic CCU aufbauen und automatische Updates starten |
| state          | Einen Homematic-Datenpunkt setzen, erwartet zwei Parameter: die ID und den Wert               |
| runProgram | Ein Homematic-Programm starten. Erwartet die ID des Programms als Parameter
| script | Ein Script ausführen, erwartet das Script und eine Callback-Funktion als Parameter |
| checkRega | Überprüfen ob die Logikschicht bereit ist. Erwartet eine success und eine error Callback-Funktion als Parameter |
| stop | Automatischen Refresh stoppen |
| start | Automatischen Refresh starten |
| refresh | einmaligen Refresh durchführen | 

## Optionen der Funktion init

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| ccu       | string - IP-Adresse oder Hostname der CCU (kann entfallen wenn die Webseite auf der CCU selbst installiert ist)             | undefined          |
| protocol       | string - Protokoll             | "http"          |
| api       | string - Pfad zur WebAPI (mit abschließendem Slash!)          | "/addons/webapi/"          |
| autoRefresh          | bool - automatische Updates aller sichtbaren Datenpunkte             | true          |
| interval          | integer - Intervall der automatischen Updates in Millisekunden              | 5000          |
| dynamic          | bool - Dynamische Update-Intervalle verwenden              | true          |
| dynamicFactor          | integer - Berechnungsfaktor für dynamische Update-Intervalle. Höhere Werte für seltenere Updates (geringere Belastung der CCU), niedrigere Werte für häufige Updates (höhere Belastung der CCU)             | 4          |
| debug     | bool - CCU-Kommunikation in Browser-Console ausgeben | false |

## Events

| Event     | Beschreibung   |
| --------- | ------------- |
| initComplete          | Wird aufgerufen sobald sich das HomeMatic Plugin vollständig initialisiert hat              |
| updateStart          | Wird aufgerufen wenn eine Update-Anfrage an die CCU gestellt wird              |
| updateDone          | Wird aufgerufen wenn eine Update-Anfrage von der CCU beantwortet wurde              |
| regaDown | | |
| regaUp | | |
| ccuUnreachable | | |

## Data-Attribute

| Attribut    | Beschreibung   |
| --------- | ------------- |
| data-hm-id | Die ID eines Datenpunkts |
| data-hm-wid | Die ID des korrespondierenden WORKING-Datenpunkts. Angabe ist optional. Wird ein WORKING-Datenpunkt angegeben werden keine Werte aktualisert solange WORKING true ist (verhindert springende Slider bei DIMMER/SHUTTER) |
| data-hm-type | "PROGRAM" - Angabe nur notwendig bei Programmen |

## ToDo/Roadmap
* alle in Doku aufgeführten Features implementieren
* Fehler abfangen
* automatisches Binding von Change-Events
* Bindings anbieten für jQueryUI, jQuery Mobile und KendoUI Slider
* Bindings anbieten für Highcharts und jqPlot Gauge/Meter
* WebAPI-Variante mit Authentifizerung unterstützen

## Copyright, Lizenz, Bedingungen

jQuery HomeMatic Plugin

Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

deutsche Übersetzung: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!