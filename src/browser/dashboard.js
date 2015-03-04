/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define((require, exports, module) => {
  'use strict';

  const {DOM} = require('react')
  const Component = require('omniscient');
  const {Deck} = require('./deck');

  const readBackground = uri => ('none' && `url(${uri})`);

  const LargeTile = Component('LargeTile', ({item}) => {
    return DOM.div({key: item.get('uri'),
             className: 'tile tile-large'}, [
             DOM.div({key: 'tileThumbnail',
                      className: 'tile-thumbnail',
                      style: {backgroundImage: readBackground(item.get('image'))}}),
             DOM.div({key: 'tileTitle',
                      className: 'tile-title'}, null, item.get('title'))])
  });

  LargeTile.Deck = Deck(LargeTile);

  // Exports:

  exports.LargeTile = LargeTile;

});
