/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {always, batch, merge, take, tag, tagged, move} from "../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../common/style";

export const init = () =>
  [ {isHidden: false}
    , Effects.none
  ];

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
      { display: 'block'
      }
    }
  );

export const view = (model, address) =>
  html.div
  ( { className: 'newtab'
    , style: Style
      ( styleSheet.base
      , ( model.isHidden
        ? styleSheet.hidden
        : styleSheet.shown
        )
      )
    }
  );