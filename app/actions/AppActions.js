/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import Snackbar from 'react-md/lib/Snackbars';

const AVERAGE_WPM = 200;
const AVERAGE_WPS = AVERAGE_WPM / 60;

class AppActions {
    constructor() {
        this.generateActions(
            'addToastSuccess',
            'authenticateSuccess',
            'clearInfoSuccess',
            'collectFail',
            'collectSuccess',
            'dislikeSuccess',
            'disperseFail',
            'disperseSuccess',
            'getInfoSuccess',
            'hideLoading',
            'likeSuccess',
            'logoutSuccess',
            'removeLikeSuccess',
            'removeDislikeSuccess',
            'seenSuccess',
            'showLoading',
            'toastStateChange',
            'toggleDrawerSuccess',
            'wishlistFail',
            'wishlistSuccess',
            'unseenSuccess',
            'unwishlistFail',
            'unwishlistSuccess'
        );
    }

    addToast(text, className) {
        const words = text.split(' ').length;
        const autohideTimeout = Math.max(
            Snackbar.defaultProps.autohideTimeout,
            (words / AVERAGE_WPS) * 1000
        );

        return this.addToastSuccess({
            text: text,
            className: className,
            autohideTimeout: autohideTimeout
        });
    }

    authenticate(user) {
        return this.authenticateSuccess(user);
    }

    clearInfo() {
        this.clearInfoSuccess();
    }

    collect(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/collect',
            dataType: 'json',
            data: {id, userid},
            success(data) {
                that.collectSuccess(data);
            },
            fail() {
                that.collectFail();
            }
        });
        return true;
    }

    dislike(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/dislike',
            dataType: 'json',
            method: 'POST',
            data: {id, userid},
            success(data) {
                that.dislikeSuccess(data);
            },
            fail() {
                that.dislike(userid,id);
            }
        });
        return true;
    }

    disperse(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/collect',
            dataType: 'json',
            method: 'DELETE',
            data: {id, userid},
            success() {
                that.disperseSuccess(id);
            },
            fail() {
                that.disperseFail();
            }
        });
        return true;
    }

    getInfo(id) {
        var that = this;
        am.ajax({
            url: '/api/user/info',
            dataType: 'json',
            method: 'GET',
            data: {id},
            success(data) {
                that.getInfoSuccess(data);
            },
            fail() {
                that.getInfo(id);
            }
        });
        return true;
    }

    like(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/like',
            dataType: 'json',
            method: 'POST',
            data: {id, userid},
            success(data) {
                that.likeSuccess(data);
            },
            fail() {
                that.like(userid,id);
            }
        });
        return true;
    }

    loading(loading, text) {
        if (loading) {
            return this.showLoading(text);
        }
        else {
            return this.hideLoading();
        }
    }

    logout() {
        this.logoutSuccess();
        return true;
    }

    removeLike(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/like',
            dataType: 'json',
            method: 'DELETE',
            data: {id, userid},
            success() {
                that.removeLikeSuccess(id);
            },
            fail() {
                that.removeLike(userid,id);
            }
        });
        return true;
    }

    removeDislike(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/dislike',
            dataType: 'json',
            method: 'DELETE',
            data: {id, userid},
            success() {
                that.removeDislikeSuccess(id);
            },
            fail() {
                that.removeDislike(userid,id);
            }
        });
        return true;
    }

    seen(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/seen',
            dataType: 'json',
            method: 'POST',
            data: {id, userid},
            success(data) {
                that.seenSuccess(data);
            },
            fail() {
                that.seen(userid,id);
            }
        });
        return true;
    }

    toastState(state) {
        return this.toastStateChange(state);
    }

    toggleDrawer() {
        return this.toggleDrawerSuccess();
    }

    wishlist(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/wishlist',
            dataType: 'json',
            data: {id, userid},
            success(data) {
                that.wishlistSuccess(data);
            },
            fail() {
                that.wishlistFail();
            }
        });
        return true;
    }

    unseen(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/seen',
            dataType: 'json',
            method: 'DELETE',
            data: {id, userid},
            success() {
                that.unseenSuccess(id);
            },
            fail() {
                that.unseen(userid,id);
            }
        });
        return true;
    }

    unwishlist(userid, id) {
        var that = this;
        am.ajax({
            url: '/api/user/wishlist',
            dataType: 'json',
            method: 'DELETE',
            data: {id, userid},
            success() {
                that.unwishlistSuccess(id);
            },
            fail() {
                that.unwishlistFail();
            }
        });
        return true;
    }
}

export default alt.createActions(AppActions);