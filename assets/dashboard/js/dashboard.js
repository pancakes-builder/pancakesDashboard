// getGroup(link); // return the associated top level group for a link
// getGroups(links); // return an array of all available groups;
(function () {

  const sortableContent = document.querySelector("#sortableContent");


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

    } else {
      return false;
    }
  }

  let getCharacterCount = (str) => {
    if (str !== undefined && str !== undefined && str !== false && str !== "") {
      return str.length;
    } else {
      return false;
    }
  }

  let getMetaValue = (selector, head) => {
    
    let metaItem = head.querySelector(selector);
    if (metaItem) {
      if (metaItem.innerText !== undefined && metaItem.innerText !== null && metaItem.innerText !== "") {
        return metaItem.innerText;
      } else if ((metaItem.content !== undefined && metaItem.content !== null)) {
        return metaItem.content;
      } else {
        return false;
      }
    } else {
      return false;
    }
    
  }

  // Create groups of links
  function createSections (links) {
    
    let groups = getGroups(links);
    let listSidebar = document.querySelector('.groups');
    if (groups) {
      listSidebar.innerHTML += `
      <input type="checkbox" id="checkbox0" data-filter-value="*" checked>
      <label for="checkbox0">Any</label>`;
    }      
    groups.forEach((group, index) => {
      index++;
      listSidebar.innerHTML += `
      <input type="checkbox" id="checkbox${index}" data-filter-value="${group}">
      <label for="checkbox${index}">${group}</label>`;
    });

    links.forEach((link, index) => {
      link = link.innerHTML;

      let getMeta = async(src) => {
        const response = await fetch(src);
        const html = await response.text();
        let parser = new DOMParser();

        // Parse the text
        let doc = parser.parseFromString(html, "text/html");

        // Get the head where the meta lives
        let head = doc.querySelector('head');

        // Create the html
        let thisGroup = getGroup(link)[0];

        let metaData = {
          all: {
            group: thisGroup
          },
          normal: {
            //title: "normal title",
            title: getMetaValue("title", head),
            description: getMetaValue('[name="description"]', head),
            image: getMetaValue('[property="twitter:image"]', head)
          },
          facebook: {
            //title: "fb title",
            title: getMetaValue("[property='og:title']", head),
            description: getMetaValue("[property='og:description']", head),
            image: getMetaValue("[property='og:image']", head),
          }
        }

        

        // Get each key and value of object
        // Create data-meta-category-(key)
        // Set data-meta-category-(key)="value"
        
        
        let item = document.createElement("div");
        item.className = "the_item";
        let thisItem = sortableContent.appendChild(item);

        //console.log(item, metaData)
        // sortableContent.innerHTML += `
        //   <div class="the_item ${thisGroup}" data-group="${thisGroup}">
        //   <li class="title">${title.normal}</li>
        //   <li data-group="${thisGroup}">${thisGroup}</li>
        //   </div>`;

          if (index === links.length -1) {
            startSort();
          }

          function pullMeta (obj) {
            var key;
            var value;
            
            for ( var prop in obj ) {
              key = prop;
              value = obj[ prop ];
              //console.log("key", key, "value", value);
    
              for ( var pr in value) {
                k = pr;
                v = value[ pr ];
                thisItem.setAttribute(`meta-${key}-${k}`, v);
              }
              
            }
          }
    
          pullMeta(metaData);


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


  window.addEventListener("DOMContentLoaded", function() {
    //console.log("parseXML test", parseXML());
    parseXML();
  });
})();