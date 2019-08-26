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

  console.log("getmode", getMode())
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
    getSortData: {
      //title: '[meta-list-title]',
      title: function(elem) {
        
        let sortKey = "meta-" + getMode() + "-title";
        return elem.getAttribute(sortKey);
      },
      group: function (elem) {
        let sortKey = "meta-" + getMode() + "-group";
        return elem.getAttribute(sortKey);
      }
    },
    filter: function (elem) {
      //console.log("filtering....", buttonFilters);

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
    console.log("sorting...")

    let sortBtns = document.querySelectorAll('[data-sort-value]');
    let sortValue, filterValue;

    // Check each sort value for the active sortable state
    sortBtns.forEach(sortBtn => {
      if (sortBtn.classList.contains("active")) {
        sortValue = sortBtn.getAttribute('data-sort-value');
      }
    });
     
    let sortKey;

    if (sortValue) {
      sortKey = sortValue.replace(`meta-${getMode()}-`, "");
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
    iso.arrange({ sortBy: sortKey });
    iso.arrange();
    //iso.updateSortData( document.querySelectorAll(".the_item") )
  }

  // For sort buttons that are clicked, toggle the active state. The filter checks for the active state.
  document.addEventListener("click", function(e) {

    let sortBtns = document.querySelectorAll('[data-sort-value]');
    if (e.target.closest('[data-sort-value]')) {
      
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
    if (e.target.closest('[data-toggle] input')) {
      toggleMode();
    }
    sortValue();
    
  }, false);

  document.addEventListener("keyup", sortValue, false);

  


  // Return the count of the selected
  function setCount () {
    //console.log("set count")
    
    let countDiv = document.querySelector('.count');
    countDiv.innerText = getCount();

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
        //console.log("PPPP", span, filterKey, labelCount)

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
          if (filter.parentNode.classList.contains("pb__issues")) {
            if (labelCount === 0) {
              filter.style.display = "none";
            } else {
              filter.style.display = "";
            }
          }
        }
      });
    });

    
    document.querySelector("head title").innerText = titleText + " (" + getCount() + ") ";
    
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
            item.querySelector(".meta_title").innerText = value;
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
          }

          if (checkAttribute(name, "url", value)) {
            //console.log("title", value)
            item.querySelector(".meta_url").innerText = value;
          }

          if (checkAttribute(name, "relativeLinks", value)) {
            item.querySelector(".meta_relative_urls").innerText = value;
            
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

          if (filters[newName].indexOf(value) == -1) {
            filters[newName].push(value);
          }
          
        }
        //filters[newName] = a;
      });
    });
    changeBar(filters);
    console.log("filters",filters);
    
  }

  function listUniqueValues (arr) {
    var counts = {};
    for (var i = 0; i < arr.length; i++) {
        counts[arr[i]] = 1 + (counts[arr[i]] || 0);
    }
    return counts;
  }

  function isIssue(fieldValue, name) {
    let issues = [undefined, null, false, "false", "undefined", "null", "tooBig", "hasBrokenLinks"];
    let is;
    console.log("fieldval", fieldValue);
    issues.forEach(function (issue){
      if (fieldValue === issue) {
        
        if (issue === undefined || issue === "undefined") {
          is = `Missing ${name} meta tag `;
        }
        if (issue === null || issue === "null" || issue === false || issue === "false") {
          is = `Meta value for ${name} missing`;
        }
        if (issue === "tooBig") {
          is = `Meta ${name} toobig`;
        }
      }
    });

    if (is) {
      return is;
    } else {
      return false;
    }
    
  }
  

  function changeBar(obj) {
    dynamicSortBar.innerHTML = `
    <div class='pb__sortable_group btns'></div>`;

    dynamicBar.innerHTML = `
    <div class='pb__filter_group'></div>`;

    // Filter object contains all selectors and their values for the active mode. 
    for (var key in obj) {
      let dataFilterValue;

      let values = obj[key];
      
      if (values.length > 0) {
        console.log("changeBar", obj)
        console.log("unique values", listUniqueValues(obj[key]))

        // A value is missing, so create a filter that lets us display items with a missing value
        formFilter(key, values, "issue");
        
        // else if (values.length <= 4) {
        //   dataFilterValue = "key";
        //   createFilter(key, values, dataFilterValue);
        // } 
        // else {
          
        //   dataFilterValue = key;
        //   createFilter(key, values, dataFilterValue);
        // }
        
      }
      
    }

    function doesNotExist (parent, selector) {
      let is;
      if (parent.querySelector(selector) === null) {
        //console.log("parent", parent, selector);
        is = true;
      }

      if (is === true) {
        return true;
      } else {
        return false;
      }
    }

    function formFilter (groupName, values, typeClass) {
      // meta-list-description
      // Groupname = object key
      let interactMode = "filter";
      let lookupKey = "meta-" + groupName;
      

      // Areas to put stuff
      let issuesDiv = document.querySelector(".pb__issues");
      let filterDiv = document.querySelector(".pb__filter_group")
      let sortDiv = document.querySelector(".pb__sortable_group");

      if (typeClass === "issue") {
        bar = issuesDiv;
      } else if (typeClass === "filter") {
        bar = filterDiv;
      } else if (typeClass === "sort") {
        bar = sortDiv;
        interactMode = "sort";
      } 

      // Types of elements to create
      let label = document.createElement("label");
      let div = document.createElement("div");

      let groupHTML = bar.appendChild(div);
      groupHTML.appendChild(label);
      groupHTML.setAttribute('data-key', lookupKey);
      let groupSelector = document.querySelector(`[data-key="${lookupKey}"]`);
      //console.log("groupHTML", groupHTML)

      // the Innerhtml for the group
      values.forEach(value => {
        console.log("vvvv", value)
        if (isIssue(value, lookupKey)) {
          
          let dataValueSelector = `[data-${interactMode}-value="${value}"]`;
          let innerDiv;
          let friendlyLabel = isIssue(value, lookupKey);

          if (doesNotExist(groupSelector, dataValueSelector)) {
            
            if (interactMode !== "sort") {
              console.log("EXISTS", isIssue(value), value, groupHTML)
              innerDiv = `<div>
              <input type="checkbox" name="checkbox-${groupName}" data-${interactMode}-value="${value}">
              <label for="checkbox-${groupName}">${friendlyLabel} </label>
              </div>`;
              groupHTML.innerHTML += innerDiv;
            } else {
              let sortName = value.replace(`meta-${getMode()}-`, "");
              groupHTML += `<div class="btn" data-${interactMode}-value="${value}">${sortName}</div>`;
            }
          }
        }
      });
    }
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