/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!document.querySelector('platinum-sw-cache').disabled) {
      document.querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    var eventAjax = document.getElementById('event_ajax');
    eventAjax.addEventListener('response', function(ev) {
      if (ev.detail && ev.detail.response) {
        app.set('sessions', ev.detail.response.events);
        var toast = document.getElementById('page_toast');
        toast.text = 'Sessions loaded!';
        toast.show();
      }
    });
    eventAjax.addEventListener('error', function() {
      var toast = document.getElementById('page_toast');
      toast.text = 'Unable to load events at this time. Please try again in a few minutes.';
      toast.show();
    });

    //  var events = [];
    //$('table').find('tr').each(function(index, tr) {
    //    var tds = $(tr).find('td');
    //    if (tds.length < 2) {
    //        return;
    //    }
    //    var td1 = $(tds.get(0));
    //    var td2 = $(tds.get(1));
    //    var names = td2.find('h3').text().split(' ');
    //    if (names.length > 2) {
    //        console.log(index, 'irregular name', names)
    //    }
    //    events.push({
    //        "title": td1.find('h3').text(),
    //        "description": td1.find('p').text(),
    //        "start": "2015-09-26T08:00:00",
    //        "end": "2015-09-26T09:00:00",
    //        "rooms": ["Room 225A", "Room 225B", "Room 2207", "Room 2203", "Room 2209"],
    //        "presenter": {
    //            "first": names[0],
    //            "last": names[1],
    //            "bio": td2.find('p').text(),
    //            "avatar": td2.find('p img').attr('src')
    //        }
    //    });
    //});
    //  JSON.stringify(events);

  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });
  document.addEventListener('tile-click', function(ev) {
    document.getElementById('session_detail').set('session', ev.detail.data);
      page('/sessions/'+ev.detail.data.id);
  });


  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };

})(document);
