import {html} from "reflex"
import {Style, StyleSheet} from "../../common/style";

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
      , backgroundColor: '#eee'
      , borderRadius: '12px'
      , color: '#777'
      , fontSize: '12px'
      , lineHeight: '20px'
      , padding: '5px 15px'
      , position: 'absolute'
      , bottom: '10px'
      , right: '10px'
      }
    }
  );

const ISSUES_URL = 'https://github.com/servo/servo/issues/new';

export const view = (model, address) =>
  html.a
  ( { className: 'help'
    , style: styleSheet.base
    , onClick: () => address(Open(ISSUES_URL))
    }
    // @TODO localize this string
  , [ 'File a Bug'
    ]
  );