/**
 * Created by jafari on 12/23/2016 AD.
 */
import alt from '../alt';
import AppActions from '../actions/AppActions';
import cookie from 'react-cookie';

class AppStore {
    constructor() {
        this.bindActions(AppActions);
        this.autohideTimeout = 3000;
        this.collection=[];
        this.disliked=[];
        this.liked=[];
        this.loading=false;
        this.seen=[];
        this.toastClass = "";
        this.toasts = [];
        this.userCredential = cookie.load('MovieCollection_user');
        this.wishlist=[];
    }

    onAddToastSuccess(args) {
        const toasts = this.toasts.slice();
        toasts.push({text: args.text});
        this.autohideTimeout = args.autohideTimeout;
        this.toastClass = args.className || '';
        this.toasts = toasts;
    }

    onAuthenticateSuccess(user) {
        this.userCredential = user;
    }

    onClearInfoSuccess(){
        this.wishlist=[];
        this.collection=[];
    }

    onCollectFail(){
        AppActions.addToast.defer('An error occurred, please try again later!', 'error');
    }

    onCollectSuccess(data){
        this.collection.push(data);
        this.wishlist.splice(this.wishlist.map(item=> item._id).indexOf(data._id),1);
    }

    onDislikeSuccess(data){
        this.disliked.push(data);
        this.liked.splice(this.liked.map(item=> item._id).indexOf(data._id),1);
    }

    onDisperseFail(){
        AppActions.addToast.defer('An error occurred, please try again later!', 'error');
    }

    onDisperseSuccess(id){
        this.collection.splice(this.collection.map(item=> item._id).indexOf(id),1);
    }

    onGetInfoSuccess(data){
        this.wishlist=data.wishlist;
        this.collection=data.collection;
        this.seen=data.seen;
        this.liked=data.liked;
        this.disliked=data.disliked;
    }

    onHideLoading(){
        this.loading=false;
    }

    onLikeSuccess(data){
        this.liked.push(data);
        this.disliked.splice(this.disliked.map(item=> item._id).indexOf(data._id),1);
    }

    onLogoutSuccess() {
        cookie.remove('MovieCollection_user');
        this.userCredential = {};
    }

    onRemoveDislikeSuccess(id){
        this.disliked.splice(this.disliked.map(item=> item._id).indexOf(id),1);
    }

    onRemoveLikeSuccess(id){
        this.liked.splice(this.liked.map(item=> item._id).indexOf(id),1);
    }

    onSeenSuccess(data){
        this.seen.push(data);
    }

    onShowLoading(text){
        this.loading=true;
        this.loadingText=text;
    }

    onToastStateChange(toast){
        this.toasts=toast;
    }

    onToggleDrawerSuccess(){
        this.drawer=!this.drawer;
    }

    onWishlistFail(){
        AppActions.addToast.defer('An error occurred, please try again later!', 'error');
    }

    onWishlistSuccess(data){
        this.wishlist.push(data);
    }

    onUnseenSuccess(id){
        this.seen.splice(this.seen.map(item=> item._id).indexOf(id),1);
    }

    onUnwishlistFail(){
        AppActions.addToast.defer('An error occurred, please try again later!', 'error');
    }

    onUnwishlistSuccess(id){
        this.wishlist.splice(this.wishlist.map(item=> item._id).indexOf(id),1);
    }
}

export default alt.createStore(AppStore);