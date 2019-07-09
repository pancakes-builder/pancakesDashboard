// getGroup(link); // return the associated top level group for a link
// getGroups(links); // return an array of all available groups;
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

function parseXML () {
  let sitemap = document.querySelector('#sitemap').value;
  sitemap = window.location.origin + sitemap;
  fetch(sitemap)
  .then((response) => response.text())
  .then(function(xml) {
    let parser = new DOMParser();
    let content = parser.parseFromString(xml, "text/xml");
    let pages = content.querySelectorAll("loc");
    // Start evaluating the links
    evaluateXML(pages);
  });
    
}

function evaluateXML (links) {

  if (links.length > 0) {
    createSections(links);

    links.forEach(link => {
      link = link.innerHTML;

      //opulateSections(link, getGroup(link));
      //console.log("link", link, "group", getGroup(link), "Groups", getGroups(links));
      
      // Create tabs for each group
    });

  } else {
    return false;
  }
}

// Create groups of links
function createSections (links) {
  let groups = getGroups(links);
  let listSidebar = document.querySelector('.groups');
  let listContent = document.querySelector('.sections');
  let mode = checkMode;

  groups.forEach(group => {
    listSidebar.innerHTML += `<li>${group}</li>`;
    listContent.innerHTML += `
    <ul class="list" aria-label='${group}'>
      <li>
        <h2>${group}</h2>
      </li>
      <ul class='section-items'>
      
      </ul>
    </ul>`;
  });
  links.forEach(link => {
    link = link.innerHTML;
    let thisGroup = getGroup(link)[0];
      let section = document.querySelector(`[aria-label='${thisGroup}'] .section-items`);
      section.innerHTML += `
      <li>
        <a href="${link}" target="_blank" class="link-wrapper"></a>
      </li>`;
      let linkHTML = section.querySelector('.link-wrapper');
      ajaxGetContent(link, mode, linkHTML);
  });
}

// Return an array of groups based on a link array
function getGroups (links) {
  let groups = [];

  links.forEach(link => {
    link = link.innerHTML;
    let group = getGroup(link)[0];

    if (groups.indexOf(group) === -1) {
      groups.push(group)
    }
  });
  
  return groups;
}

// Return an individual group based on the supplied URL
function getGroup (link) {
  let location = window.location.origin;
  location = location.replace(window.location.protocol, '');
  link = link.replace(location, '');

  let sections = link.split("/");

  let cleanSection = [];
  sections.forEach(section => {
    if (section !== "") {
      cleanSection.push(section);
    }
  });

  //console.log('section', cleanSection)
  return cleanSection;

}

window.addEventListener("DOMContentLoaded", function() {
  //console.log("parseXML test", parseXML());
  checkMode();
  parseXML();
});


//console.log("mode", parseXML());
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
    return mode;
  });
}
function ajaxGetContent(linkSrc, mode, linkHTML) {
  fetch(linkSrc /*, options */)
    .then((response) => response.text())
    .then((html) => {
        let parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");
        var head = doc.querySelector('head');
        
        (function () {
          //console.log(head);
          let pageTitle = head.querySelector("title");
          //let metaTitle = head.querySelector('[name="title"]').innerHTML;
          let metas = head.querySelectorAll("meta");
          console.log(pageTitle, metas);

          if (!pageTitle) {
            pageTitle = "No Title Set!";
          }
          linkHTML.innerHTML += `<span class="page-title">${pageTitle.innerHTML}</span>`;


          metas.forEach(function (meta, index) {
            let name = meta.getAttribute("name");
            let property = meta.getAttribute("property");
            let content = meta.getAttribute("content");
            //console.log(meta);
            if (name && content) {
              //console.log(name, content);
              //property = name;
              getMetaContentByProperty(name, content);
            } else if (property && content) {
              //console.log(property, content);
              getMetaContentByProperty(property, content);
            }
          });
        })();
        function getMetaContentByProperty(property, content){
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
            //link.querySelector(".metaBgImage").style.backgroundImage = `url('${content}')`;
            
          }
        }
        
    })
    
    .catch((error) => {
        console.warn(error);
    });
}

function getLinks(mode) {
  //console.log("mode", mode, parseXML());
  
  //console.log(toggle);
  let openTab = document.querySelector(".tabs__panel--selected");
  //let links = parseXML();
    //console.log("LINKS", links.childNodes);

    // for (i = 0; i <links.length; i++) {
    //   //console.log("link", links[i])
    // }
    // links.forEach(function (link, index) {
    //   let linkSrc = link;
    //   //console.log("link", link)
    //   ajaxGetContent(linkSrc, link, mode);
    // });
  
}
})();