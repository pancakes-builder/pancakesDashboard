(function () {
let main = document.querySelector("main");
let tabLinks = document.querySelectorAll(".tabs__controls");
tabLinks.forEach((tabLink) => {
  tabLink.addEventListener("click", checkMode, false);
});

let toggles = document.querySelectorAll("#metaToggle .btns__btn");
let radios = document.querySelectorAll("#metaToggle input");
toggles.forEach((toggle) => {
  toggle.addEventListener("click", switchChecked, false);
  function switchChecked(e) {
    let thisRadio = e.target.parentElement.querySelector("input");
    radios.forEach((radio) => {
      
      if (radio === thisRadio) {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
      
    });
    checkMode();
  }
});

window.addEventListener("DOMContentLoaded", function() {
  checkMode();
});

function checkMode() {
  console.log("run checked mode");
  radios.forEach((radio) => {
    //console.log(radio.checked);
    if (radio.checked === true) {
      main.classList.add("mode-" + radio.name);
      if (radio.name === "google") {
        mode = "google";
        //console.log(mode);
        //console.log(mode);
        getLinks(mode);
      } else if (radio.name === "social") {
        //console.log(mode);
        mode = "social";
        //console.log(mode);
        getLinks(mode);
      }
    } else {
      main.classList.remove("mode-" + radio.name);
    }
  });
}
function ajaxGetContent(linkSrc, link, mode) {
  fetch(linkSrc /*, options */)
    .then((response) => response.text())
    .then((html) => {
        let parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");
        var head = doc.querySelector('head');
        //var pbCritical = doc.querySelector('.pb_criticalCSS').innerHTML;
       
        (function () {
          //console.log(head);
          let pageTitle = head.querySelector("title");
          //console.log(pageTitle);
          let metaTitle = head.querySelector('[name="title"]').innerHTML;
          let metas = head.querySelectorAll("meta");

          metas.forEach(function (meta, index) {
            let name = meta.getAttribute("name");
            let property = meta.getAttribute("property");
            let content = meta.getAttribute("content");
            //console.log(meta);
            if (name && content) {
              //console.log(name, content);
              //property = name;
              getMetaContentByProperty(name, content, link);
            } else if (property && content) {
              //console.log(property, content);
              getMetaContentByProperty(property, content, link);
            }
            
            
          });
        })();

        function getMetaContentByName(name,content){
          //console.log(name);
          //console.log(content);
          //console.log(document.querySelector("meta[name='"+name+"']"));
        }
        function getMetaContentByProperty(property, content, link){
          //console.log(property);
          //Get Facebook, Linkedin, Twitter preview image
          // Property=""
          // og:image
          // twitter:image
          if (property.match(/image/)) {
            //console.log(link);
              setPreviewImage(content);
            
          }
          //console.log(document.git adquerySelector("meta[name='"+name+"']"));
          function setPreviewImage() {
            link.querySelector(".metaBgImage").style.backgroundImage = `url('${content}')`;
            
          }
        }
        
    })
    
    .catch((error) => {
        console.warn(error);
    });
}

function getLinks(mode) {
  console.log("mode", mode);
  
  //console.log(toggle);
  let openTab = document.querySelector(".tabs__panel--selected");
  let links = openTab.querySelectorAll("a");
    //console.log(links);
    links.forEach(function (link, index) {
      let linkSrc = link.href;
      ajaxGetContent(linkSrc, link, mode);
    });
  
}
})();