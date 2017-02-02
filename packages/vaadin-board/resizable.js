let Resizable = (superclass) => class extends superclass {
    static get config() {
        return {
            properties: {
                /**
                 * The closest ancestor element that implements `IronResizableBehavior`.
                 */
                _parentResizable: {
                    type: Object,
                    observer: '_parentResizableChanged'
                },
                /**
                 * True if this element is currently notifying its descedant elements of
                 * resize.
                 */
                _notifyingDescendant: {
                    type: Boolean,
                    value: false
                }
            }
        }
    }

    constructor() {
        super();
        // We don't really need property effects on these, and also we want them
        // to be created before the `_parentResizable` observer fires:
        this._interestedResizables = [];
        this._boundNotifyResize = this.notifyResize.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.__onDocumentLoaded( function() {
            this.dispatchEvent(new CustomEvent('iron-request-resize-notifications', {
                node: this,
                bubbles: true,
                cancelable: true,
                composed:true,
                detail:{}
            }));
            if (!this._parentResizable) {
                window.addEventListener('resize', this._boundNotifyResize, true);
                this.notifyResize();
            }
        }.bind(this));
    }
    ready() {
        super.ready();
        this.addEventListener('iron-request-resize-notifications',
            function (event) {
                //for some reason this - is undefined in FF
                //we use currentTarget as it equals to this
                event.currentTarget._onIronRequestResizeNotifications(event);
            }
        );

    }
    _onIronRequestResizeNotifications(event) {
        var target = event.composedPath()[0];
        if (target === this) {
            return;
        }
        if (this._interestedResizables.indexOf(target) === -1) {
            this._interestedResizables.push(target);
            target.addEventListener('iron-resize', this._onDescendantIronResize.bind(this),true);
        }
        target.assignParentResizable(this);
        this._notifyDescendant(target);

        event.stopPropagation();
    }
    detached() {
        if (this._parentResizable) {
            this._parentResizable.stopResizeNotificationsFor(this);
        } else {
            window.removeEventListener('resize', this._boundNotifyResize);
        }
        this._parentResizable = null;
    }

    /**
     * Can be called to manually notify a resizable and its descendant
     * resizables of a resize change.
     */
    notifyResize() {
        if (!this.isConnected) {
            return;
        }
        this._interestedResizables.forEach(function (resizable) {
            if (this.resizerShouldNotify(resizable)) {
                this._notifyDescendant(resizable);
            }
        }, this);
        this._fireResize();
    }

    /**
     * Used to assign the closest resizable ancestor to this resizable
     * if the ancestor detects a request for notifications.
     */
    assignParentResizable(parentResizable) {
        this._parentResizable = parentResizable;
    }

    /**
     * Used to remove a resizable descendant from the list of descendants
     * that should be notified of a resize change.
     */
    stopResizeNotificationsFor(target) {
        var index = this._interestedResizables.indexOf(target);
        if (index > -1) {
            this._interestedResizables.splice(index, 1);
            target.removeEventListener('iron-resize',this._onDescendantIronResize);
        }
    }

    /**
     * This method can be overridden to filter nested elements that should or
     * should not be notified by the current element. Return true if an element
     * should be notified, or false if it should not be notified.
     *
     * @param {HTMLElement} element A candidate descendant element that
     * implements `IronResizableBehavior`.
     * @return {boolean} True if the `element` should be notified of resize.
     */
    resizerShouldNotify(element) {
        return element.isConnected;
    }

    _onDescendantIronResize(event) {
        if (this._notifyingDescendant) {
            event.stopPropagation();
            return;
        }
        // NOTE(cdata): In ShadowDOM, event retargetting makes echoing of the
        // otherwise non-bubbling event "just work." We do it manually here for
        // the case where Polymer is not using shadow roots for whatever reason:
        if (!Polymer.Settings.useShadow || (window.ShadyDOM && window.ShadyDOM.inUse)) {
            this._fireResize();
        }
    }

    _fireResize() {
        this.dispatchEvent(new CustomEvent('iron-resize',
            {
                node: this,
                bubbles: false
            }));
    }

    _parentResizableChanged(parentResizable) {
        if (parentResizable) {
            window.removeEventListener('resize', this._boundNotifyResize);
        }
    }

    _notifyDescendant(descendant) {
        // NOTE(cdata): In IE10, attached is fired on children first, so it's
        // important not to notify them if the parent is not attached yet (or
        // else they will get redundantly notified when the parent attaches).
        if (!this.isConnected) {
            return;
        }
        this._notifyingDescendant = true;
        descendant.notifyResize();
        this._notifyingDescendant = false;
    }

    __onDocumentLoaded (callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('readystatechange', function onReadystatechange() {
                document.removeEventListener('readystatechange', onReadystatechange);
                callback();
            });
        }
    }
}