const titleText = document.querySelector('head title').innerText;

function startSort() {
console.log("startsort...")
  
  setCount();
  
  function getMode () {
    let toggleBtns = document.querySelector('[data-toggle]');
    let toggleValues = toggleBtns.querySelectorAll('input');
    let newMode;

    toggleValues.forEach((input, index) => {
      let val = input.value;
      let mode = val;

      if (input.checked) {
        newMode = mode;
      }
    });
    return newMode;
  }

  //console.log("getmode", getMode())
  //let mode = getMode();
  var elem = document.querySelector('#sortableContent');
  const dynamicBar = document.querySelector(".pb__filter_bar");
  const dynamicSortBar = document.querySelector(".pb__sort_bar");
  
  var qsRegex;
  var searchBtn = document.querySelector('#searchInputX');
  let filters = {};
  let buttonFilters = {};
  
  var iso = new Isotope( elem, {

    // options
    layoutMode: 'vertical',
    itemSelector: '.the_item',
    // sortAscending: function(){
    //   let direction = document.querySelector(".btn-sort");
    //   console.log("dir", direction)
    //   if (direction === null) {
    //     direction = false;
    //   } else {
    //     direction = true;
    //   }
    //   return direction;
    // },
    getSortData: {
      
      //title: '[meta-list-title]',
      title_content: function(elem) {
        //console.log("SORTING BY TITLE")
        let sortKey = "meta-" + getMode() + "-title-content";
        return elem.getAttribute(sortKey);
      },
      group: function (elem) {
        //console.log("SORTING BY GROUP")
        let sortKey = "meta-" + getMode() + "-group";
        return elem.getAttribute(sortKey);
      },
      broken_links_count: function (elem) {
        let sortKey = "meta-list-broken-links-count";
        
        let convertToNumber = parseInt(elem.getAttribute(sortKey))
        // if (isNaN(convertToNumber) === true) {
        //   convertToNumber = 0;
        // }
        console.log("SORTING BY LINKS", convertToNumber)
        return convertToNumber;
      },
    },
    filter: function (elem) {
      console.log("filtering....");

      // The value to search
      qsRegex = new RegExp( searchBtn.value, 'gi' );

      var searchResult = searchBtn ? elem.innerText.match( qsRegex ) : true;
      var q = true;
      var p = {};

      var target = '';

      for ( var prop in buttonFilters ) {
        target = prop.toString();
        

        let targetItem = elem.getAttribute(target);

        //console.log("target", p, "buttonfilters", buttonFilters);

        // If OR. If a match is found within a group, set the group variable to true;
        if (target !== null && target !== undefined) {
          buttonFilters[prop].forEach((val, index) => {
            if (targetItem === val) {
              p[target] = true;
            }
            // else if (val === "all") {
            //   p[target] = true;
            // }
            else if (val === "true" && targetItem !== "false") {
              p[target] = true;
            } else if (p[target] !== true) {
              p[target] = false;
            }
          });
        }

        // if AND each condition in a group is true;
        for ( var v in p ) {
          if (p[v] === false) {
            q = false;
          }
        }

      }
      return searchResult && q;
    }
  });

  // Update the running total after iso finishes arranging the items
  iso.on( 'arrangeComplete', function() {
    setCount();
    //console.log("arrange complete")
  });
  
  let sortValue = (e) => {
    buttonFilters = {};

    let sortBtns = document.querySelectorAll('[data-sort-value]');
    let sortValue, filterValue, sortDirection = false;
    
    
    // Check each sort value for the active sortable state
    sortBtns.forEach(sortBtn => {
      if (sortBtn.classList.contains("active")) {
        sortValue = sortBtn.getAttribute('data-sort-value');
        sortDirection = sortBtn.getAttribute('data-sort-asc');
        if (sortDirection === "false") {
          sortDirection = false;
        } else if (sortDirection === "true") {
          sortDirection = true;
        }
      }
    });
     
    let sortKey;

    if (sortValue) {
      
      sortKey = sortValue.replace(`meta-${getMode()}-`, "");
      sortKey = sortKey.replace(/-/g, "_");


      //console.log("xxxx", sortValue, sortKey)
    }
    
    // Select the key to sort by. Sort by the matching attribute value
    //let sortKey = `${sortValue}`;
    //console.log("sortValue", sortKey)
    
    //iso.arrange({ sortBy: sortKey });


    let filterGroups = document.querySelectorAll('[data-key]');
    //let checkedValues = [];
    
    filterGroups.forEach((group, index) => {
      let filterBtns = group.querySelectorAll('[data-filter-value]');
      let filterTarget = group.getAttribute('data-key');
      let checkedValues = [];

      filterBtns.forEach(filterBtn => {
        if (filterBtn.checked === true) {
          let attr = filterBtn.getAttribute('data-filter-value');
          checkedValues.push(attr);
        }
        buttonFilters[ filterTarget ] = checkedValues;
      });

    });
    //iso.arrange();
    console.log("arrange...", sortDirection)
    iso.arrange({ sortBy: sortKey, sortAscending: sortDirection });
    iso.arrange();
    //console.log("sorting...", buttonFilters)
    //iso.updateSortData( document.querySelectorAll(".the_item") )
  }
  
  function toggleRadio(target) {
    let nearestRadios = target.closest(".btns--radio").querySelectorAll('[type="radio"]');
    console.log("all radios", nearestRadios)
    nearestRadios.forEach(r => {
      console.log("target", target, r.value, target.closest('[input]'))
      r.checked = false;

      if (r.value === target.value) {
        r.checked = true;
      }
    })
  }

  function getSortDirection () {
    let direction = document.querySelector("#sortableContent").getAttribute("data-sort-asc");
    console.log("direction", direction)
    if (direction === true) {
      return true;
    } else {
      return false;
    }
  }

  // For sort buttons that are clicked, toggle the active state. The filter checks for the active state.
  document.addEventListener("click", function(e) {

    let sortBtns = document.querySelectorAll('[data-sort-value]');

    if (e.target.closest('[data-sort-value]')) {
      let sortBtn = e.target.closest('[data-sort-value]');

      if (!sortBtn.classList.contains("active")) {

      } else {
        if (sortBtn.getAttribute("data-sort-asc") === "false") {
          sortBtn.setAttribute("data-sort-asc", true);
          document.querySelector("#sortableContent").setAttribute("data-sort-asc", true);
        } else {
          sortBtn.setAttribute("data-sort-asc", false);
          document.querySelector("#sortableContent").setAttribute("data-sort-asc", false);
        }
        
      }
      

      sortBtns.forEach(sortBtn => {
        sortBtn.classList.remove("active");
        
      })
      e.target.closest('[data-sort-value]').classList.toggle("active");

    }
    if (e.target.closest('[pb-function="checkbox-select-all"]')) {
      let setChecked = e.target.closest('[pb-function="checkbox-select-all"]').parentNode.querySelectorAll('input[type="checkbox"]');
      if (e.target.closest('[pb-function="checkbox-select-all"]').checked === true) {
        toggleChecked(true);
      } else {
        toggleChecked(false);
      }
      
      function toggleChecked(state) {
        setChecked.forEach(check => {
          if (state === true) {
            check.setAttribute('checked', "");
          } else {
            check.removeAttribute('checked')
          }
          
        });
      }
      
    }
    if (e.target.closest('[data-toggle] label')) {
      console.log("toggle mode")
      let t = e.target.closest('[data-toggle] label');
      let targetRadio = t.getAttribute("for");
      let targetQuery = t.parentNode.querySelector(`[value="${targetRadio}"]`)
      toggleRadio(targetQuery)

      toggleMode();
    }
    if (e.target.closest('[data-post-processing]')) {
      let showFilter = e.target.getAttribute('data-post-processing');
      showFilter = document.querySelector(`[data-key="${showFilter}"`);
      
      
      checkBrokenLinks (document.querySelectorAll(".the_item"), showFilter);

      
    }
    sortValue();
    
  }, false);

  document.addEventListener("keyup", sortValue, false);

  


  // Return the count of the selected
  function setCount () {
    //console.log("set count")
    
    let countDiv = document.querySelector('.count');
    let allDiv = document.querySelector(".all_count");
    let brokenLinkCounterDiv = document.querySelector(".broken-link-count");
    let issuesDiv = document.querySelector(".issues-count");
    issuesDiv.innerText = getCount("issues", undefined);

    countDiv.innerText = getCount();
    allDiv.innerText = getCount(undefined, "a")
    brokenLinkCounterDiv.innerText = getCount(undefined, "broken_count");
    let filters = document.querySelectorAll("[data-key]");
    
    
    filters.forEach(filter => {
      let filterSelector = filter.getAttribute("data-key");
      let filterItems = filter.querySelectorAll("[data-filter-value]");
      
      filterItems.forEach(item => {
        let filterKey = item.getAttribute("data-filter-value");
        let label = item.parentNode.querySelector("label");
        //let labelSpan = document.createElement("span");
        //let span = label.appendChild(labelSpan)
        let labelSpan, span;
        let labelCount = getCount(filterSelector, filterKey);
        
        console.log("PPPP", span, filterKey, labelCount)

        if (label.querySelector("span") === null) {
          labelSpan = document.createElement("span");
          span = label.appendChild(labelSpan);
          span.className = "thisCount";
        }

        span = label.querySelector(".thisCount");
        
        
        //console.log(span, filterKey, labelCount)
        if (span !== null && span !== undefined) {
          //console.log("updated cont....", filter)

          if (labelCount !== 0) {
            span.innerText = " (" + labelCount + ") ";
          } else {
            span.innerText = "";
          }

          // Hide filters with no current value
          if (filter.parentNode.classList.contains("pb__selected_issues")) {
            if (labelCount === 0) {
              filter.style.display = "none";
            } else {
              filter.style.display = "";
            }
          }
        }
      });
    });

    
    document.querySelector("head title").innerText = titleText + " (" + getCount("issues", undefined) + ") issues found";
    
  }


  function getAttributes(item) {
    let attrs = [].slice.call(item.attributes);
    return attrs;
  }

  function checkAttribute(name, attr, value) {
    if (name.includes(attr) && name && value !== "false") {
      return true;
    } else {
      return false;
    }
  }
  let changeContent = (items, mode) => {
    document.body.setAttribute('data-mode', mode);
    //console.log("mode", mode);
    

    items.forEach((item, index) => {
      //console.log(item.attributes)
      let attrs = getAttributes(item);

      attrs.forEach((attr, index) => {
        let name = attr.name;
        let value = attr.value;
        let metaPrefix = `meta-${mode}`;
        let stringLength = value.length;
        
        // Based on list, facebook, twitter, or Google mode
        if (name.includes(metaPrefix)) {
          //console.log(name)

          if (checkAttribute(name, "image", value)) {
            item.querySelector(".meta_image").style.backgroundImage = `url('${value}')`;
          }

          if (checkAttribute(name, "title", value)) {
            //console.log("title", value)
            
            if (mode === "google") {
              if (stringLength > 65) {
                value = value.substring(0, 65);
                value = value + "...";
              }
            }
            if (mode === "facebook") {
              if (stringLength > 40) {
                value = value.substring(0, 40);
                value = value + "...";
              }
            }
            if (mode === "twitter") {
              if (stringLength > 40) {
                value = value.substring(0, 40);
                value = value + "...";
              }
            }
            item.querySelector(".meta_title").innerText = value;
          }

          if (checkAttribute(name, "url", value)) {
            //console.log("title", value)

            if (mode === "list") {
              value = value.replace(window.origin, "");
            }
            
            
            item.querySelector(".meta_url_text").innerText = value;
          }

          if (checkAttribute(name, "broken-links-count", value)) {
            item.querySelector(".broken_links_count").innerText = value;
          }

          if (checkAttribute(name, "description-content", value)) {
            
            
            if (mode === "google") {
              if (stringLength > 300) {
                value = value.substring(0, 300);
                value = value + "...";
              }
            }
            if (mode === "facebook") {
              if (stringLength > 110) {
                value = value.substring(0, 110);
                value = value + "...";
              }
            }
            if (mode === "twitter") {
              if (stringLength > 200) {
                value = value.substring(0, 200);
                value = value + "...";
              }
            }
            item.querySelector(".meta_description").innerText = value;
          }
          if (checkAttribute(name, "group", value)) {
            item.querySelector(".meta_group").innerText = value;
          }

          if (checkAttribute(name, "list-url", value)) {
            item.querySelector(".meta_link").href = value;
          }
        }
      });
      
    });
    //console.log(iso)
    sortValue();
    
  }

  let changeFilters = (items, mode) => {

    
    // Create an object that looks like this:
    // list-title: [];
    filters = {};

    getKeyName();
    function getKeyName () {
      items.forEach((item, i) => {
        let attrs = getAttributes(item);
        
        attrs.forEach((attr, index) => {
          let name = attr.name;
          let keyName = name.replace("meta-", "");
          let metaPrefix = `meta-${mode}`;
          

            if (name.includes(metaPrefix)) {
              
              filters[keyName] = [];
            }
        });
      });
    }

    items.forEach((item, i) => {
      let attrs = getAttributes(item);
      
      attrs.forEach((attr, index) => {
        
        let name = attr.name;
        newName = name.replace("meta-", "");
        let value = attr.value;
        let metaPrefix = `meta-${mode}`;
        let stringLength = value.length;

        if (name.includes(metaPrefix)) {
          //console.log("ITMES", filters[newName])
          filters[newName].push(value);
          // only add if it doesn't exist
          if (filters[newName].indexOf(value) == -1) {
            //filters[newName].push(value);
          }
          
        }
        //filters[newName] = a;
      });
    });
    changeBar(filters);
    console.log("filters",filters);
    
  }

  function listUniqueValues (arr, type) {
    
    var values = {};
    for (var i = 0; i < arr.length; i++) {
        values[arr[i]] = 1 + (values[arr[i]] || 0);
    }
    if (type === values || type === undefined) {
      return values;
    } else {
      return i;
    }
    
  }

  function hasIssue(fieldValues, name, returnType) {
    let issues = [undefined, null, false, "false", "undefined", "null", "tooBig", "hasBrokenLinks"];
    let is;
    let label;
    let friendlyGroup = friendlyLabel(name);

    fieldValues.forEach(possibleValue => {
      //console.log("fieldval", fieldValue);
      issues.forEach(function (issue){
        if (possibleValue === issue) {
            is = issue;
          if (issue === undefined || issue === "undefined") {
            label = `Missing ${friendlyGroup} tag`;
          }
          if (issue === null || issue === "null" || issue === false || issue === "false") {
            label = `${friendlyGroup} missing`;
          }
          if (issue === "tooBig") {
            label = `${friendlyGroup} is too long`;
          }
          if (issue === "hasBrokenLinks") {
            label = `Page has broken links`
          }
        }
      });
    });
    if (is) {
      if (returnType === "label") {
        return label;
      } else {
        return is;
      }
    } else {
      return false;
    }
    
  }

  function isSortable(fieldValues, name) {
    let is;
    
    fieldValues.forEach(possibleValue => {
      if (isNaN(possibleValue) === false) {
        is = `Missing Links`;
      } else if (name.includes("title-content")) {
        is = `Title`;
      } else if (name.includes("group")) {
        
        is = `Group`;
      }
    });
    //console.log("includes group", name, is);
    if (is) {
      return is;
    } else {
      return false;
    }
    
  }

  function isFilter(fieldValues, name) {
    let is = [];
    

    for (var key in fieldValues) {
      if (name.includes("robots")) {
        is.push(key);
      }
    }

    //console.log("fff", fieldValues, is, name)
    if (is.length > 0) {
      return is;
    } else {
      return false;
    }
    
  }

    // Check broken links for the currently selected
  function checkBrokenLinks (links, showFilter) {
    //console.log("checking links....")
      Util.pbLoadingAnimation(true);
      let activeItems = [];

      links.forEach(a => {
        if (a.style.display !== "none") {
          activeItems.push(a);
        }
      })
      activeItems.forEach((item, itemIndex) => {
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
              
              function getStatus () {
                
                  let url = l.href;
                  
                  fetch(url)
                  .then( res => {
                    if (res.ok) {
                      //console.log("relOK", url)
                    } else {
                      //fillDiv.innerText += url;
                      if (notFound.indexOf(url) === -1) {
                        notFound.push(url);
                      }
                      
                      item.setAttribute("meta-list-broken-links", "hasBrokenLinks");
                      item.setAttribute("meta-list-broken-links-count", notFound.length);

                      brokenLinks[urlToId(item.getAttribute("meta-list-url"))] = notFound;
                      
                      //fillDiv.innerText = notFound.length;
                      //fillDiv.innerHTML += `<li>${l}</li>`;
                      //console.log("blinkss", brokenLinks[urlToId(item.getAttribute("meta-list-url"))])
                      
                      
                    }
                    if (index === relUrls.length -1) {
                      //item.setAttribute("meta-list-broken-links", "hasBrokenLinks");
                      //brokenLinks[urlToId(item.getAttribute("meta-list-url"))] = notFound;
                      //console.log("NOTFOUND", src, url, notFound)
                    }
                  });
                
              }
              
              
              getLinkStatus();
              // Request both students and scores in parallel and return a Promise for both values.
              // `Promise.all` returns a new Promise that resolves when all of its arguments resolve.
              function getLinkStatus(){
                return Promise.all([getStatus()]);
              }

              // When this Promise resolves, both values will be available.
              getLinkStatus()
                .then((response) => {
                  // both have loaded!
                  

                  if (index === relUrls.length -1 && activeItems.length -1 === itemIndex) {
                    //console.log("ALL BROKEN LINKS LOADED", index, relUrls.length)
                    //console.log("broken link object", brokenLinks)
                    
                    setTimeout( function () {
                      iso.updateSortData();
                      //iso.arrange();
                      sortValue()
                      toggleMode();
                      Util.pbLoadingAnimation(false);
                    }, 1000)
                    
                    //iso.arrange();
                  }
                })
              });
            
          }
          


        getMeta(link);

      });
  }

  function changeBar(obj) {
    // <div class="btn" data-sort-value="meta-list-title">Title</div>
    // <div class="btn" data-sort-value="meta-list-group">Group</div>
    // <div class="btn" data-sort-value="meta-list-links">Number</div>
    dynamicSortBar.innerHTML = `
    <ul class="radio-list radio-list--custom">
      <li class="pb__sortable_group">
        
      </li>
    </ul>`;

    dynamicBar.innerHTML = `
    <div class='pb__filter_group'></div>`;

    // Filter object contains all selectors and their values for the active mode. 
    for (var key in obj) {

      let values = obj[key];
      let uniqueCount = listUniqueValues(obj[key], "count");
      //console.log("possible values", key, listUniqueValues(obj[key]))
      if (values.length > 0) {
        
        //formFilter(key, values)
        // Sort, filter, or show issue
        if (hasIssue(values, key)) {
          //console.log("possible issues", key)
          formFilter(key, hasIssue(values, key), "issue", hasIssue(values, key, "label"));
        }
        if (isSortable(values, key)) {
          //console.log("sss", key, values)
          formFilter(key, isSortable(values, key), "sort")
        }
        
        if (isFilter(listUniqueValues(obj[key]), key)) {
          //console.log("UNIQUE VALUES", listUniqueValues(obj[key]))
          values = isFilter(listUniqueValues(obj[key]), key)
          formFilter(key, values, "filter")
        }
        
      }
      
    }

    function doesNotExist (parent, selector) {
      let is;
      if (parent.querySelector(selector) === null || parent.querySelector(selector) === undefined) {
        //console.log("parent", parent, selector);
        is = true;
      }

      if (is === true) {
        return true;
      } else {
        return false;
      }
    }

    function formFilter (groupName, values, typeClass, friendlyName) {
      // meta-list-description
      // Groupname = object key
      let lookupKey = "meta-" + groupName;
      let groupKey = "meta-" + groupName;

      // Areas to put stuff
      let issuesDiv = document.querySelector(".pb__selected_issues");
      let filterDiv = document.querySelector(".pb__filter_group")
      let sortDiv = document.querySelector(".pb__sortable_group");

      if (typeClass === "issue") {
        bar = issuesDiv;
      } else if (typeClass === "filter") {
        
        
        bar = filterDiv;
      } else if (typeClass === "sort") {
        bar = sortDiv;
        lookupKey = "meta-" + groupName;
      } 

 
      let groupHTML;
      if (!bar.querySelector(`[data-key="${groupKey}"]`)) {
        //console.log("exists already");
        // Types of elements to create
        
        let div = document.createElement("div");
        
        groupHTML = bar.appendChild(div);
        groupHTML.setAttribute('data-key', groupKey);
        
        if (typeClass === "filter") {
          let label = document.createElement("label");
          groupHTML.appendChild(label);
          label.innerText = friendlyLabel(groupName, "string");
        }
      }
      let groupSelector = bar.querySelector(`[data-key="${groupKey}"]`);

      

      
      //console.log("groupHTML", groupHTML)

      function createSingleFilter(value) {
        let innerDiv;
        
        let dataValueSelector = `[data-${typeClass}-value="${value}"]`;
        
        //let friendlyLabel = isIssue(value, lookupKey);

        // Check if already exists, if not, create it.
        if (doesNotExist(groupSelector, dataValueSelector)) {
          
          if (typeClass === "issue" && !groupSelector.querySelector(`[data-filter-value='${value}']`)) {
            innerDiv = `<div>
            <input type="checkbox" name="checkbox-${groupName}" data-filter-value="${value}">
            <label for="checkbox-${groupName}">${friendlyName} <span class="thisCount"></span></label>
            </div>`;
            groupSelector.innerHTML += innerDiv;
          } else if (typeClass === "filter" && !groupSelector.querySelector(`[data-filter-value='${value}']`)) {
            innerDiv = `<div>
            <input type="checkbox" name="checkbox-${groupName}" data-filter-value="${value}">
            <label for="checkbox-${groupName}">${value} <span class="thisCount"></span></label>
            </div>`;
            groupSelector.innerHTML += innerDiv;
          } else if (typeClass === "sort") {
            innerDiv = `<div class="btn-sort" data-sort-asc="true" data-${typeClass}-value="${lookupKey}">${value}</div>`;
            groupSelector.innerHTML += innerDiv;
          }
        }
      }
          
      
      if (Array.isArray(values)) {
        values.forEach(value => {
          //console.log("vvvv", value, typeof(value))
          createSingleFilter(value);
          
        });
      } else {
        createSingleFilter(values);
      }
      // the Innerhtml for the group
      
    }
  }

  function friendlyLabel (name, type) {
    let reName = new RegExp( "-content|-limit", 'gi' );

    let friendly = name.replace(reName, "");
    let prefix = "";
    if (getMode() === "facebook") {
      //prefix = "og:"
    } else if (getMode() === "google") {
      //prefix = ""
    } else if (getMode() === "twitter") {
      //prefix = "twitter:"
    }
    if (type === "string") {
      friendly = friendly.replace((getMode() + "-"), "")
      if (name.includes("robots")) {
        friendly += " value";
      }
      //friendly = prefix + friendly;
    } else {
      friendly = `<span class="meta_prefix prefix_${getMode()}">` + prefix + friendly + '</span>';
    }
    
    //console.log("friendly", friendly, getMode())
    return friendly;
  }

  function toggleMode (e) {
    let toggleBtns = document.querySelector('[data-toggle]');
    let toggleValues = toggleBtns.querySelectorAll('input');
    let theItems = document.querySelectorAll('.the_item');

    toggleValues.forEach((input, index) => {
      let val = input.value;
      let mode = val;

      if (input.checked) {
          changeContent(theItems, mode);
          changeFilters(theItems, mode);
          
      }
    });
    
  }

  sortValue();

  // document.addEventListener('click', function(e) {
  //   if (e.target.closest('[data-toggle] input')) {
  //     toggleMode();
  //   }
  // }, false);
  toggleMode();
  //document.addEventListener('DOMContentLoaded', toggleMode, false);
}