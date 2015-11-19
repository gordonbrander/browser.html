/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*:: import * as type from '../../type/browser/perspective-ui' */

// Modes
export const EditWebView/*:type.EditWebView*/ = {mode: 'edit-web-view'};
export const ShowWebView/*:type.ShowWebView*/ = {mode: 'show-web-view'};
export const CreateWebView/*:type.CreateWebView*/ = {mode: 'create-web-view'};
export const SelectWebView/*:type.SelectWebView*/ = {mode: 'select-web-view'};
export const ShowTabs/*:type.ShowTabs*/ = {mode: 'show-tabs'};
export const initial = CreateWebView;