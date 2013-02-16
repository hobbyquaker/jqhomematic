# jQuery HomeMatic Plugin



### Verwendung

Das Plugin ben�tigt zum Zugriff auf die HomeMatic-CCU die Zusatzsoftware "WebAPI" in der Variante ohne Authentifizierung: https://github.com/hobbyquaker/WebAPI


```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jqhomematic.min.js"></script>

<input id="test-input" name="test-sysvar1" type="text" data-hm-id="12345"/>
<input id="test-input" name="test-sysvar2" type="text" data-hm-id="22222"/>
```

```javascript
$("*[data-hm-id]").homematic().change(function() {
  $.fn.homematic("state", $(this).attr("data-hm-id"), $(this).val());
});

$.fn.homematic("connect", {
  ccu: '192.168.1.99'
});
```

### Optionen

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| |�|�|


### Events

| Event     | Beschreibung   |
| --------- | ------------- |
| initComplete          | Wird aufgerufen sobald sich das HomeMatic Plugin vollst�ndig initialisiert hat              |
| updateStart          | Wird aufgerufen wenn eine Update-Anfrage an die CCU gestellt wird              |
| updateDone          | Wird aufgerufen wenn eine Update-Anfrage von der CCU beantwortet wurde              |
| regaDown | |�|
| regaUp | |�|
| ccuUnreachable | |�|


### Methoden

| Methode    | Beschreibung   |
| --------- | ------------- |
| connect |�Verbindung zur HomeMatic CCU aufbauen und automatische Updates starten |
| set          | Einen Homematic-Datenpunkt setzen, erwartet zwei Parameter: die ID und den Wert               |
| update          | Ein Update aller Werte ansto�en          |
| destroy   | Plugin entfernen, automatische Updates werden angehalten, alle Event-Handler werden entfernt  |
| stop | Automatische Updates stoppen |
| start | Automatische Updates starten |
| script | Ein Script ausf�hren, erwartet das Script als Parameter |

### Optionen

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| formatter |�|�|
| id | Die ID eines Datenpunkts | data-hm-id |
| wid | Die ID des korrespondierenden WORKING-Datenpunkts. Angabe ist optional. Wird ein WORKING-Datenpunkt angegeben werden keine Werte aktualisert solange WORKING true ist (verhindert springende Slider bei DIMMER/SHUTTER) | data-hm-working |
| type | "PROGRAM" - Angabe nur notwendig bei Programmen | data-hm-type |


### Connect Optionen

| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| ccu       | string - IP-Adresse oder Hostname der CCU (kann entfallen wenn die Webseite auf der CCU selbst installiert ist)             | undefined          |
| update          | bool - automatische Updates aller sichtbaren Datenpunkte             | true          |
| interval          | integer - Intervall der automatischen Updates in Millisekunden              | 3000          |
| dynamic          | bool - Dynamische Update-Intervalle verwenden              | true          |
| dynamicFactor          | integer - Berechnungsfaktor f�r dynamische Update-Intervalle. H�here Werte f�r seltenere Updates (geringere Belastung der CCU), niedrigere Werte f�r h�ufige Updates (h�here Belastung der CCU)             | 4          |
| debug     | bool - CCU-Kommunikation in Browser-Console ausgeben | false |


### Data-Attribute

| Attribut    | Beschreibung   |
| --------- | ------------- |
| data-hm-id | Die ID eines Datenpunkts |
| data-hm-working | Die ID des korrespondierenden WORKING-Datenpunkts. Angabe ist optional. Wird ein WORKING-Datenpunkt angegeben werden keine Werte aktualisert solange WORKING true ist (verhindert springende Slider bei DIMMER/SHUTTER) |
| data-hm-type | "PROGRAM" - Angabe nur notwendig bei Programmen |

# Roadmap
* WebAPI-Variante mit Authentifizerung unterst�tzen


# Copyright, Lizenz, Bedingungen

jQuery HomeMatic Plugin

Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

deutsche �bersetzung: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!