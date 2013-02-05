jqhomematic
===========

jQuery HomeMatic Plugin


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
| initcomplete          |               |
| updatestart          |               |
| updatedone          |               |


Methoden
========

| Methode    | Beschreibung   |
| --------- | ------------- |
| set          | Einen Homematic-Datenpunkt setzen               |
| update          |               |
| destroy   |   |
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

Copyright (c) 2012, 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

deutsche Übersetzung: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!