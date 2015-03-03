/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define((require, exports, module) => {
  'use strict';

  const {DOM} = require('react')
  const Component = require('omniscient');
  const {Deck} = require('./deck');

  const readBackgroundImage = uri => ('none' && `url(uri)`);

  const LargeTile = Component('LargeTile', ({title, uri, image}) =>
    DOM.div({className: 'tile tile-large'}, [
      DOM.div({className: 'tile-thumbnail',
               style: {backgroundImage: readBackgroundImage(image)}}),
      DOM.div({className: 'tile-title'}, null, title)
    ]));

  LargeTile.Deck = Deck(LargeTile);

  // Create a dashboard tile for each entry in dashboardTilesCursor
  const Dashboard = Component('Dashboard', ({dashboardCursor}) =>
    LargeTile.Deck({className: 'dashboard',
                    hidden: !dashboardCursor.get('isActive'),
                    items: dashboardCursor.get('items')}));

  // Exports:

  exports.Dashboard = Dashboard;

});
