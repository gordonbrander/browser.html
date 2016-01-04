/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {html, thunk, forward, Effects} from 'reflex';
import {asByID} from './web-views';
import * as WebView from './web-view';
import {Style, StyleSheet} from '../common/style';
import {readTitle, readFaviconURI} from './web-view';
import * as Toolbar from "./sidebar/toolbar";
import {cursor, merge, always} from "../common/prelude";
import * as Unknown from "../common/unknown";
import * as Stopwatch from "../common/stopwatch";
import * as Easing from "eased";


const style = StyleSheet.create({
  sidebar: {
    // WARNING: will slow down animations! (gecko)
    // boxShadow: 'rgba(0, 0, 0, 0.5) -50px 0 80px',
    backgroundColor: '#F0F2F5',
    borderTop: '1px solid #E8EBED',
    willChange: 'box-shadow',
    height: '32px',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    zIndex: 2 // @TODO This is a hack to avoid resizing new tab / edit tab views.
  },

  scrollbox: {
    width: '100%',
    height: `calc(100% - ${Toolbar.styleSheet.toolbar.height})`,
    boxSizing: 'border-box'
  },

  tab: {
    color: 'rgba(0,0,0,0.6)',
    float: 'left',
    MozWindowDragging: 'no-drag',
    height: '32px',
    lineHeight: '32px',
    fontSize: '12px',
    width: '200px',
    overflow: 'hidden',
    position: 'relative',
  },

  tabSelected: {
    backgroundColor: '#fff',
    color: '#000'
  },

  title: {
    display: 'block',
    margin: '0 10px 0 34px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  favicon: {
    borderRadius: '3px',
    left: '9px',
    position: 'absolute',
    top: '9px',
    width: '16px',
    height: '16px',
  },

  iconCreateTab: {
    MozWindowDragging: 'no-drag',
    color: 'rgba(0,0,0,0.8)',
    fontFamily: 'FontAwesome',
    fontSize: '18px',
    lineHeight: '30px',
    position: 'absolute',
    textAlign: 'center',
    bottom: 0,
    right: 0,
    width: '30px',
    height: '30px',
  },

  iconCreateTabDark: {
    color: 'rgba(255,255,255,0.8)',
  }
});


export const init = () => {
  const [toolbar, fx] = Toolbar.init()
  return [
    {
      isAttached: false,
      isOpen: false,
      animation: null,
      display: {
        x: 500,
        shadow: 0.5,
        spacing: 34,
        toolbarOpacity: 1,
        titleOpacity: 1
      },
      toolbar
    },
    fx.map(ToolbarAction)
  ]
}

export const Model =
  ({isAttached, isOpen, toolbar}) =>
  ({isAttached, isOpen, toolbar});

export const Attach = {type: "Attach"};
export const Detach = {type: "Detach"};
export const Open = {type: "Open"};
export const Close = {type: "Close"};
export const CreateWebView = {type: 'CreateWebView'};
const Animation = action => ({type: "Animation", action});
const AnimationEnd = always({type: "AnimationEnd"});

const toolbar = cursor({
  get: model => model.toolbar,
  set: (model, toolbar) => merge(model, {toolbar}),
  tag: ToolbarAction,
  update: Toolbar.step
});



const stopwatch = cursor({
  tag: Animation,
  get: model => model.animation,
  set: (model, animation) => merge(model, {animation}),
  update: Stopwatch.step
});

const interpolate = (from, to, progress) => merge(from, {
  x: Easing.float(from.x, to.x, progress),
  shadow: Easing.float(from.shadow, to.shadow, progress),
  spacing: Easing.float(from.spacing, to.spacing, progress),
  toolbarOpacity: Easing.float(from.toolbarOpacity, to.toolbarOpacity, progress),
  titleOpacity: Easing.float(from.titleOpacity, to.titleOpacity, progress)
})

const animationProjection = model =>
    model.isOpen
  ? {x: 0,
     shadow: 0.5,
     spacing: 34,
     toolbarOpacity: 1,
     titleOpacity: 1}
  : model.isAttached
  ? {x: 330,
     shadow: 0,
     spacing: 8,
     toolbarOpacity: 0,
     titleOpacity: 0}
  : {x: 500,
     shadow: 0.5,
     spacing: 34,
     toolbarOpacity: 1,
     titleOpacity: 1}

const animationDuration = model => model.isOpen ? 500 : 200;

const animate = (model, action) => {
  const [{animation}, fx] = stopwatch(model, action.action)
  const duration = animationDuration(model)

  // @TODO: We should not be guessing what is the starnig point
  // that makes no sense & is likely to be incorrect at a times.
  // To fix it we need to ditch this easing library in favor of
  // something that will give us more like spring physics.
  const begin
    = !model.isOpen
    ? {x: 0,
       shadow: 0.5,
       spacing: 34,
       toolbarOpacity: 1,
       titleOpacity: 1}
    : model.isAttached
    ? {x: 330,
       shadow: 0,
       spacing: 8,
       toolbarOpacity: 0,
       titleOpacity: 0}
    : {x: 500,
       shadow: 0.5,
       spacing: 34,
       toolbarOpacity: 0,
       titleOpacity: 1};

  const projection = animationProjection(model)


  return duration > animation.elapsed
    ? [ merge(model, {
          animation,
          display: Easing.ease
            ( Easing.easeOutCubic
            , interpolate
            , begin
            , projection
            , duration
            , animation.elapsed
            )
        })
      , fx
      ]
    : [ merge(model, {animation, display: projection})
      , fx.map(AnimationEnd)
      ]
}


export const step = (model, action) =>
    action.type === "Animation"
  ? animate(model, action)
  : action.type === "AnimationEnd"
  ? stopwatch(model, Stopwatch.End)
  : action.type === "Open"
  ? stopwatch(merge(model, {isOpen: true}), Stopwatch.Start)
  : action.type === "Close"
  ? stopwatch(merge(model, {isOpen: false}), Stopwatch.Start)
  : action.type === "Attach"
  ? toolbar(merge(model, {isAttached: true}), Toolbar.Attach)
  : action.type === "Detach"
  ? toolbar(merge(model, {isAttached: false}), Toolbar.Detach)
  : action.type === "Toolbar"
  ? toolbar(model, action.action)
  : Unknown.step(model, action)



const ToolbarAction = action =>
    action.type === "Attach"
  ? Attach
  : action.type === "Detach"
  ? Detach
  : action.type === "CreateWebView"
  ? CreateWebView
  : ({type: "Toolbar", action});

const Tabs = action =>
  ({type: "Tabs", action});

const viewImage = (uri, style) =>
  html.img({
    style: Style({
      backgroundImage: `url(${uri})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      border: 'none'
    }, style)
  });

const viewTab = (model, address, {titleOpacity}) =>
  html.div({
    className: 'sidebar-tab',
    style: Style(
      style.tab,
      model.isSelected && style.tabSelected
    ),
    onMouseDown: () => address(WebView.Select),
    onMouseUp: () => address(WebView.Activate)
  }, [
    thunk('favicon',
          viewImage,
          readFaviconURI(model),
          style.favicon),
    html.div({
      className: 'sidebar-tab-title',
      style: Style(
        style.title,
        {opacity: titleOpacity}
      )
    }, [
      // @TODO localize this string
      readTitle(model, 'Untitled')
    ])
  ]);


const viewSidebar = (key) => (model, {entries}, address) => {
  const tabs = forward(address, Tabs);
  const {display} = model;
  return html.div({
    key: key,
    className: key,
    style: style.sidebar
  }, [
    html.div({
      className: 'sidebar-tabs-scrollbox',
      style: style.scrollbox
    }, entries.map(entry =>
        thunk(entry.id, viewTab, entry, forward(tabs, asByID(entry.id)), display))),
    html.div({
      className: 'sidebar-create-tab-icon',
      style: style.iconCreateTab,
      onClick: () => address(CreateWebView)
    }, [''])
  ]);
}

export const view = viewSidebar('sidebar');
