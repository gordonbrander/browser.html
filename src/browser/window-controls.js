/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define((require, exports, module) => {

  'use strict';

  const {Record, Maybe, Union} = require('typed-immutable/index');
  const {html} = require('reflex');
  const Embedding = require('common/embedding');
  const Theme = require('./theme');

  // Model

  const WindowControls = Record({
    theme: Theme,
    isFocused: Boolean
  }, 'WindowControls');

  // Actions

  const {SystemAction} = Embedding.Action;
  const Action = Union(SystemAction);
  Action.SystemAction = SystemAction;

  WindowControls.Action = Action;

  // Update

  // WindowControls only produces `SystemActions` and handling of those
  // are delegated to Embedding.
  WindowControls.update = (state, action) =>
    action.constructor === SystemAction ? Embedding.update(state, action) :
    state;

  // View

  const Color = String;
  const ButtonStyle = Record({
    backgroundColor: Color,
    color: Maybe(Color),
    display: 'inline-block',
    width: 12,
    height: 12,
    marginRight: 8,
    borderRadius: '50%'
  }, 'ControlButtonStyle');
  ButtonStyle.min = ButtonStyle({
    backgroundColor: '#FDBC40'
  });
  ButtonStyle.max = ButtonStyle({
    backgroundColor: '#33C748'
  });
  ButtonStyle.close = ButtonStyle({
    backgroundColor: '#FC5753'
  });
  ButtonStyle.unfocused = ButtonStyle({
    backgroundColor: 'hsl(0, 0%, 86%)'
  });

  const containerStyle = {
    position: 'absolute',
    top: 10,
    left: 10,
    lineHeight: '30px',
    verticalAlign: 'center',
    marginLeft: 7,
  };


  // Actions that will are send by window controls.
  const Close = SystemAction({type: 'shutdown-application'});
  const Minimize = SystemAction({type: 'minimize-native-window'});
  const Maximize = SystemAction({type: 'toggle-fullscreen-native-window'});

  WindowControls.view = ({isFocused}, theme, address) => html.div({
    key: 'WindowControls',
    style: containerStyle
  }, [
    html.div({
      key: 'WindowCloseButton',
      style: isFocused ? ButtonStyle.close.merge(theme.windowCloseButton) :
             ButtonStyle.unfocused,
      onClick: address.send(Close)
    }),
    html.div({
      key: 'WindowMinButton',
      style: isFocused ? ButtonStyle.min.merge(theme.windowMinButton) :
             ButtonStyle.unfocused,
      onClick: address.send(Minimize)
    }),
    html.div({
      key: 'WindowMaxButton',
      style: isFocused ? ButtonStyle.max.merge(theme.windowMaxButton) :
             ButtonStyle.unfocused,
      onClick: address.send(Maximize)
    })
  ]);

  module.exports = WindowControls;
});
