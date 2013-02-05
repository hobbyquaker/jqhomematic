jQuery HomeMatic Plugin
=======================

Dieses Plugin verbindet HTML-Elemente (z.B. INPUT, SELECT, ...) mit HomeMatic-Geräten/Variablen/Programmen. Es werden entsprechende Events an die Elemente gebunden um die HomeMatic-Geräte zu steuern, außerdem ist ein automatischer Update-Mechanismus implementiert der alle Elemente aktualisert wenn sich der Wert des zugeordneten HomeMatic-Datenpunkts ändert.

Es ist also mit diesem Plugin möglich sich individuelle Webfrontends für die CCU zu bauen - ohne sich mit den CCU Internas und HomeMatic-Script zu beschäftigen, es sind lediglich HTML und Javascript/jQuery Kenntnisse erforderloch. Man ist auf kein bestimmtes UI Framework festgelegt, dieses Plugin soll universell einsetzbar sein, egal ob mit jQuery Mobile, jQueryUI, KendoUI oder sonstigen UI-Frameworks.

Im Moment befindet sich die Entwicklung noch ganz am Anfang - geplant ist der Release der Version "1.0" gegen Ende März/Anfang April 2013.

Verwendung
==========
jQuery und das HomeMatic Plugin einbinden:
```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jqhomematic.js"></script>
```

Elemente mit den Homematic data-Attributen versehen:
```html
<input name="test-sysvar1" type="text" data-hm-id="12345"/>
```
Das Plugin initialisieren
```javascript
$("body").homematic({
  ccu:             "172.16.23.3"
});
```

Optionen
========
| Option    | Beschreibung   | Default   |
| --------- | ------------- | --------- |
| ccu       | IP-Adresse oder Hostname der CCU              | ""          |
| updateInterval          | Intervall der automatischen Updates in Millisekunden              | 3000          |
| autoStart | Automatische Updates durchführen | true |
| formatter | Funktion zum Formatieren der Werte, erhält den Wert als Parameter | undefined |

Events
======
| Event     | Beschreibung   |
| --------- | ------------- |
| initcomplete          | Wird aufgerufen sobald sich das HomeMatic Plugin vollständig initialisiert hat              |
| updatestart          | Wird aufgerufen wenn eine Update-Anfrage an die CCU gestellt wird              |
| updatedone          | Wird aufgerufen wenn eine Update-Anfrage von der CCU beantwortet wurde              |


Methoden
========

| Methode    | Beschreibung   |
| --------- | ------------- |
| set          | Einen Homematic-Datenpunkt setzen               |
| update          | Update aller Datenpunkte anstoßen              |
| destroy   | Plugin beenden, alle Event-Handler werden entfernt  |
| stop | Automatische Updates beenden |
| start | Automatische Updates starten |

Data-Attribute
==============
| Attribut    | Beschreibung   |
| --------- | ------------- |
| data-hm-id | Die ID eines Datenpunkts |



Copyright, Lizenz, Bedingungen
==============================

jQuery HomeMatic Plugin

Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

deutsche Übersetzung: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!