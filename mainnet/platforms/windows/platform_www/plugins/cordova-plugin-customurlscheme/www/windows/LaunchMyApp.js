cordova.define("cordova-plugin-customurlscheme.LaunchMyApp", function(require, exports, module) {
(function () {
    function activatedHandler(e) {
        if (typeof handleOpenURL === "function" && e.uri) {
            handleOpenURL(e.uri.rawUri);
        }
    };

    document.addEventListener("activated", activatedHandler, false);
}());

});
