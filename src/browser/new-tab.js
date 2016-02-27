/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {merge, tagged} from "../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../common/style";
import * as Unknown from "../common/unknown";

import * as Tiles from './new-tab/tiles';

const TilesAction = action =>
  ( action.type === "Open"
  ? action
  : tagged('Tiles', action)
  );

export const Show = {type: "Show"};
export const Hide = {type: "Hide"};

export const init = () =>
  {
    const [tiles, tilesFx] = Tiles.init();
    return (
      [
        { isShown: false
        , tiles
        }
        , tilesFx
      ]
    );
  }

export const update = (model, action) =>
  ( action.type === "Show"
  ? [ merge(model, {isShown: true}), Effects.none ]
  : action.type === "Hide"
  ? [ merge(model, {isShown: false}), Effects.none ]
  : Unknown.update(model, action)
  );

export const styleSheet =
  StyleSheet.create
  ( { base:
      { background: '#fff'
      , width: '100%'
      , height: '100%'
      , position: 'absolute'
      }
    , shown:
      {}
    , hidden:
      { display: 'none'
      }
    }
  );

export const view = (model, address) =>
  html.div
  ( { className: 'newtab'
    , style: Style
      ( styleSheet.base
      , ( model.isShown
        ? styleSheet.shown
        : styleSheet.hidden
        )
      )
    }
  , [
      thunk
      ( 'tiles'
      , Tiles.view
      , model.tiles
      , forward(address, TilesAction)
      )
    ]
  );