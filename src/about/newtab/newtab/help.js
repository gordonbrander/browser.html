/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {html} from "reflex"
import {Style, StyleSheet} from "../../../common/style";
import * as Config from '../../../../browserhtml.json';

// Open a tile as webview
const Open = uri =>
  ( { type: 'Open',
      uri
    }
  );

const styleSheet = StyleSheet.create
  ( { base:
      { cursor: 'pointer'
      , display: 'block'
      , color: '#999'
      , fontSize: '12px'
      , lineHeight: '20px'
      , position: 'absolute'
      , bottom: '10px'
      , right: '15px'
      , textDecoration: 'none'
      }
    , textLight:
      { color: 'rgba(0,0,0,0.8)'
      }
    , textDark:
      { color: 'rgba(255,255,255,0.7)'
      }
    }
  );

export const view = (model, address, isDark) =>
  html.a
  ( { className: 'help'
    , style: Style
      ( styleSheet.base
      , ( isDark
        ? styleSheet.textDark
        : styleSheet.textLight
        )
      )
    , href: Config.issues_url
    }
    // @TODO localize this string
  , [ 'File a Bug'
    ]
  );