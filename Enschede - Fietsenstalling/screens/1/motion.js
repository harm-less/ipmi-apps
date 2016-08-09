/* global TSPS */
"use strict";
var tsps;

(function boot() {
  tsps = new TSPS.Connection('192.168.1.241', '7681');
  tsps.connect();
})();