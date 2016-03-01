/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {merge, tag, tagged} from "../../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../../common/style";
import {cursor} from "../../common/cursor";
import * as Unknown from "../../common/unknown";

import * as Tiles from './newtab/tiles';
import * as Wallpaper from './newtab/wallpaper';
import * as Help from './newtab/help';

const WallpaperAction = tag('Wallpaper');

const TilesAction = action =>
  ( action.type === "Open"
  ? action
  : tagged('Tiles', action)
  );

export const init = () =>
  {
    const [tiles, tilesFx] = Tiles.init();
    const [wallpaper, wallpaperFx] = Wallpaper.init();
    return (
      [
        { wallpaper
        , tiles
        }
      , Effects.batch
        ( [ tilesFx.map(TilesAction)
          , wallpaperFx.map(WallpaperAction)
          ]
        )
      ]
    );
  }

const updateWallpaper = cursor({
  get: model => model.wallpaper,
  set: (model, wallpaper) => merge(model, {wallpaper}),
  update: Wallpaper.update,
  tag: WallpaperAction
});

export const update = (model, action) =>
  ( action.type === 'Wallpaper'
  ? updateWallpaper(model, action.source)
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

const readWallpaper = ({src, color}) =>
  (
    { backgroundImage:
      ( src
      ? `url(${src})`
      : 'none'
      )
    , backgroundColor: color
    , backgroundSize: 'cover'
    , backgroundRepeat: 'no-repeat'
    , backgroundPosition: 'center center'
    }
  );

export const view = ({wallpaper, tiles}, address) => {
  const activeWallpaper = Wallpaper.active(wallpaper);
  return (
    html.div
    ( { className: 'newtab'
      , style: Style
        ( styleSheet.base
        , readWallpaper(activeWallpaper)
        )
      }
    , [ thunk
        ( 'tiles'
        , Tiles.view
        , tiles
        , forward(address, TilesAction)
        , activeWallpaper.isDark
        )
      , thunk
        ( 'wallpaper'
        , Wallpaper.view
        , wallpaper
        , forward(address, WallpaperAction)
        )
      , thunk
        ( 'help'
        , Help.view
        , null
        , forward(address, TilesAction)
        , activeWallpaper.isDark
        )
      ]
    )
  )
}
