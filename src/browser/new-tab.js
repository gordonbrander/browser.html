/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {merge, tagged} from "../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../common/style";
import {compose} from '../lang/functional';
import * as Unknown from "../common/unknown";

import * as Tiles from './new-tab/tiles';
import * as Wallpaper from './new-tab/wallpaper';
import * as Help from './new-tab/help';

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
    const [wallpaper, wallpaperFx] = Wallpaper.init();
    return (
      [
        { isShown: false
        , wallpaper
        , tiles
        }
      , Effects.batch
        ( [ tilesFx
          , wallpaperFx
          ]
        )
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
      { backgroundColor: '#fff'
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

const readActive = ({entries, active}) =>
  ( entries[active] );

const readWallpaper = ({src, color}) =>
  (
    { backgroundImage: `url(${src})`
    , backgroundColor: color
    , backgroundSize: 'cover'
    , backgroundRepeat: 'no-repeat'
    , backgroundPosition: 'center center'
    }
  );

const readActiveWallpaper = compose(readWallpaper, readActive);

export const view = ({wallpaper, tiles, isShown}, address) =>
  html.div
  ( { className: 'newtab'
    , style: Style
      ( styleSheet.base
      , ( isShown
        ? styleSheet.shown
        : styleSheet.hidden
        )
      , readActiveWallpaper(wallpaper)
      )
    }
  , [ thunk
      ( 'tiles'
      , Tiles.view
      , tiles
      , forward(address, TilesAction)
      )
    , thunk
      ( 'wallpaper'
      , Wallpaper.view
      , wallpaper
      , forward(address, TilesAction)
      )
    , thunk
      ( 'help'
      , Help.view
      , null
      , forward(address, TilesAction)
      )
    ]
  );