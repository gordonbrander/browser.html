/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../../common/style";
import hardcodedWallpaper from "../../../wallpaper.json";

export const init = () =>
  [ hardcodedWallpaper
  , Effects.none
  ];

// Open a tile as webview
const Choose = uri =>
  ( { type: 'Choose',
      uri
    }
  );

const WallpaperAction = action =>
  ( action.type === "Choose"
  ? action
  : tagged('Wallpaper', action)
  );

const styleSheet = StyleSheet.create
  ( { list:
      { cursor: 'pointer'
      , display: 'block'
      , color: '#999'
      , fontSize: '12px'
      , lineHeight: '20px'
      , position: 'absolute'
      , bottom: '10px'
      , right: '15px'
      }
    , choice:
      { borderRadius: '50%'
      , width: '10px'
      , height: '10px'
      }
    }
  );

const viewChoice = ({uri, color}, address) =>
  ( html.div
    ( { className: 'wallpaper-choice'
      , onClick: () => address(Choose(uri))
      , style: Style(styleSheet.choice, {backgroundColor: color})
      }
    )
  );

export const view = (model, address) =>
  html.div
  ( { className: 'wallpaper'
    , style: styleSheet.list
    }
  , model.order.map
    ( id =>
      thunk
      ( String(id)
      , viewChoice
      , model.entries[String(id)]
      , forward(address, WallpaperAction)
      )
    )
  );
