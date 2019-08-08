function startSort() {
console.log("startsort...")
  
  setCount();
  

  //let mode = getMode();
  var elem = document.querySelector('#sortableContent');
  const dynamicBar = document.querySelector(".pb__dynamic_filter ");
  var qsRegex;
  var searchBtn = document.querySelector('#searchInputX');
  let filters = {};
  let buttonFilters = {};
  let buttonFilter;

  var iso = new Isotope( elem, {
    
    // options
    layoutMode: 'vertical',
    itemSelector: '.the_item',
    getSortData: {
      title: '[meta-list-title]',
      // 
      group: function (elem) {
        //console.log("groiup", elem.getAttribute('meta-all-group'))
        return elem.getAttribute('meta-all-group');
      }
    },
    filter: function (elem) {
      //console.log("filtering....", buttonFilters)

      // The value to search
      qsRegex = new RegExp( searchBtn.value, 'gi' );

      var searchResult = searchBtn ? elem.innerText.match( qsRegex ) : true;
      var q = true;
      var p = {};

      var target = '';

      for ( var prop in buttonFilters ) {
        target = prop.toString();
        

        let targetItem = elem.getAttribute(target);

        //console.log("target", target,targetItem, buttonFilters[prop]);

        // If OR. If a match is found within a group, set the group variable to true;
        if (target !== null && target !== undefined) {
          buttonFilters[prop].forEach((val, index) => {
            if (targetItem === val) {
              p[target] = true;
            }
            else if (val === "all") {
              p[target] = true;
            }
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

    console.log("sorting...")

    let sortBtns = document.querySelectorAll('[data-sort-value]');
    let sortValue, filterValue;

    // Check each sort value for the active sortable state
    sortBtns.forEach(sortBtn => {
      if (sortBtn.classList.contains("active")) {
        sortValue = sortBtn.getAttribute('data-sort-value');
      }
    });
     
    // Select the key to sort by. Sort by the matching attribute value
    iso.arrange({ sortBy: sortValue });


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
    iso.arrange();
  }

  // For sort buttons that are clicked, toggle the active state. The filter checks for the active state.
  document.addEventListener("click", function(e) {
    if (e.target.closest('[data-sort-value]')) {
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

  

  function getMode () {
    return document.body.getAttribute('data-mode');
  }

  // Return the count of the selected
  function setCount () {
    //console.log("set count")
    
    let countDiv = document.querySelector('.count');

    countDiv.innerText = getCount();
  }

  function getCount() {
    
    let all = document.querySelectorAll(".the_item");

    let visible = [];

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
    console.log(filters);
    
  }

  function changeBar(obj) {
    dynamicBar.innerHTML = "";

    for (var key in obj) {
      let dataFilterValue;

      let values = obj[key];
      
      if (values.length > 0) {
        console.log(obj)

        if (values.indexOf("false") != -1) {
          dataFilterValue = false;
          createFilter(key, values, dataFilterValue);
        }
        
      }
      
    }

    function createFilter (groupName, groupValues, dataFilterValue) {

      let groupKey = "meta-" + groupName;
      let groupDiv = document.createElement("div");
      //<div class="select"><select class="form-control width-100%" name="selectThis" id="selectThis"></select>
      //<svg class="icon" aria-hidden="true" viewBox="0 0 16 16"><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
      //</div>
      let thisGroup = dynamicBar.appendChild(groupDiv);

      if (dataFilterValue === false) {
        groupDiv.setAttribute('data-key', groupKey);
        createFilterHTML("checkbox", `Missing ${groupName}`, false);
        createFilterHTML("checkbox", `Has ${groupName}`, true);
      } else {
        groupDiv.setAttribute('data-sort-group', groupKey);
        
        groupValues.forEach(val => {
          
          
        });
      }
      function createFilterHTML (type, label, value) {
        let valDiv;

        if (type === "radio") {
          valDiv = `
          <input type="radio" name="radioButton-${groupName}" data-filter-value="${value}">
          <label for="radioButton-${groupName}">${label}</label>`;
        } else if (type === "checkbox") {
          valDiv = `
          <input type="checkbox" name="checkbox-${groupName}" data-filter-value="${value}" checked>
          <label for="checkbox-${groupName}">${label}</label>`;
        } else if (type === "select") {
          if (!thisGroup.querySelector("select")) {
            let selectDiv = document.createElement("select");
            thisGroup.appendChild(selectDiv);
          }
          thisGroup = thisGroup.querySelector("select");
            valDiv = `
              <option value="${value}">${label}</option>`;
        }
        thisGroup.innerHTML += valDiv;
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
          console.log("mode", mode)
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