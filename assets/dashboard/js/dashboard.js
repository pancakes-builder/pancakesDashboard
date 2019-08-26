// getGroup(link); // return the associated top level group for a link
// getGroups(links); // return an array of all available groups;

  const dashboardContent = document.querySelector(".pb__dashboardContent");
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

      let newLinks = [];

      links.forEach(l => {
        let lPath = window.location.origin.replace(window.location.protocol, "");
        let thisPage = lPath + window.location.pathname;
        if (l.innerHTML !== thisPage) {
          //console.log(l)
          newLinks.push(l);
        }
      });
      createSections(newLinks);

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

  function getCount(key, value) {
    
    let all;

    if (value !== undefined && key !== undefined) {
      let query = "[" + key +"='" + value + "']";
      all = document.querySelectorAll(query);
      //console.log("ALL", all, query)
    } else if (key !== undefined) {
      all = document.querySelectorAll(`[${key}]`)
    } else {
      all = document.querySelectorAll(".the_item");
    }

    let visible = [];
    

    all.forEach(item => {
      let display = getComputedStyle(item).display;
      
      if (display !== "none") {
        visible.push(item);
      }
    });
    //console.log("visible", key, value, visible.length)
    return visible.length;
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

  function checkBrokenLinks (links) {
    
    let checkLinks = () => {
      Util.pbLoadingAnimation(true);
      links.forEach((item, index) => {
        let fillDiv = item.querySelector(".meta_relative_links");
        let link = item.href;

          let getMeta = async(src) => {
            const response = await fetch(src);
            const html = await response.text();
            let parser = new DOMParser();
            // Parse the text
            let doc = parser.parseFromString(html, "text/html");

            // Parse the text
            let urlSelectors = doc.querySelectorAll('a');
                
            let relUrls = [];
            urlSelectors.forEach(a => {
              if (a.href.includes(window.origin)) {
                //console.log("href", a)
                relUrls.push(a);
              }
            });

            let notFound = [];
            relUrls.forEach((l, index) => {
              
              let getStatus = async(url, src) => {
                  fetch(src)
                  .then( res => {
                    if (res.ok) {
                      
                    } else {
                      //console.log("NOTFOUND", url, src)
                      //fillDiv.innerText += url;
                      notFound.push(url);
                      console.log("hasBrokenLinks", item)
                      item.setAttribute("meta-list-broken-links", "hasBrokenLinks");
                      fillDiv.innerText = notFound.length;
                    }
                    if (index === relUrls.length -1) {
                      console.log("urlSelectors", notFound.length);
                      Util.pbLoadingAnimation(false);
                    }
                  });
                  
              }
              
              
              getStatus(l, l.href);
              
            });
          }
          


        getMeta(link);

      })
    }
    let brokenLinkTrigger = document.querySelector(".checkBrokenLinks");
    brokenLinkTrigger.addEventListener("click", checkLinks, false)
  }

  function checkLength (string, limit) {
    if (string.length > limit) {
      return "tooBig";
    } else {
      return "fine"
    }
  }

  // Create groups of links
  function createSections (links) {
    //console.log("starting links", links)
    let cProgressBar = document.getElementsByClassName('js-c-progress-bar')[0];
    Util.pbLoadingAnimation(true);
    
    let groups = getGroups(links);
    let listSidebar = document.querySelector('.groups');
    if (groups) {
      listSidebar.innerHTML += `
      <input type="checkbox" id="checkbox0" pb-function="checkbox-select-all" checked>`;
    }      
    groups.forEach((group, index) => {
      index++;
      listSidebar.innerHTML += `
      <li><input type="checkbox" id="checkbox${index}" data-filter-value="${group}" checked>
      <label for="checkbox${index}">${group}</label></li>`;
    });

    links.forEach((link, index) => {
      link = link.innerHTML;

      let getMeta = async(src) => {
        const response = await fetch(src);
        const html = await response.text();
        let parser = new DOMParser();

        let fullUrl = window.location.protocol + link;
        let path = fullUrl.replace(window.origin, "");
        let cleanUrl = link.replace(path, "").replace(window.location.protocol, "").replace("//", "");

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
          list: {
            //title: "normal title",
            title: getMetaValue("title", head),
            description: getMetaValue('[name="description"]', head),
            robots: getMetaValue('[name="robots"]', head),
            url: fullUrl,
            group: thisGroup,
          },
          google: {
            //title: "fb title",
            title: {
              limit: checkLength(getMetaValue("title", head), 65),
              content: getMetaValue("title", head),
            },
            description: {
              limit: checkLength(getMetaValue('[name="description"]', head), 300),
              content: getMetaValue('[name="description"]', head),
            },
            url: fullUrl,
            robots: getMetaValue('[name="robots"]', head),
            group: thisGroup
          },
          facebook: {
            //title: "fb title",
            title: {
              limit: checkLength(getMetaValue("[property='og:title']", head), 40),
              content: getMetaValue("[property='og:title']", head),
            },
            description: {
              limit: checkLength(getMetaValue("[property='og:description']", head), 110),
              content: getMetaValue("[property='og:description']", head),
            },
            image: getMetaValue("[property='og:image']", head),
            url: cleanUrl,
            group: thisGroup
          },
          twitter: {
            //title: "fb title",
            title: {
              limit: checkLength(getMetaValue("[property='twitter:title']", head), 40),
              content: getMetaValue("[property='twitter:title']", head),
            },
            description: {
              limit: checkLength(getMetaValue("[property='twitter:description']", head), 200),
              content: getMetaValue("[property='twitter:description']", head),
            },
            image: getMetaValue("[property='twitter:image']", head),
            url: cleanUrl,
            group: thisGroup
          }
        }

        //console.log(link, metaData)
        
        
        let item = document.createElement("a");
        item.className = "the_item";
        item.href = link;
        item.target = "_blank";
        let thisItem = sortableContent.appendChild(item);
        thisItem.innerHTML = `
        <div class="meta_image"></div>
        <div class="card_footer">
        <div class="meta_url"></div>
        <div class="meta_title"></div>
        <div class="meta_description"></div>
        <div class="meta_relative_links"></div>
        </div>`;

          if (index === links.length -1) {
            startSort();
            Util.pbLoadingAnimation(false);
            checkBrokenLinks(document.querySelectorAll(".the_item"));
          }

          function pullMeta (obj) {
            var key;
            var value;
            
            for ( var prop in obj ) {
              key = prop;
              value = obj[ prop ];
              console.log("key", key, "value", value);
    
              for ( var pr in value) {
                k = pr;
                v = value[ pr ];
                if (!v) {
                  v = false;
                }
                
                if (typeof(v) === "object") {
                  //console.log("IS OBJECT", v, )
                  let subObj = v;
                  for ( var l in subObj) {
                    k = pr + "-" + l;
                    v = subObj[ l ];
                    thisItem.setAttribute(`meta-${key}-${k}`, v);
                    //console.log("IS VALUE", key, k, v ) 
                  }
                } else {
                  
                  
                }
                //console.log("aa", key, k, v )
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
    let sections = [];

    let firstSection = (link.match(/(^\/[^/]+\/)/g)||[]);
    let lastSection = (link.match(/\/([^/]*)\/[^/]*$/g)||[]);
    

    if (firstSection[0] === lastSection[0]) {
      sections.push("Uncategorized");
    } else {
      let cleanedSection = firstSection[0].replace(/\//g, '');
      sections.push(cleanedSection);
    }
    //console.log(sections, firstSection, lastSection)
    //let sections = link.split("/");
    

    let cleanSection = [];
    sections.forEach(section => {
      //console.log("link", link, "section", section)
      //console.log(link, "section", section)
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