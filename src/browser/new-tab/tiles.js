/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {always, batch, merge, take, tag, tagged, move} from "../../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../../common/style";
import * as Tile from './tile';
// @TODO hard-coded until we get history support in Servo.
import hardcodedTiles from '../../../tiles.json';
import * as Unknown from "../../common/unknown";
import {cursor} from "../../common/cursor";

export const init = () =>
  [ hardcodedTiles
  , Effects.none
  ];

const TileAction = tagged('Tile');

const styleSheet = StyleSheet.create
  ( { tiles:
      { width: '840px'
      // Hardcoded until we get flexbox in Servo
      , height: '480px'
      , overflow: 'hidden'
      , position: 'absolute'
      , left: 'calc(50% - (840px / 2))'
      , top: 'calc(50% - (480px / 2))'
      }
    }
  );

export const view = (model, address) =>
  html.div
  ( { className: 'tiles'
    , style: styleSheet.tiles
    }
  , model.order.map
    ( id =>
      thunk
      ( String(id)
      , Tile.view
      , model.entries[String(id)]
      , forward(address, TileAction)
      )
    )
  );