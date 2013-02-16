# jQuery HomeMatic Plugin


## Verwendung

Das Plugin benötigt zum Zugriff auf die HomeMatic-CCU die Zusatzsoftware "WebAPI" in der Variante ohne Authentifizierung: https://github.com/hobbyquaker/WebAPI


### Beispiel 1

Dieses Beispiel verbindet ein Input-Feld mit der Homematic-Variable mit der id 12345. Änderungen werden automatisch an die Homematic CCU gesendet (Change-Event), Änderungen auf der CCU werden automatisch im UI aktualisiert.

```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jqhomematic.js"></script>
<script type="text/javascript">
	$("#test-input").homematic();

	$.fn.homematic("connect", {
		ccu: '192.168.1.99'
	});
</script>
<input id="test-input" name="test-sysvar1" type="text" data-hm-id="12345"/>
```


## Optionen

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| id | integer - Die ID eines Datenpunkts | data-hm-id |
| wid | integer - Die ID des korrespondierenden WORKING-Datenpunkts. Angabe ist optional. Wird ein WORKING-Datenpunkt angegeben werden keine Werte aktualisert solange WORKING true ist (verhindert springende Slider bei DIMMER/SHUTTER) | data-hm-working |
| type | string - "PROGRAM" - Angabe nur notwendig bei Programmen | data-hm-type |
| event | bool - Event-Bindings automatisch durchführen | true |
| formatter | function - Funktion zum Formatieren des Werts nach einem Update | function(val) { return val; } |



## Events

| Event     | Beschreibung   |
| --------- | ------------- |
| initComplete          | Wird aufgerufen sobald sich das HomeMatic Plugin vollständig initialisiert hat              |
| updateStart          | Wird aufgerufen wenn eine Update-Anfrage an die CCU gestellt wird              |
| updateDone          | Wird aufgerufen wenn eine Update-Anfrage von der CCU beantwortet wurde              |
| regaDown | | |
| regaUp | | |
| ccuUnreachable | | |


## Methoden

| Methode    | Beschreibung   |
| --------- | ------------- |
| connect | Verbindung zur HomeMatic CCU aufbauen und automatische Updates starten |
| set          | Einen Homematic-Datenpunkt setzen, erwartet zwei Parameter: die ID und den Wert               |
| update          | Ein Update aller Werte anstoßen          |
| destroy   | Plugin entfernen, automatische Updates werden angehalten, alle Event-Handler werden entfernt  |
| stop | Automatische Updates stoppen |
| start | Automatische Updates starten |
| script | Ein Script ausführen, erwartet das Script als Parameter |


## Optionen der Methode connect

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| ccu       | string - IP-Adresse oder Hostname der CCU (kann entfallen wenn die Webseite auf der CCU selbst installiert ist)             | undefined          |
| protocol       | string - Protokoll             | "http"          |
| api       | string - Pfad zur WebAPI (mit abschließendem Slash!)          | "/addons/webapi/"          |
| update          | bool - automatische Updates aller sichtbaren Datenpunkte             | true          |
| interval          | integer - Intervall der automatischen Updates in Millisekunden              | 5000          |
| dynamic          | bool - Dynamische Update-Intervalle verwenden              | true          |
| dynamicFactor          | integer - Berechnungsfaktor für dynamische Update-Intervalle. Höhere Werte für seltenere Updates (geringere Belastung der CCU), niedrigere Werte für häufige Updates (höhere Belastung der CCU)             | 4          |
| debug     | bool - CCU-Kommunikation in Browser-Console ausgeben | false |


## Data-Attribute

| Attribut    | Beschreibung   |
| --------- | ------------- |
| data-hm-id | Die ID eines Datenpunkts |
| data-hm-wid | Die ID des korrespondierenden WORKING-Datenpunkts. Angabe ist optional. Wird ein WORKING-Datenpunkt angegeben werden keine Werte aktualisert solange WORKING true ist (verhindert springende Slider bei DIMMER/SHUTTER) |
| data-hm-type | "PROGRAM" - Angabe nur notwendig bei Programmen |

## Roadmap
* WebAPI-Variante mit Authentifizerung unterstützen


## Copyright, Lizenz, Bedingungen

jQuery HomeMatic Plugin

Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

deutsche Übersetzung: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!