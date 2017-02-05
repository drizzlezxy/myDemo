(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require("jQuery"));
  else if (typeof define === 'function' && define.amd)
    define(["jQuery"], factory);
  else if (typeof exports === 'object')
    exports["PinchZomm"] = factory(require("jQuery"));
  else
    root["PinchZomm"] = factory(root["jQuery"]);
})(this, function (__WEBPACK_EXTERNAL_MODULE_1__) {
  return /******/ (function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};

    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {

      /******/ 		// Check if module is in cache
      /******/
      if (installedModules[moduleId])
      /******/      return installedModules[moduleId].exports;

      /******/ 		// Create a new module (and put it into the cache)
      /******/
      var module = installedModules[moduleId] = {
        /******/      exports: {},
        /******/      id: moduleId,
        /******/      loaded: false
        /******/
      };

      /******/ 		// Execute the module function
      /******/
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

      /******/ 		// Flag the module as loaded
      /******/
      module.loaded = true;

      /******/ 		// Return the exports of the module
      /******/
      return module.exports;
      /******/
    }


    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;

    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;

    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";

    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(0);
    /******/
  })
    /************************************************************************/
    /******/([
    /* 0 */
    /***/ function (module, exports, __webpack_require__) {

      var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
      'use strict';

      (function () {
        'use strict';

        var definePinchZoom = function definePinchZoom($) {

          /**
           * Pinch zoom using jQuery
           * @version 0.0.2
           * @author Manuel Stofer <mst@rtp.ch>
           * @param el
           * @param options
           * @constructor
           */
          var PinchZoom = function PinchZoom(el, options) {
              this.el = $(el);
              this.zoomFactor = 1;
              this.lastScale = 1;
              this.offset = {
                x: 0,
                y: 0
              };
              this.options = $.extend({}, this.defaults, options);
              this.setupMarkup();
              this.bindEvents();
              this.update();
              // default enable.
              this.enable();
            },
            sum = function sum(a, b) {
              return a + b;
            },
            isCloseTo = function isCloseTo(value, expected) {
              return value > expected - 0.01 && value < expected + 0.01;
            };

          PinchZoom.prototype = {

            defaults: {
              tapZoomFactor: 2,
              zoomOutFactor: 1.3,
              animationDuration: 300,
              maxZoom: 4,
              minZoom: 0.5,
              lockDragAxis: false,
              use2d: true,
              zoomStartEventName: 'pz_zoomstart',
              zoomEndEventName: 'pz_zoomend',
              dragStartEventName: 'pz_dragstart',
              dragEndEventName: 'pz_dragend',
              doubleTapEventName: 'pz_doubletap'
            },

            /**
             * Event handler for 'dragstart'
             * @param event
             */
            handleDragStart: function handleDragStart(event) {
              this.el.trigger(this.options.dragStartEventName);
              this.stopAnimation();
              this.lastDragPosition = false;
              this.hasInteraction = true;
              this.handleDrag(event);
            },

            /**
             * Event handler for 'drag'
             * @param event
             */
            handleDrag: function handleDrag(event) {

              if (this.zoomFactor > 1.0) {
                var touch = this.getTouches(event)[0];
                this.drag(touch, this.lastDragPosition);
                this.offset = this.sanitizeOffset(this.offset);
                this.lastDragPosition = touch;
              }
            },

            handleDragEnd: function handleDragEnd() {
              this.el.trigger(this.options.dragEndEventName);
              this.end();
            },

            /**
             * Event handler for 'zoomstart'
             * @param event
             */
            handleZoomStart: function handleZoomStart(event) {
              this.el.trigger(this.options.zoomStartEventName);
              this.stopAnimation();
              this.lastScale = 1;
              this.nthZoom = 0;
              this.lastZoomCenter = false;
              this.hasInteraction = true;
            },

            /**
             * Event handler for 'zoom'
             * @param event
             */
            handleZoom: function handleZoom(event, newScale) {

              // a relative scale factor is used
              var touchCenter = this.getTouchCenter(this.getTouches(event)),
                scale = newScale / this.lastScale;
              this.lastScale = newScale;

              // the first touch events are thrown away since they are not precise
              this.nthZoom += 1;
              if (this.nthZoom > 3) {

                this.scale(scale, touchCenter);
                this.drag(touchCenter, this.lastZoomCenter);
              }
              this.lastZoomCenter = touchCenter;
            },

            handleZoomEnd: function handleZoomEnd() {
              this.el.trigger(this.options.zoomEndEventName);
              this.end();
            },

            /**
             * Event handler for 'doubletap'
             * @param event
             */
            handleDoubleTap: function handleDoubleTap(event) {
              var center = this.getTouches(event)[0],
                zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
                startZoomFactor = this.zoomFactor,
                updateProgress = function (progress) {
                  this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
                }.bind(this);

              if (this.hasInteraction) {
                return;
              }
              if (startZoomFactor > zoomFactor) {
                center = this.getCurrentZoomCenter();
              }

              this.animate(this.options.animationDuration, updateProgress, this.swing);
              this.el.trigger(this.options.doubleTapEventName);
            },

            /**
             * Max / min values for the offset
             * @param offset
             * @return {Object} the sanitized offset
             */
            sanitizeOffset: function sanitizeOffset(offset) {
              var maxX = (this.zoomFactor - 1) * this.getContainerX(),
                maxY = (this.zoomFactor - 1) * this.getContainerY(),
                maxOffsetX = Math.max(maxX, 0),
                maxOffsetY = Math.max(maxY, 0),
                minOffsetX = Math.min(maxX, 0),
                minOffsetY = Math.min(maxY, 0);

              return {
                x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
                y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
              };
            },

            /**
             * Scale to a specific zoom factor (not relative)
             * @param zoomFactor
             * @param center
             */
            scaleTo: function scaleTo(zoomFactor, center) {
              this.scale(zoomFactor / this.zoomFactor, center);
            },

            /**
             * Scales the element from specified center
             * @param scale
             * @param center
             */
            scale: function scale(_scale, center) {
              _scale = this.scaleZoomFactor(_scale);
              this.addOffset({
                x: (_scale - 1) * (center.x + this.offset.x),
                y: (_scale - 1) * (center.y + this.offset.y)
              });
            },

            /**
             * Scales the zoom factor relative to current state
             * @param scale
             * @return the actual scale (can differ because of max min zoom factor)
             */
            scaleZoomFactor: function scaleZoomFactor(scale) {
              var originalZoomFactor = this.zoomFactor;
              this.zoomFactor *= scale;
              this.zoomFactor = Math.min(this.options.maxZoom, Math.max(this.zoomFactor, this.options.minZoom));
              return this.zoomFactor / originalZoomFactor;
            },

            /**
             * Drags the element
             * @param center
             * @param lastCenter
             */
            drag: function drag(center, lastCenter) {
              if (lastCenter) {
                if (this.options.lockDragAxis) {
                  // lock scroll to position that was changed the most
                  if (Math.abs(center.x - lastCenter.x) > Math.abs(center.y - lastCenter.y)) {
                    this.addOffset({
                      x: -(center.x - lastCenter.x),
                      y: 0
                    });
                  } else {
                    this.addOffset({
                      y: -(center.y - lastCenter.y),
                      x: 0
                    });
                  }
                } else {
                  this.addOffset({
                    y: -(center.y - lastCenter.y),
                    x: -(center.x - lastCenter.x)
                  });
                }
              }
            },

            /**
             * Calculates the touch center of multiple touches
             * @param touches
             * @return {Object}
             */
            getTouchCenter: function getTouchCenter(touches) {
              return this.getVectorAvg(touches);
            },

            /**
             * Calculates the average of multiple vectors (x, y values)
             */
            getVectorAvg: function getVectorAvg(vectors) {
              return {
                x: vectors.map(function (v) {
                  return v.x;
                }).reduce(sum) / vectors.length,
                y: vectors.map(function (v) {
                  return v.y;
                }).reduce(sum) / vectors.length
              };
            },

            /**
             * Adds an offset
             * @param offset the offset to add
             * @return return true when the offset change was accepted
             */
            addOffset: function addOffset(offset) {
              this.offset = {
                x: this.offset.x + offset.x,
                y: this.offset.y + offset.y
              };
            },

            sanitize: function sanitize() {
              if (this.zoomFactor < this.options.zoomOutFactor) {
                this.zoomOutAnimation();
              } else if (this.isInsaneOffset(this.offset)) {
                this.sanitizeOffsetAnimation();
              }
            },

            /**
             * Checks if the offset is ok with the current zoom factor
             * @param offset
             * @return {Boolean}
             */
            isInsaneOffset: function isInsaneOffset(offset) {
              var sanitizedOffset = this.sanitizeOffset(offset);
              return sanitizedOffset.x !== offset.x || sanitizedOffset.y !== offset.y;
            },

            /**
             * Creates an animation moving to a sane offset
             */
            sanitizeOffsetAnimation: function sanitizeOffsetAnimation() {
              var targetOffset = this.sanitizeOffset(this.offset),
                startOffset = {
                  x: this.offset.x,
                  y: this.offset.y
                },
                updateProgress = function (progress) {
                  this.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x);
                  this.offset.y = startOffset.y + progress * (targetOffset.y - startOffset.y);
                  this.update();
                }.bind(this);

              this.animate(this.options.animationDuration, updateProgress, this.swing);
            },

            /**
             * Zooms back to the original position,
             * (no offset and zoom factor 1)
             */
            zoomOutAnimation: function zoomOutAnimation() {
              var startZoomFactor = this.zoomFactor,
                zoomFactor = 1,
                center = this.getCurrentZoomCenter(),
                updateProgress = function (progress) {
                  this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
                }.bind(this);

              this.animate(this.options.animationDuration, updateProgress, this.swing);
            },

            /**
             * Updates the aspect ratio
             */
            updateAspectRatio: function updateAspectRatio() {
              this.setContainerY(this.getContainerX() / this.getAspectRatio());
            },

            /**
             * Calculates the initial zoom factor (for the element to fit into the container)
             * @return the initial zoom factor
             */
            getInitialZoomFactor: function getInitialZoomFactor() {
              // use .offsetWidth instead of width()
              // because jQuery-width() return the original width but Zepto-width() will calculate width with transform.
              // the same as .height()
              return this.container[0].offsetWidth / this.el[0].offsetWidth;
            },

            /**
             * Calculates the aspect ratio of the element
             * @return the aspect ratio
             */
            getAspectRatio: function getAspectRatio() {
              return this.el[0].offsetWidth / this.el[0].offsetHeight;
            },

            /**
             * Calculates the virtual zoom center for the current offset and zoom factor
             * (used for reverse zoom)
             * @return {Object} the current zoom center
             */
            getCurrentZoomCenter: function getCurrentZoomCenter() {

              // uses following formula to calculate the zoom center x value
              // offset_left / offset_right = zoomcenter_x / (container_x - zoomcenter_x)
              var length = this.container[0].offsetWidth * this.zoomFactor,
                offsetLeft = this.offset.x,
                offsetRight = length - offsetLeft - this.container[0].offsetWidth,
                widthOffsetRatio = offsetLeft / offsetRight,
                centerX = widthOffsetRatio * this.container[0].offsetWidth / (widthOffsetRatio + 1),


              // the same for the zoomcenter y
                height = this.container[0].offsetHeight * this.zoomFactor,
                offsetTop = this.offset.y,
                offsetBottom = height - offsetTop - this.container[0].offsetHeight,
                heightOffsetRatio = offsetTop / offsetBottom,
                centerY = heightOffsetRatio * this.container[0].offsetHeight / (heightOffsetRatio + 1);

              // prevents division by zero
              if (offsetRight === 0) {
                centerX = this.container[0].offsetWidth;
              }
              if (offsetBottom === 0) {
                centerY = this.container[0].offsetHeight;
              }

              return {
                x: centerX,
                y: centerY
              };
            },

            canDrag: function canDrag() {
              return !isCloseTo(this.zoomFactor, 1);
            },

            /**
             * Returns the touches of an event relative to the container offset
             * @param event
             * @return array touches
             */
            getTouches: function getTouches(event) {
              var position = this.container.offset();
              return Array.prototype.slice.call(event.touches).map(function (touch) {
                return {
                  x: touch.pageX - position.left,
                  y: touch.pageY - position.top
                };
              });
            },

            /**
             * Animation loop
             * does not support simultaneous animations
             * @param duration
             * @param framefn
             * @param timefn
             * @param callback
             */
            animate: function animate(duration, framefn, timefn, callback) {
              var startTime = new Date().getTime(),
                renderFrame = function () {
                  if (!this.inAnimation) {
                    return;
                  }
                  var frameTime = new Date().getTime() - startTime,
                    progress = frameTime / duration;
                  if (frameTime >= duration) {
                    framefn(1);
                    if (callback) {
                      callback();
                    }
                    this.update();
                    this.stopAnimation();
                    this.update();
                  } else {
                    if (timefn) {
                      progress = timefn(progress);
                    }
                    framefn(progress);
                    this.update();
                    requestAnimationFrame(renderFrame);
                  }
                }.bind(this);
              this.inAnimation = true;
              requestAnimationFrame(renderFrame);
            },

            /**
             * Stops the animation
             */
            stopAnimation: function stopAnimation() {
              this.inAnimation = false;
            },

            /**
             * Swing timing function for animations
             * @param p
             * @return {Number}
             */
            swing: function swing(p) {
              return -Math.cos(p * Math.PI) / 2 + 0.5;
            },

            getContainerX: function getContainerX() {
              return this.container[0].offsetWidth;
            },

            getContainerY: function getContainerY() {
              return this.container[0].offsetHeight;
            },

            setContainerY: function setContainerY(y) {
              return this.container.height(y);
            },

            /**
             * Creates the expected html structure
             */
            setupMarkup: function setupMarkup() {
              this.container = $('<div class="pinch-zoom-container"></div>');
              this.el.before(this.container);
              this.container.append(this.el);

              this.container.css({
                'overflow': 'hidden',
                'position': 'relative'
              });

              // Zepto doesn't recognize `webkitTransform..` style
              this.el.css({
                '-webkit-transform-origin': '0% 0%',
                '-moz-transform-origin': '0% 0%',
                '-ms-transform-origin': '0% 0%',
                '-o-transform-origin': '0% 0%',
                'transform-origin': '0% 0%',
                'position': 'absolute'
              });
            },

            end: function end() {
              this.hasInteraction = false;
              this.sanitize();
              this.update();
            },

            /**
             * Binds all required event listeners
             */
            bindEvents: function bindEvents() {
              detectGestures(this.container.get(0), this);
              // Zepto and jQuery both know about `on`
              $(window).on('resize', this.update.bind(this));
              $(this.el).find('img').on('load', this.update.bind(this));
            },

            /**
             * Updates the css values according to the current zoom factor and offset
             */
            update: function update() {

              if (this.updatePlaned) {
                return;
              }
              this.updatePlaned = true;

              setTimeout(function () {
                this.updatePlaned = false;
                this.updateAspectRatio();

                var zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
                  offsetX = -this.offset.x / zoomFactor,
                  offsetY = -this.offset.y / zoomFactor,
                  transform3d = 'scale3d(' + zoomFactor + ', ' + zoomFactor + ',1) ' + 'translate3d(' + offsetX + 'px,' + offsetY + 'px,0px)',
                  transform2d = 'scale(' + zoomFactor + ', ' + zoomFactor + ') ' + 'translate(' + offsetX + 'px,' + offsetY + 'px)',
                  removeClone = function () {
                    if (this.clone) {
                      this.clone.remove();
                      delete this.clone;
                    }
                  }.bind(this);

                // Scale 3d and translate3d are faster (at least on ios)
                // but they also reduce the quality.
                // PinchZoom uses the 3d transformations during interactions
                // after interactions it falls back to 2d transformations
                if (!this.options.use2d || this.hasInteraction || this.inAnimation) {
                  this.is3d = true;
                  removeClone();
                  this.el.css({
                    '-webkit-transform': transform3d,
                    '-o-transform': transform2d,
                    '-ms-transform': transform2d,
                    '-moz-transform': transform2d,
                    'transform': transform3d
                  });
                } else {

                  // When changing from 3d to 2d transform webkit has some glitches.
                  // To avoid this, a copy of the 3d transformed element is displayed in the
                  // foreground while the element is converted from 3d to 2d transform
                  if (this.is3d) {
                    this.clone = this.el.clone();
                    this.clone.css('pointer-events', 'none');
                    this.clone.appendTo(this.container);
                    setTimeout(removeClone, 200);
                  }
                  this.el.css({
                    '-webkit-transform': transform2d,
                    '-o-transform': transform2d,
                    '-ms-transform': transform2d,
                    '-moz-transform': transform2d,
                    'transform': transform2d
                  });
                  this.is3d = false;
                }
              }.bind(this), 0);
            },

            /**
             * Enables event handling for gestures
             */
            enable: function enable() {
              this.enabled = true;
            },

            /**
             * Disables event handling for gestures
             */
            disable: function disable() {
              this.enabled = false;
            }
          };

          var detectGestures = function detectGestures(el, target) {
            var interaction = null,
              fingers = 0,
              lastTouchStart = null,
              startTouches = null,
              setInteraction = function setInteraction(newInteraction, event) {
                if (interaction !== newInteraction) {

                  if (interaction && !newInteraction) {
                    switch (interaction) {
                      case "zoom":
                        target.handleZoomEnd(event);
                        break;
                      case 'drag':
                        target.handleDragEnd(event);
                        break;
                    }
                  }

                  switch (newInteraction) {
                    case 'zoom':
                      target.handleZoomStart(event);
                      break;
                    case 'drag':
                      target.handleDragStart(event);
                      break;
                  }
                }
                interaction = newInteraction;
              },
              updateInteraction = function updateInteraction(event) {
                if (fingers === 2) {
                  setInteraction('zoom');
                } else if (fingers === 1 && target.canDrag()) {
                  setInteraction('drag', event);
                } else {
                  setInteraction(null, event);
                }
              },
              targetTouches = function targetTouches(touches) {
                return Array.prototype.slice.call(touches).map(function (touch) {
                  return {
                    x: touch.pageX,
                    y: touch.pageY
                  };
                });
              },
              getDistance = function getDistance(a, b) {
                var x, y;
                x = a.x - b.x;
                y = a.y - b.y;
                return Math.sqrt(x * x + y * y);
              },
              calculateScale = function calculateScale(startTouches, endTouches) {
                var startDistance = getDistance(startTouches[0], startTouches[1]),
                  endDistance = getDistance(endTouches[0], endTouches[1]);
                return endDistance / startDistance;
              },
              cancelEvent = function cancelEvent(event) {
                event.stopPropagation();
                event.preventDefault();
              },
              detectDoubleTap = function detectDoubleTap(event) {
                var time = new Date().getTime();

                if (fingers > 1) {
                  lastTouchStart = null;
                }

                if (time - lastTouchStart < 300) {
                  cancelEvent(event);

                  target.handleDoubleTap(event);
                  switch (interaction) {
                    case "zoom":
                      target.handleZoomEnd(event);
                      break;
                    case 'drag':
                      target.handleDragEnd(event);
                      break;
                  }
                }

                if (fingers === 1) {
                  lastTouchStart = time;
                }
              },
              firstMove = true;

            el.addEventListener('touchstart', function (event) {
              if (target.enabled) {
                firstMove = true;
                fingers = event.touches.length;
                detectDoubleTap(event);
              }
            });

            el.addEventListener('touchmove', function (event) {
              if (target.enabled) {
                if (firstMove) {
                  updateInteraction(event);
                  if (interaction) {
                    cancelEvent(event);
                  }
                  startTouches = targetTouches(event.touches);
                } else {
                  switch (interaction) {
                    case 'zoom':
                      target.handleZoom(event, calculateScale(startTouches, targetTouches(event.touches)));
                      break;
                    case 'drag':
                      target.handleDrag(event);
                      break;
                  }
                  if (interaction) {
                    cancelEvent(event);
                    target.update();
                  }
                }

                firstMove = false;
              }
            });

            el.addEventListener('touchend', function (event) {
              if (target.enabled) {
                fingers = event.touches.length;
                updateInteraction(event);
              }
            });
          };

          return PinchZoom;
        };

        if (true) {
          !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($) {
            return definePinchZoom($);
          }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          window.RTP = window.RTP || {};
          window.RTP.PinchZoom = definePinchZoom(window.$);
        }
      }).call(undefined);

      /***/
    },
    /* 1 */
    /***/ function (module, exports) {

      module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

      /***/
    }
    /******/])
});
;