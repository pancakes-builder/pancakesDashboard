// getGroup(link); // return the associated top level group for a link
// getGroups(links); // return an array of all available groups;

  const dashboardContent = document.querySelector(".pb__dashboardContent");
  const sortableContent = document.querySelector("#sortableContent");
  
  let brokenLinks = {};

  function urlToId(url) {
    let id = url.replace(window.origin, "");
    id = id.replace(/\//g, "_");
    console.log("blinks s", id)
    return id;
  }
  
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
        if (l.innerHTML !== thisPage && !l.innerHTML.includes("uploads")) {
          console.log(l.innerHTML)
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
      console.log("ALL", key, value)
    } else if (key === "issues") {
      all = [];
      
      document.querySelectorAll(".pb__sidebar_right [data-filter-value]").forEach(issue => {
        if (getComputedStyle(issue.parentNode).display !== "none") {
          all.push(issue);
          //console.log("countt issue", issue)
        }
      });

    } else if (key !== undefined) {
      all = document.querySelectorAll(`[${key}]`);
    } else {
      all = document.querySelectorAll(".the_item");
    }

    let visible = [];
    let countTotal = [];
    let brokenTotal = 0;

    all.forEach(item => {
      let display = getComputedStyle(item).display;
      countTotal.push(item);

      if (display !== "none") {
        visible.push(item);

        if (item.getAttribute("meta-list-broken-links-count")) {
          brokenTotal += parseInt(item.getAttribute("meta-list-broken-links-count"));
        }
        
      }
    });
    
    if (value === "a") {
      console.log("visible1", key, value, countTotal.length)
      return countTotal.length;
    } if (value ==="broken_count") {
      console.log("visible2", key, value, brokenTotal.length)
      return brokenTotal;
    } else {
      console.log("visible3", key, value, visible.length)
      return visible.length;
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

  function showAfterComplete () {
    let hiddenBtns = document.querySelectorAll("[data-post-processing]");

    hiddenBtns.forEach(hiddenBtn => {
      hiddenBtn.classList.remove("hidden");
      //hiddenBtn.classList.add("btn--subtle");
    });
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
            title: {
              content: getMetaValue("title", head),
            },
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
        
        
        let item = document.createElement("div");
        item.className = "the_item";
        item.href = link;
        item.target = "_blank";
        let thisItem = sortableContent.appendChild(item);
        thisItem.innerHTML = `
        <div class="meta_image"></div>
        <div class="card_footer">
        <a class="meta_url meta_link" target="_blank">
        <span class="meta_url_text"></span>
        <svg class="icon-link-external">
        <svg id="icon-link-external" viewBox="0 0 512 512">
          <path d="m384 384l-256 0 0-255 64-1 0-64-128 0 0 384 384 0 0-160-64 0z m-128-320l64 64-96 96 64 64 96-96 64 64 0-192z"></path>
        </svg>
        </svg>
        </a>
        <div class="meta_title"></div>
        <div class="meta_description"></div>
        <div class="meta_broken_links">
        

        <button aria-controls="right-drawer" class="counter-container" pb-drawer-target="pb__broken_links">
            <svg class="icon-link">
              <svg id="icon-link" viewBox="0 0 512 512">
                <path d="m384 128l-69 0c24 16 47 45 54 64l15 0c32 0 64 32 64 64 0 32-33 64-64 64l-96 0c-32 0-64-32-64-64 0-11 3-22 9-32l-69 0c-2 11-4 21-4 32 0 64 64 128 128 128 64 0 32 0 96 0 64 0 128-64 128-128 0-64-64-128-128-128z m-240 192l-15 0c-33 0-64-32-64-64 0-32 32-64 64-64l96 0c31 0 64 32 64 64 0 12-4 23-9 32l68 0c3-10 4-21 4-32 0-64-63-128-127-128-64 0-33 0-97 0-64 0-128 64-128 128 0 64 64 128 128 128l69 0c-24-16-46-44-53-64z"></path>
              </svg>
            </svg>
            <span class="counter counter--critical counter--docked broken_links_count">-</span>
        </button>

        
      </div>
        <div class="meta_group"></div>
        
        </div>
        `;

          

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
                if (!v) {
                  v = false;
                }
                
                if (typeof(v) === "object") {
                  //console.log("IS OBJECT", v, )
                  let subObj = v;
                  for ( var l in subObj) {
                    k = pr + "-" + l;
                    v = subObj[ l ];
                    if (!v) {
                      v = false;
                    }
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
          if (index === links.length -1) {
            // Refactor this to use promises
            // Right now the 
            setTimeout(function() {
              startSort();
              Util.pbLoadingAnimation(false);
              //checkBrokenLinks(document.querySelectorAll(".the_item"));
              showAfterComplete();
            }, 0);
            
          }

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
    toggleDrawerVisibility();
  });

  function toggleDrawerVisibility (selectedBtn, selectedItem) {
    let drawerButtons = document.querySelectorAll("[pb-drawer-target]");

    let bLinks;
    
    
    drawerButtons.forEach(btn => {
      let drawerTarget = btn.getAttribute('pb-drawer-target');
      let drawerTargetDiv = document.querySelector(`.${drawerTarget}`);
      drawerTargetDiv.classList.remove("active");
      //console.log("dd", drawerTarget, drawerTargetDiv)
      if (btn.classList.contains("active")) {
        drawerTargetDiv.classList.add("active");

        if (selectedItem !== undefined) {
          bLinks = brokenLinks[urlToId(selecteditem.getAttribute("meta-list-url"))];
          console.log('blinks', urlToId(selecteditem.getAttribute("meta-list-url")), brokenLinks)

          if (bLinks !== undefined && bLinks !== null) {
            let bLinksHTML;

            bLinks.forEach(bLink => {
              bLinksHTML += `<li> ${bLink} </li>`;
            });
            drawerTargetDiv.querySelector(".pb__selected_broken_links").innerHTML = bLinksHTML;
          }
          
        }
      }
    });

  }

  document.addEventListener("click", function(e) {

    let drawerButtons = document.querySelectorAll(".pb__sidebar [pb-drawer-target]");
    let itemButtons = document.querySelectorAll(".the_item [pb-drawer-target]");

    let allButtons = document.querySelectorAll("[pb-drawer-target]");
    let check = e.target.closest("[pb-drawer-target]");
    let selectedBtn, selectedItem;

      if (check) {
        
        allButtons.forEach(btn => {
          console.log("click", btn)
          btn.classList.remove("active");

          drawerButtons.forEach(b => {
            if (b.getAttribute("pb-drawer-target") === check.getAttribute("pb-drawer-target")) {
              console.log("target", btn)
              b.classList.add("active");
              check.classList.add("active");
              selectedBtn = check;
            }
          })
          itemButtons.forEach(c => {
            if (c.getAttribute("pb-drawer-target") === check.getAttribute("pb-drawer-target")) {
              selecteditem = check.closest(".the_item");
            }
          })
          
        });
        toggleDrawerVisibility(selectedBtn, selecteditem);
        
    }
    // if (e.target.closest('[aria-controls="right-drawer"]')) {
    //   document.body.classList.toggle("open-drawer-right");
    // }
    // let btns = document.querySelectorAll('.btn');
    // if (e.target.closest('.btn, button')) {
    //   sortBtn.classList.add("active");
    // }
  })