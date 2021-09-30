'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compositionApi = require('@vue/composition-api');
var core = require('@vue-storefront/core');
var vueDemi = require('vue-demi');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function usePaymentSessionFactory(factoryParams) {
    return function usePaymentSession(ssrKey) {
        var _this = this;
        if (ssrKey === void 0) { ssrKey = 'usePaymentSession'; }
        var paymentSession = core.sharedRef({}, "usePaymentSession-paymentSession-" + ssrKey);
        var loading = core.sharedRef(false, "usePaymentSession-loading-" + ssrKey);
        var error = core.sharedRef({
            load: null,
        }, "usePaymentSession-error-" + ssrKey);
        // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
        var _factoryParams = core.configureFactoryParams(factoryParams);
        var load = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        core.Logger.debug("usePaymentSession/" + ssrKey + "/load");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        loading.value = true;
                        _a = paymentSession;
                        return [4 /*yield*/, _factoryParams.load(params)];
                    case 2:
                        _a.value = _b.sent();
                        error.value.load = null;
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        error.value.load = err_1;
                        core.Logger.error("usePaymentSession/" + ssrKey + "/load", err_1);
                        return [3 /*break*/, 5];
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return {
            paymentSession: vueDemi.computed(function () { return paymentSession.value; }),
            loading: vueDemi.computed(function () { return loading.value; }),
            error: vueDemi.computed(function () { return error.value; }),
            load: load,
        };
    };
}

var factoryParams = {
    load: function (context, params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, context.$applepay.api.getPaymentSession(params)];
        });
    }); },
};
var usePaymentSession = usePaymentSessionFactory(factoryParams);

core.track('VSFApplePay');

//

const lineItemsToDisplay = ["subtotal", "shipping", "tax"];

var script = {
  name: "ApplePayButton",
  props: {
    totals: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "buy",
      validator: function (value) {
        return (
          [
            "plain",
            "buy",
            "set-up",
            "donate",
            "check-out",
            "book",
            "subscribe",
          ].indexOf(value) !== -1
        );
      },
    },
    color: {
      type: String,
      required: false,
      default: "black",
      validator: function (value) {
        return ["black", "white"].indexOf(value) !== -1;
      },
    },
    withLine: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { $applepay } = core.useVSFContext();
    const {
      paymentSession,
      load: loadPaymentSession,
      error,
    } = usePaymentSession();

    const {
      merchantId,
      currencyCode,
      countryCode,
      supportedNetworks,
      merchantCapabilities,
    } = $applepay.config;
    const canMakePayments = compositionApi.ref(false);
    const session = compositionApi.ref(null);
    const buttonClasses = compositionApi.computed(() => {
      if (props.type === "buy") {
        return `apple-pay-button-with-text apple-pay-button-${props.color}${
          props.withLine ? "-with-line" : ""
        }-with-text`;
      } else {
        return `apple-pay-button apple-pay-${
          props.type
        }-button apple-pay-button-${props.color}${
          props.withLine ? "-with-line" : ""
        }`;
      }
    });

    const lineItems = compositionApi.computed(() => {
      const lineItems = [];

      for (const key in props.totals) {
        if (Object.hasOwnProperty.call(props.totals, key)) {
          const amount = props.totals[key];

          if (lineItemsToDisplay.includes(key)) {
            lineItems.push({
              label: key,
              type: "final",
              amount: amount.toFixed(2),
            });
          }
        }
      }

      return lineItems;
    });

    const total = compositionApi.computed(() => props.totals?.total || 0);

    const setupButton = async () => {
      try {
        const _canMakePayments = await window.ApplePaySession.canMakePayments(
          merchantId
        );

        if (_canMakePayments) {
          canMakePayments.value = true;
        }
      } catch (err) {
        emit("error", err);
      }
    };

    const onValidateMerchant = async (event) => {
      // 1. You call your server, passing it the URL from the event’s validationURL property.
      // 2. Your server uses the validation URL to request a session from the Apple Pay server,
      //    as described in Requesting an Apple Pay Payment Session.
      //    Never send the request for a merchant session from the client.
      // 3. In response, your server receives an opaque merchant session object.
      // 4. You pass the merchant session object to your Apple Pay session’s
      //    completeMerchantValidation method. You can use the merchant session object a single time.
      //    It expires five minutes after it is created.

      try {
        await loadPaymentSession({ validationURL: event.validationURL });

        if (error.value.load) {
          throw error.value.load;
        }

        session.value.completeMerchantValidation(paymentSession.value);
      } catch (err) {
        emit("error", err);
      }
    };

    const onPaymentAuthorized = (event) => {
      // The onpaymentauthorized function must complete the payment
      // and respond by calling completePayment before the 30 second timeout,
      // after which a message appears stating that the payment could not be completed.

      const paymentToken = event.payment?.token;

      if (paymentToken) {
        session.value.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        });
        emit("success", paymentToken);
      } else {
        session.value.completePayment({
          status: window.ApplePaySession.STATUS_FAILURE,
        });
        emit("error", event);
      }
    };

    const onCancel = (event) => {
      session.value.abort();
      emit("error", "Aborted");
    };

    const onClick = async (e) => {
      if (props.disabled) {
        return;
      }
      emit("click");
      const request = {
        countryCode,
        currencyCode,
        supportedNetworks,
        merchantCapabilities,
        total: {
          label: "Total",
          amount: total.value.toFixed(2),
        },
        lineItems: lineItems.value,
      };
      session.value = new window.ApplePaySession(3, request);
      session.value.onvalidatemerchant = onValidateMerchant;
      session.value.onpaymentauthorized = onPaymentAuthorized;
      session.value.oncancel = onCancel;
      session.value.begin();
    };

    compositionApi.onMounted(() => {
      if (merchantId && window.ApplePaySession) {
        setupButton();
      }
    });

    return {
      canMakePayments,
      buttonClasses,
      onClick,
    };
  },
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.canMakePayments
    ? _c(
        "div",
        { class: _vm.buttonClasses, on: { click: _vm.onClick } },
        [
          _vm._t(
            "default",
            function() {
              return [
                _vm.type === "buy"
                  ? _c("span", { staticClass: "text" }, [
                      _vm._v(_vm._s(_vm.$t("Buy with")))
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("span", { staticClass: "logo" })
              ]
            },
            { type: _vm.type }
          )
        ],
        2
      )
    : _vm._e()
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-c5da8dba_0", { source: "\n@supports (-webkit-appearance: -apple-pay-button) {\n  /* Template for logo only button (height independent). */\n.apple-pay-button[data-v-c5da8dba] {\n    display: block;\n    cursor: pointer;\n    -webkit-appearance: -apple-pay-button;\n}\n.apple-pay-button-black[data-v-c5da8dba] {\n    -apple-pay-button-style: black;\n}\n.apple-pay-button-black-with-line[data-v-c5da8dba] {\n    -apple-pay-button-style: black-outline;\n}\n.apple-pay-button-white[data-v-c5da8dba] {\n    -apple-pay-button-style: white;\n}\n.apple-pay-button-white-with-line[data-v-c5da8dba] {\n    -apple-pay-button-style: white-outline;\n}\n  /* Template for \"Buy with\" button with height: 32 */\n.apple-pay-button-with-text[data-v-c5da8dba] {\n    display: block;\n    cursor: pointer;\n    -webkit-appearance: -apple-pay-button;\n    -apple-pay-button-type: buy;\n}\n.apple-pay-button-with-text > *[data-v-c5da8dba] {\n    display: none;\n}\n.apple-pay-button-black-with-text[data-v-c5da8dba] {\n    -apple-pay-button-style: black;\n}\n.apple-pay-button-black-with-line-with-text[data-v-c5da8dba] {\n    -apple-pay-button-style: black-outline;\n}\n.apple-pay-button-white-with-text[data-v-c5da8dba] {\n    -apple-pay-button-style: white;\n}\n.apple-pay-button-white-with-line-with-text[data-v-c5da8dba] {\n    -apple-pay-button-style: white-outline;\n}\n  /* Template for additional Apple Pay button types */\n.apple-pay-set-up-button[data-v-c5da8dba] {\n    -apple-pay-button-type: set-up;\n}\n.apple-pay-donate-button[data-v-c5da8dba] {\n    -apple-pay-button-type: donate;\n}\n.apple-pay-check-out-button[data-v-c5da8dba] {\n    -apple-pay-button-type: check-out;\n}\n.apple-pay-book-button[data-v-c5da8dba] {\n    -apple-pay-button-type: book;\n}\n.apple-pay-subscribe-button[data-v-c5da8dba] {\n    -apple-pay-button-type: subscribe;\n}\n}\n@supports not (-webkit-appearance: -apple-pay-button) {\n  /* Template for logo only button (height independent). */\n.apple-pay-button[data-v-c5da8dba] {\n    display: block;\n    background-size: 100% 60%;\n    background-repeat: no-repeat;\n    background-position: 50% 50%;\n    border-radius: 5px;\n    padding: 0px;\n    box-sizing: border-box;\n    min-width: 200px;\n    min-height: 32px;\n    max-height: 64px;\n}\n.apple-pay-button-black[data-v-c5da8dba] {\n    background-image: -webkit-named-image(apple-pay-logo-white);\n    background-color: black;\n}\n.apple-pay-button-white[data-v-c5da8dba] {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n}\n.apple-pay-button-white-with-line[data-v-c5da8dba] {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n    border: 0.5px solid black;\n}\n  /* Template for \"Buy with\" button with height: 32 */\n.apple-pay-button-with-text[data-v-c5da8dba] {\n    --apple-pay-scale: 1; /* (height / 32) */\n    display: flex;\n    justify-content: center;\n    font-size: 12px;\n    border-radius: 5px;\n    padding: 0px;\n    box-sizing: border-box;\n    min-width: 200px;\n    min-height: 32px;\n    max-height: 64px;\n}\n.apple-pay-button-black-with-text[data-v-c5da8dba] {\n    background-color: black;\n    color: white;\n}\n.apple-pay-button-white-with-text[data-v-c5da8dba] {\n    background-color: white;\n    color: black;\n}\n.apple-pay-button-white-with-line-with-text[data-v-c5da8dba] {\n    background-color: white;\n    color: black;\n    border: 0.5px solid black;\n}\n.apple-pay-button-with-text.apple-pay-button-black-with-text > .logo[data-v-c5da8dba] {\n    background-image: -webkit-named-image(apple-pay-logo-white);\n    background-color: black;\n}\n.apple-pay-button-with-text.apple-pay-button-white-with-text > .logo[data-v-c5da8dba] {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n}\n.apple-pay-button-with-text.apple-pay-button-white-with-line-with-text\n    > .logo[data-v-c5da8dba] {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n}\n.apple-pay-button-with-text > .text[data-v-c5da8dba] {\n    font-family: -apple-system;\n    font-size: calc(1em * var(--apple-pay-scale));\n    font-weight: 300;\n    align-self: center;\n    margin-right: calc(2px * var(--apple-pay-scale));\n}\n.apple-pay-button-with-text > .logo[data-v-c5da8dba] {\n    width: calc(35px * var(--scale));\n    height: 100%;\n    background-size: 100% 60%;\n    background-repeat: no-repeat;\n    background-position: 0 50%;\n    margin-left: calc(2px * var(--apple-pay-scale));\n    border: none;\n}\n}\n", map: {"version":3,"sources":["/Users/dmytro/work/aws/focus-next-theme/packages/vsf-apple-pay/src/components/ApplePayButton.vue"],"names":[],"mappings":";AAsNA;EACA,wDAAA;AACA;IACA,cAAA;IACA,eAAA;IACA,qCAAA;AACA;AACA;IACA,8BAAA;AACA;AACA;IACA,sCAAA;AACA;AACA;IACA,8BAAA;AACA;AACA;IACA,sCAAA;AACA;EACA,mDAAA;AACA;IACA,cAAA;IACA,eAAA;IACA,qCAAA;IACA,2BAAA;AACA;AACA;IACA,aAAA;AACA;AACA;IACA,8BAAA;AACA;AACA;IACA,sCAAA;AACA;AACA;IACA,8BAAA;AACA;AACA;IACA,sCAAA;AACA;EACA,mDAAA;AACA;IACA,8BAAA;AACA;AACA;IACA,8BAAA;AACA;AACA;IACA,iCAAA;AACA;AACA;IACA,4BAAA;AACA;AACA;IACA,iCAAA;AACA;AACA;AAEA;EACA,wDAAA;AACA;IACA,cAAA;IACA,yBAAA;IACA,4BAAA;IACA,4BAAA;IACA,kBAAA;IACA,YAAA;IACA,sBAAA;IACA,gBAAA;IACA,gBAAA;IACA,gBAAA;AACA;AACA;IACA,2DAAA;IACA,uBAAA;AACA;AACA;IACA,2DAAA;IACA,uBAAA;AACA;AACA;IACA,2DAAA;IACA,uBAAA;IACA,yBAAA;AACA;EACA,mDAAA;AACA;IACA,oBAAA,EAAA,kBAAA;IACA,aAAA;IACA,uBAAA;IACA,eAAA;IACA,kBAAA;IACA,YAAA;IACA,sBAAA;IACA,gBAAA;IACA,gBAAA;IACA,gBAAA;AACA;AACA;IACA,uBAAA;IACA,YAAA;AACA;AACA;IACA,uBAAA;IACA,YAAA;AACA;AACA;IACA,uBAAA;IACA,YAAA;IACA,yBAAA;AACA;AACA;IACA,2DAAA;IACA,uBAAA;AACA;AACA;IACA,2DAAA;IACA,uBAAA;AACA;AACA;;IAEA,2DAAA;IACA,uBAAA;AACA;AACA;IACA,0BAAA;IACA,6CAAA;IACA,gBAAA;IACA,kBAAA;IACA,gDAAA;AACA;AACA;IACA,gCAAA;IACA,YAAA;IACA,yBAAA;IACA,4BAAA;IACA,0BAAA;IACA,+CAAA;IACA,YAAA;AACA;AACA","file":"ApplePayButton.vue","sourcesContent":["<template>\n  <div v-if=\"canMakePayments\" :class=\"buttonClasses\" @click=\"onClick\">\n    <slot :type=\"type\">\n      <span v-if=\"type === 'buy'\" class=\"text\">{{ $t(\"Buy with\") }}</span>\n      <span class=\"logo\" />\n    </slot>\n  </div>\n</template>\n\n<script>\nimport { ref, computed, onMounted } from \"@vue/composition-api\";\nimport { useVSFContext } from \"@vue-storefront/core\";\nimport { usePaymentSession } from \"@absolute-web/vsf-apple-pay\";\n\nconst lineItemsToDisplay = [\"subtotal\", \"shipping\", \"tax\"];\n\nexport default {\n  name: \"ApplePayButton\",\n  props: {\n    totals: {\n      type: Object,\n      required: true,\n    },\n    type: {\n      type: String,\n      required: false,\n      default: \"buy\",\n      validator: function (value) {\n        return (\n          [\n            \"plain\",\n            \"buy\",\n            \"set-up\",\n            \"donate\",\n            \"check-out\",\n            \"book\",\n            \"subscribe\",\n          ].indexOf(value) !== -1\n        );\n      },\n    },\n    color: {\n      type: String,\n      required: false,\n      default: \"black\",\n      validator: function (value) {\n        return [\"black\", \"white\"].indexOf(value) !== -1;\n      },\n    },\n    withLine: {\n      type: Boolean,\n      required: false,\n      default: false,\n    },\n    disabled: {\n      type: Boolean,\n      required: false,\n      default: false,\n    },\n  },\n  setup(props, { emit }) {\n    const { $applepay } = useVSFContext();\n    const {\n      paymentSession,\n      load: loadPaymentSession,\n      error,\n    } = usePaymentSession();\n\n    const {\n      merchantId,\n      currencyCode,\n      countryCode,\n      supportedNetworks,\n      merchantCapabilities,\n    } = $applepay.config;\n    const canMakePayments = ref(false);\n    const session = ref(null);\n    const buttonClasses = computed(() => {\n      if (props.type === \"buy\") {\n        return `apple-pay-button-with-text apple-pay-button-${props.color}${\n          props.withLine ? \"-with-line\" : \"\"\n        }-with-text`;\n      } else {\n        return `apple-pay-button apple-pay-${\n          props.type\n        }-button apple-pay-button-${props.color}${\n          props.withLine ? \"-with-line\" : \"\"\n        }`;\n      }\n    });\n\n    const lineItems = computed(() => {\n      const lineItems = [];\n\n      for (const key in props.totals) {\n        if (Object.hasOwnProperty.call(props.totals, key)) {\n          const amount = props.totals[key];\n\n          if (lineItemsToDisplay.includes(key)) {\n            lineItems.push({\n              label: key,\n              type: \"final\",\n              amount: amount.toFixed(2),\n            });\n          }\n        }\n      }\n\n      return lineItems;\n    });\n\n    const total = computed(() => props.totals?.total || 0);\n\n    const setupButton = async () => {\n      try {\n        const _canMakePayments = await window.ApplePaySession.canMakePayments(\n          merchantId\n        );\n\n        if (_canMakePayments) {\n          canMakePayments.value = true;\n        }\n      } catch (err) {\n        emit(\"error\", err);\n      }\n    };\n\n    const onValidateMerchant = async (event) => {\n      // 1. You call your server, passing it the URL from the event’s validationURL property.\n      // 2. Your server uses the validation URL to request a session from the Apple Pay server,\n      //    as described in Requesting an Apple Pay Payment Session.\n      //    Never send the request for a merchant session from the client.\n      // 3. In response, your server receives an opaque merchant session object.\n      // 4. You pass the merchant session object to your Apple Pay session’s\n      //    completeMerchantValidation method. You can use the merchant session object a single time.\n      //    It expires five minutes after it is created.\n\n      try {\n        await loadPaymentSession({ validationURL: event.validationURL });\n\n        if (error.value.load) {\n          throw error.value.load;\n        }\n\n        session.value.completeMerchantValidation(paymentSession.value);\n      } catch (err) {\n        emit(\"error\", err);\n      }\n    };\n\n    const onPaymentAuthorized = (event) => {\n      // The onpaymentauthorized function must complete the payment\n      // and respond by calling completePayment before the 30 second timeout,\n      // after which a message appears stating that the payment could not be completed.\n\n      const paymentToken = event.payment?.token;\n\n      if (paymentToken) {\n        session.value.completePayment({\n          status: window.ApplePaySession.STATUS_SUCCESS,\n        });\n        emit(\"success\", paymentToken);\n      } else {\n        session.value.completePayment({\n          status: window.ApplePaySession.STATUS_FAILURE,\n        });\n        emit(\"error\", event);\n      }\n    };\n\n    const onCancel = (event) => {\n      session.value.abort();\n      emit(\"error\", \"Aborted\");\n    };\n\n    const onClick = async (e) => {\n      if (props.disabled) {\n        return;\n      }\n      emit(\"click\");\n      const request = {\n        countryCode,\n        currencyCode,\n        supportedNetworks,\n        merchantCapabilities,\n        total: {\n          label: \"Total\",\n          amount: total.value.toFixed(2),\n        },\n        lineItems: lineItems.value,\n      };\n      session.value = new window.ApplePaySession(3, request);\n      session.value.onvalidatemerchant = onValidateMerchant;\n      session.value.onpaymentauthorized = onPaymentAuthorized;\n      session.value.oncancel = onCancel;\n      session.value.begin();\n    };\n\n    onMounted(() => {\n      if (merchantId && window.ApplePaySession) {\n        setupButton();\n      }\n    });\n\n    return {\n      canMakePayments,\n      buttonClasses,\n      onClick,\n    };\n  },\n};\n</script>\n\n<style scoped>\n@supports (-webkit-appearance: -apple-pay-button) {\n  /* Template for logo only button (height independent). */\n  .apple-pay-button {\n    display: block;\n    cursor: pointer;\n    -webkit-appearance: -apple-pay-button;\n  }\n  .apple-pay-button-black {\n    -apple-pay-button-style: black;\n  }\n  .apple-pay-button-black-with-line {\n    -apple-pay-button-style: black-outline;\n  }\n  .apple-pay-button-white {\n    -apple-pay-button-style: white;\n  }\n  .apple-pay-button-white-with-line {\n    -apple-pay-button-style: white-outline;\n  }\n  /* Template for \"Buy with\" button with height: 32 */\n  .apple-pay-button-with-text {\n    display: block;\n    cursor: pointer;\n    -webkit-appearance: -apple-pay-button;\n    -apple-pay-button-type: buy;\n  }\n  .apple-pay-button-with-text > * {\n    display: none;\n  }\n  .apple-pay-button-black-with-text {\n    -apple-pay-button-style: black;\n  }\n  .apple-pay-button-black-with-line-with-text {\n    -apple-pay-button-style: black-outline;\n  }\n  .apple-pay-button-white-with-text {\n    -apple-pay-button-style: white;\n  }\n  .apple-pay-button-white-with-line-with-text {\n    -apple-pay-button-style: white-outline;\n  }\n  /* Template for additional Apple Pay button types */\n  .apple-pay-set-up-button {\n    -apple-pay-button-type: set-up;\n  }\n  .apple-pay-donate-button {\n    -apple-pay-button-type: donate;\n  }\n  .apple-pay-check-out-button {\n    -apple-pay-button-type: check-out;\n  }\n  .apple-pay-book-button {\n    -apple-pay-button-type: book;\n  }\n  .apple-pay-subscribe-button {\n    -apple-pay-button-type: subscribe;\n  }\n}\n\n@supports not (-webkit-appearance: -apple-pay-button) {\n  /* Template for logo only button (height independent). */\n  .apple-pay-button {\n    display: block;\n    background-size: 100% 60%;\n    background-repeat: no-repeat;\n    background-position: 50% 50%;\n    border-radius: 5px;\n    padding: 0px;\n    box-sizing: border-box;\n    min-width: 200px;\n    min-height: 32px;\n    max-height: 64px;\n  }\n  .apple-pay-button-black {\n    background-image: -webkit-named-image(apple-pay-logo-white);\n    background-color: black;\n  }\n  .apple-pay-button-white {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n  }\n  .apple-pay-button-white-with-line {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n    border: 0.5px solid black;\n  }\n  /* Template for \"Buy with\" button with height: 32 */\n  .apple-pay-button-with-text {\n    --apple-pay-scale: 1; /* (height / 32) */\n    display: flex;\n    justify-content: center;\n    font-size: 12px;\n    border-radius: 5px;\n    padding: 0px;\n    box-sizing: border-box;\n    min-width: 200px;\n    min-height: 32px;\n    max-height: 64px;\n  }\n  .apple-pay-button-black-with-text {\n    background-color: black;\n    color: white;\n  }\n  .apple-pay-button-white-with-text {\n    background-color: white;\n    color: black;\n  }\n  .apple-pay-button-white-with-line-with-text {\n    background-color: white;\n    color: black;\n    border: 0.5px solid black;\n  }\n  .apple-pay-button-with-text.apple-pay-button-black-with-text > .logo {\n    background-image: -webkit-named-image(apple-pay-logo-white);\n    background-color: black;\n  }\n  .apple-pay-button-with-text.apple-pay-button-white-with-text > .logo {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n  }\n  .apple-pay-button-with-text.apple-pay-button-white-with-line-with-text\n    > .logo {\n    background-image: -webkit-named-image(apple-pay-logo-black);\n    background-color: white;\n  }\n  .apple-pay-button-with-text > .text {\n    font-family: -apple-system;\n    font-size: calc(1em * var(--apple-pay-scale));\n    font-weight: 300;\n    align-self: center;\n    margin-right: calc(2px * var(--apple-pay-scale));\n  }\n  .apple-pay-button-with-text > .logo {\n    width: calc(35px * var(--scale));\n    height: 100%;\n    background-size: 100% 60%;\n    background-repeat: no-repeat;\n    background-position: 0 50%;\n    margin-left: calc(2px * var(--apple-pay-scale));\n    border: none;\n  }\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-c5da8dba";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

exports.ApplePayButton = __vue_component__;
//# sourceMappingURL=index.js.map
