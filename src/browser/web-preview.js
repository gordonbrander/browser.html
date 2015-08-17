/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  'use strict';

  const {Record, Union, List, Maybe, Any} = require('../common/typed');
  const {html, render} = require('reflex');
  const WebView = require('./web-view');
  const Focusable = require('../common/focusable');
  const {Style, StyleSheet} = require('../common/style');
  const {getDomainName} = require('../common/url-helper');
  const Favicon = require('../common/favicon');
  const Selector = require('../common/selector');
  const Theme = require('./theme');

  const Create = Record({
    description: 'Create a new web view'
  }, 'Preview.Create');
  exports.Create = Create;

  const Close = event => {
    if (event.button === 1) {
      event.stopPropagation();
      return WebView.Close();
    }
    return null;
  }


  // View


  const styleControls = StyleSheet.create({
    panel: {
      position: 'absolute',
      right: '6px',
      top: '6px'
    },
    button: {
      color: 'inherit',
      lineHeight: '16px',
      fontFamily: 'FontAwesome',
      textAlign: 'center',
      fontSize: 16,
      verticalAlign: 'middle',
      cursor: 'default'
    }
  });

  const DashboardIcon = '\uf067';

  const viewControls = (theme, address) => html.div({
    style: styleControls.panel
  }, [
    html.button({
      key: 'dashboard-button',
      style: styleControls.button,
      onClick: address.pass(Create)
    }, DashboardIcon)
  ]);
  exports.viewControls = viewControls;

  const stylePreview = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
      color: '#444',
      float: 'left',
      height: '300px',
      margin: '0 10px',
      overflow: 'hidden',
      position: 'relative',
      'scrollSnapCoordinate': '50% 50%',
      width: '240px'
    },
    ghost: {
      backgroundColor: 'transparent',
      border: '3px dashed rgba(255, 255, 255, 0.2)',
      boxShadow: 'none'
    },
    create: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      boxShadow: 'none',
      color: '#fff',
      fontFamily: 'FontAwesome',
      fontSize: 36,
      lineHeight: '300px',
      textAlign: 'center',
    },
    selected: {
      boxShadow: '0 0 0 6px #4A90E2'
    },
    header: {
      height: '24px',
      lineHeight: '24px',
      padding: '0px 24px 0px 10px',
      overflow: 'hidden',
      position: 'relative',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    icon: {
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '3px',
      position: 'absolute',
      right: '4px',
      top: '4px',
      width: '16px',
      height: '16px',
    },
    image: {
      backgroundColor: '#DDD',
      backgroundImage: null,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      height: '150px',
      marginBottom: '14px',
      position: 'relative',
      width: '240px',
    },
    screenshot: {
      backgroundColor: '#DDD',
      backgroundImage: null,
      backgroundPosition: 'center top',
      backgroundSize: 'cover',
      height: '276px',
      width: '240px'
    },
    imageLoader: {
      position: 'absolute',
      left: 0,
      zIndex: -1,
      width: 'inherit',
      height: 'inherit'
    },
    description: {
      fontSize: '12px',
      lineHeight: '18px',
      height: '90px',
      margin: '0px 10px',
      overflow: 'hidden',
      whiteSpace: 'normal'
    }
  });

  const viewContentsHeroTitleDescription = (title, icon, hero, description, theme) => [
    html.header({
        key: 'header',
        style: Style(stylePreview.header, {
          backgroundColor: theme.shell,
          color: theme.shellText
        }),
      }, title),
    html.span({
      key: 'icon',
      alt: '',
      style: Style(stylePreview.icon, {
        backgroundImage: `url(${icon})`
      })
    }),
    html.div({
      style: Style(stylePreview.image, {
        backgroundImage: `url(${hero})`
      })
    }, [
      html.img({
        key: 'image',
        src: hero,
        alt: '',
        style: stylePreview.imageLoader,
        onLoad: event => URL.revokeObjectURL(event.target.src)
      })
    ]),
    html.p({
      key: 'description',
      style: stylePreview.description
    }, description)
  ];

  const viewContentsScreenshot = (title, icon, screenshot, theme) => [
    html.header({
        key: 'header',
        style: Style(stylePreview.header, {
          backgroundColor: theme.shell,
          color: theme.shellText
        }),
      }, title),
    html.span({
      key: 'icon',
      alt: '',
      style: Style(stylePreview.icon, {
        backgroundImage: `url(${icon})`
      })
    }),
    html.div({
      style: Style(stylePreview.screenshot, {
        backgroundImage: `url(${screenshot})`
      })
    }, [
      html.img({
        key: 'image',
        src: screenshot,
        alt: '',
        style: stylePreview.imageLoader,
        onLoad: event => URL.revokeObjectURL(event.target.src)
      })
    ])
  ];

  const viewPreview = (loader, page, isSelected, address) => {
    const hero = page.hero.get(0);
    const title = page.label || page.title;
    const name = page.name || getDomainName(loader.uri);
    const theme = Theme.read(page.pallet);
    const icon = page.faviconURL || Favicon.getFallback(loader.uri);

    const previewContents =
      hero && title && page.description ?
        viewContentsHeroTitleDescription(title, icon, hero, page.description, theme) :
        viewContentsScreenshot(title, icon, page.thumbnail, theme);

    return html.div({
      className: 'card',
      style: Style(stylePreview.card,
                   isSelected && stylePreview.selected),
      onClick: address.pass(Focusable.Focus),
      onMouseUp: address.pass(Close)
    }, previewContents);
  };
  exports.viewPreview = viewPreview;

  const createPreviewIcon = '\uf067';

  const createPreview = html.div({
    className: 'card',
    style: Style(stylePreview.card, stylePreview.create)
  }, createPreviewIcon);

  const ghostPreview = html.div({
    className: 'card',
    style: Style(stylePreview.card, stylePreview.ghost)
  });

  const style = StyleSheet.create({
    scroller: {
      backgroundColor: '#273340',
      height: '100vh',
      width: '100vw',
      scrollSnapType: 'proximity',
      scrollSnapDestination: '50% 50%',
      overflowX: 'auto',
      position: 'absolute',
      top: 0,
      zIndex: 0,
      MozWindowDragging: 'drag',
    },
    previews: {
      // This is important. We need previews to make space around itself.
      // Margin doesn't play well with scroll -- the right-hand edge will get
      // cut off, so we turn on the traditional CSS box model and use padding.
      boxSizing: 'content-box',
      width: '100vw',
      // Fixed height to contain floats.
      height: '300px',
      padding: 'calc(50vh - 150px) 200px 0 200px',
      margin: '0 auto',
    }
  });


  const viewPreviews = (loaders, pages, selected, address) =>
    loaders
      .map((loader, index) =>
        render(`Preview@${loader.id}`, viewPreview,
               loader, pages.get(index),
               index === selected,
               address.forward(action =>
                                WebView.ByID({id: loader.id, action}))));

  const viewContainer = (theme, ...children) =>
    // Set the width of the previews element to match the width of each card
    // plus padding.
    html.div({key: 'preview-container', style: style.scroller}, [
      html.div({style: Style(style.previews, {
        width: children.length * 260
      })}, children)
    ]);

  const viewInEditMode = (loaders, pages, selected, theme, address) =>
    viewContainer(theme, createPreview, ...viewPreviews(loaders, pages, selected, address));

  const viewInCreateMode = (loaders, pages, selected, theme, address) =>
    // Pass selected as `-1` so none is highlighted.
    viewContainer(theme, ghostPreview, ...viewPreviews(loaders, pages, -1, address));

  const view = (mode, ...etc) =>
    mode === 'create-web-view' ? viewInCreateMode(...etc) :
    viewInEditMode(...etc);
  exports.view = view;
