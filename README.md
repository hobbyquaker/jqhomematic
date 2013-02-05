jqhomematic
===========

jQuery HomeMatic Plugin


Usage
=====
jQuery und das HomeMatic Plugin einbinden:
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script type="text/javascript" src="jqhomematic.js"></script>

Elemente mit den Homematic data-Attributen versehen:
  <input name="test-sysvar1" type="text" data-hm-id="12345"/>

Das Plugin initialisieren
  $("body").homematic({
    ccu:             "172.16.23.3"
  });

Options
=======
| Option    | Description   | Default   |
| --------- | ------------- | --------- |
| ccu       | IP-Adresse oder Hostname der CCU              | ""          |
| updateInterval          | Intervall der automatischen Updates in Millisekunden              | 3000          |
| autoStart | Automatische Updates durchführen | true |
| formatter | Funktion zum Formatieren der Werte, erhält den Wert als Parameter | undefined |

Events
======
| Event     | Description   |
| --------- | ------------- |
| initcomplete          |               |
| updatestart          |               |
| updatedone          |               |



Methods
=======

| Method    | Description   |
| --------- | ------------- |
| set          | Einen Homematic-Datenpunkt setzen               |
| update          |               |
| destroy   |   |
| stop | Automatische Updates beenden |
| start | Automatische Updates starten |