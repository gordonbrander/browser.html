/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {always, batch, merge, take, tag, tagged, move} from "../../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../../common/style";

export const init =
  ({uri, src, title}) =>
  ( { uri,
      src,
      title
    }
  );

// Open a tile as webview
const Open = uri =>
  ( { type: 'Open',
      uri
    }
  );

const styleSheet = StyleSheet.create
  ( { tile:
      { width: '160px'
      }
    , image:
      { backgroundColor: '#fff'
      , backgroundSize: 'cover'
      , backgroundPosition: 'center center'
      , borderRadius: '12px'
      , height: '100px'
      , width: '160px'
      }
    , title:
      { fontSize: '14px'
      , lineHeight: '20px'
      , overflow: 'hidden'
      , textAlign: 'center'
      , textOverflow: 'ellipsis'
      , whiteSpace: 'nowrap'
      , width: '100%'
      }
    }
  );

export const view = (model, address) =>
  html.div
  ( { className: 'tile'
    , style: styleSheet.tile
    , onClick: () => address(Open(model.uri))
    }
  , [ html.div
      ( { className: 'tile-image'
        , style: Style
            ( styleSheet.image,
              { backgroundImage: `url(${model.src})`
              }
            )
        }
      )
    , html.div
      ( { className: 'tile-title'
        , style: styleSheet.title
        }
      )
    ]
  );