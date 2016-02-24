/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {always, batch, merge, take, tag, tagged, move} from "../common/prelude"
import {Effects, html, thunk, forward} from "reflex"
import {Style, StyleSheet} from "../common/style";
import * as Unknown from "../common/unknown";

export const Show = {type: "Show"};
export const Hide = {type: "Hide"};

export const init = () =>
  [ {isShown: false}
    , Effects.none
  ];

export const update = (model, action) =>
  ( action.type === "Show"
  ? [merge(model, {isShown: true}), Effects.none]
  : action.type === "Hide"
  ? [merge(model, {isShown: false}), Effects.none]
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
  );