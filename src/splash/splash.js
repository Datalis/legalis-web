function removeSplashFromWeb() {
  var elem = document.getElementById("splash");
  if (elem) {
    elem.remove();
  }
  document.body.style.background = "transparent";
}

window.removeSplash = removeSplashFromWeb;