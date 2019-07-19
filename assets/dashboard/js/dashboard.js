// getGroup(link); // return the associated top level group for a link
// getGroups(links); // return an array of all available groups;
(function () {

  const main = document.querySelector("main");

  let radios = document.querySelectorAll("#metaToggle input");


  // Starter function
  // Given a sitemap, return an array of links
  let parseXML = async () => {
    let sitemap = document.querySelector('#sitemap').value;
    sitemap = window.location.origin + sitemap;

    const response = await fetch(sitemap)
    const text = await response.text();

    let parser = new DOMParser();
    let content = parser.parseFromString(text, "text/xml");
    let pages = content.querySelectorAll("loc");
    // Start evaluating the links
    evaluateXML(pages);
  }
  document.querySelector('#sitemap').addEventListener("keyup", () => {
    if (event.key === "Enter") {
      parseXML();
    }
  }, false);





  function evaluateXML (links) {

    if (links.length > 0) {
      createSections(links);

      // links.forEach(link => {
      //   link = link.innerHTML;

      //   (async() => {

      //   })();
      // });

    } else {
      return false;
    }
  }



  // Create groups of links
  function createSections (links) {
    let groups = getGroups(links);
    let listSidebar = document.querySelector('.groups');
    let listContent = document.querySelector('.sections');

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

    links.forEach((link) => {
      console.log(link)
      link = link.innerHTML;

      let getMeta = async(src) => {
        const response = await fetch(src);
        const html = await response.text();
        let parser = new DOMParser();
        // Parse the text
        let doc = parser.parseFromString(html, "text/html");

        // Get the head where the meta lives
        let head = doc.querySelector('head');
        let title = head.querySelector("title");
        if (title) {
          title = title.innerText;
        }

        let metas = head.querySelectorAll("meta");
        let description, twitterImage;

        Array.from(metas).forEach(meta => {
          if (head.querySelector('[name="title"]')) {
            title = head.querySelector('[name="title"]').content;
          }
          if (head.querySelector('[name="description"]')) {
            description = head.querySelector('[name="description"]').content;
          }
          twitterImage = head.querySelector('[property="twitter:image"]').content;

          console.log(meta);
        });
        console.log(twitterImage);
          // Create the html
        let thisGroup = getGroup(link)[0];
        let section = document.querySelector(`[aria-label='${thisGroup}'] .section-items`);
          section.innerHTML += `
          <li>
          Twitter Image: ${twitterImage}<br>
            <a href="${link}" target="_blank" class="link-wrapper">
              ${title}
              
            </a>
            <p>${description}</p>
          </li>`;

      }

      getMeta(link);
      
        //ajaxGetContent(link, mode, linkHTML);
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


  // function checkMode() {
  //   radios.forEach((radio) => {
  //     if (radio.checked === true) {
  //       main.classList.add("mode-" + radio.name);
  //       if (radio.name === "google") {
  //         mode = "google";
  //         getLinks(mode);
  //       } else if (radio.name === "social") {
  //         mode = "social";
  //         getLinks(mode);
  //       }
  //     } else {
  //       main.classList.remove("mode-" + radio.name);
  //     }
  //     return mode;
  //   });
  // }

  function ajaxGetContent(linkSrc, mode, linkHTML) {
    fetch(linkSrc /*, options */)
      .then((response) => response.text())
      .then((html) => {
          let parser = new DOMParser();
          
          // Parse the text
          var doc = parser.parseFromString(html, "text/html");
          var head = doc.querySelector('head');
          
          //console.log(head);
          let pageTitle = head.querySelector("title");
          //let metaTitle = head.querySelector('[name="title"]').innerHTML;
          let metas = head.querySelectorAll("meta");
          
          if (!pageTitle) {
            pageTitle = "No Title Set!";
          }
          linkHTML.innerText = pageTitle.innerText;


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


  window.addEventListener("DOMContentLoaded", function() {
    //console.log("parseXML test", parseXML());
    parseXML();
  });
})();