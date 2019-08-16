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
  const dynamicBar = document.querySelector(".pb__dynamic_filter ");
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
    if (e.target.closest('[data-filter-value="*"]')) {
      let setChecked = e.target.closest('[data-filter-value="*"]').parentNode.querySelectorAll('input[type="checkbox"]');
      if (e.target.closest('[data-filter-value="*"]').checked === true) {
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
  }

  function getCount() {
    
    let all = document.querySelectorAll(".the_item");

    let visible = [];
    //console.log("visible", visible)

    all.forEach(item => {
      let display = getComputedStyle(item).display;
      
      if (display !== "none") {
        visible.push(item);
      }
    });
    return visible.length;
  }

  // flatten object by concatting values
  // function concatValues( obj ) {
  //   var value = '';

  //   for ( var prop in obj ) {
  //     let v = obj[ prop ].toString();
  //     // v = v.replace("\.", "");
  //     value += v;
  //     console.log(obj)
  //   }
  //   value = value.toString();
  //   value = value.split(',').join(" ").split('.').join('');
    
  //   return value;
  // }


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

          if (checkAttribute(name, "description", value)) {
            
            
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
  

  function changeBar(obj) {
    dynamicBar.innerHTML = `
    <div class='pb__sortable_group btns'></div>
    <div class='pb__filter_group'><label>Filter by: </label></div>`;

    for (var key in obj) {
      let dataFilterValue;

      let values = obj[key];
      
      if (values.length > 0) {
        console.log("changeBar", obj)
        console.log("unique values", listUniqueValues(obj[key]))

        // A value is missing, so create a filter that lets us display items with a missing value
        if (values.indexOf("false") != -1) {
          dataFilterValue = false;
          createFilter(key, values, dataFilterValue);
        } 
        
        else if (values.length <= 4) {
          dataFilterValue = "key";
          createFilter(key, values, dataFilterValue);
        } 
        else {
          
          dataFilterValue = key;
          createFilter(key, values, dataFilterValue);
        }
        
      }
      
    }

    function createFilter (groupName, groupValues, dataFilterValue) {

      let groupKey = "meta-" + groupName;
      
      //<div class="select"><select class="form-control width-100%" name="selectThis" id="selectThis"></select>
      //<svg class="icon" aria-hidden="true" viewBox="0 0 16 16"><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
      //</div>
      
      
      let filterGroup = document.querySelector(".pb__filter_group")
      let sortGroup = document.querySelector(".pb__sortable_group");
      //let thisGroup = dynamicBar.appendChild(groupDiv);

      let filterLabel = document.createElement("label");
      filterLabel.className = "pb__filter_title";
      let filterDiv = document.createElement("div");
      let fGroup = filterGroup.appendChild(filterDiv);
      filterGroup.appendChild(filterLabel);

      let sortLabel = document.createElement("label");
      let sortDiv = document.createElement("div");
      let sGroup = filterGroup.appendChild(sortDiv);
      sortGroup.appendChild(sortLabel);


      if (dataFilterValue === false) {
        fGroup.setAttribute('data-key', groupKey);
        createFilterHTML("checkbox", `Missing ${groupName}`, false);
        createFilterHTML("checkbox", `Has ${groupName}`, true);
      } else if (dataFilterValue === "key") {
        fGroup.setAttribute('data-key', groupKey);
        filterLabel.innerText = groupKey;

        groupValues.forEach(val => {
          createFilterHTML("checkbox", `${val}`, val);
        });
      } else {
        sGroup.setAttribute('data-sort-group', groupKey);
        createFilterHTML("text", `${groupName}`, groupKey);
      }
      function createFilterHTML (type, label, value) {
        let valDiv, sortDiv;

        if (type === "radio") {
          valDiv = `
          <label for="radioButton-${groupName}">${label}</label>
          <input type="radio" name="radioButton-${groupName}" data-filter-value="${value}">`;
          filterDiv.innerHTML += valDiv;
        } else if (type === "checkbox") {
          valDiv = `
          <label for="checkbox-${groupName}">${label}</label>
          <input type="checkbox" name="checkbox-${groupName}" data-filter-value="${value}" checked>`;
          
          filterDiv.innerHTML += valDiv;
        } else if (type === "select") {
          if (!thisGroup.querySelector("select")) {
            let selectDiv = document.createElement("select");
            thisGroup.appendChild(selectDiv);
          }
          thisGroup = thisGroup.querySelector("select");
            valDiv = `
              <option value="${value}">${label}</option>`;
              sortDiv.innerHTML += valDiv;
        } else if (type === "text") {
          //thisGroup = document.querySelector(".pb__sortable_filters");
          let sortName = value.replace(`meta-${getMode()}-`, "");
          valDiv = `
          <div class="btn" data-sort-value="${value}">${sortName}</div>`;
          sortGroup.innerHTML += valDiv;
        }
        
      }
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