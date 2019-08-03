function startSort() {
console.log("startsort...")
  
  setCount();
  

  //let mode = getMode();
  var elem = document.querySelector('#sortableContent');
  var qsRegex;
  var searchBtn = document.querySelector('#searchInputX');
  let buttonFilters = {};
  let buttonFilter;

  var iso = new Isotope( elem, {
    
    // options
    layoutMode: 'vertical',
    itemSelector: '.the_item',
    getSortData: {
      title: '[meta-normal-title]',
      // 
      group: function (elem) {
        console.log("groiup", elem.getAttribute('meta-all-group'))
        return elem.getAttribute('meta-all-group');
      }
    },
    filter: function (elem) {
      //console.log("filtering....", buttonFilters)
      // The value to search
      qsRegex = new RegExp( searchBtn.value, 'gi' );

      var searchResult = searchBtn ? elem.innerText.match( qsRegex ) : true;
      var q;

      buttonFilter = concatValues(buttonFilters);

      if (buttonFilter !== "" && buttonFilter !== null && buttonFilter !== undefined) {
        
        //console.log(buttonFilter)
        let selected = buttonFilter.split(" ");
        //console.log(selected, elem)
        //q = elem.querySelector(buttonFilter);
        selected.forEach((selectedValue, index) => {
          let attributes = getAttributes(elem);
          //console.log(attributes)
          if (elem.classList.contains(selectedValue)) {
            q = true;
            //console.log(q)
          }
        });
      }
      if (buttonFilter === "*") {
        console.log("true")
        q = true;
      }
      
      // if (buttonFilter === "*" || elem.classList.contains(buttonFilter)) {
      //   q = true;
      // } else {
      //   q = false;
      // }
      
      return searchResult && q;
    }
  });

  // Update the running total after iso finishes arranging the items
  iso.on( 'arrangeComplete', function() {setCount()});
  
  let sortValue = (e) => {

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


    let filterBtns = document.querySelectorAll('[data-filter-value]')
    let filterGroup;
    let checkedValues = [];
    
    filterBtns.forEach(filterBtn => {
      filterGroup = filterBtn.closest("[data-filter-group]");
      if (filterGroup) {
        filterGroup = filterGroup.getAttribute('data-filter-group');
      } else {
        filterGroup = "all";
      }
      if (filterBtn.checked === true) {
        let attr = filterBtn.getAttribute('data-filter-value');
        checkedValues.push(attr);
      }

    });

    buttonFilters[ filterGroup ] = checkedValues

    iso.arrange();
  }

  document.addEventListener("click", function(e) {
    if (e.target.closest('[data-sort-value]')) {
      e.target.closest('[data-sort-value]').classList.toggle("active");
    }
    sortValue();
  }, false);
  document.addEventListener("keyup", sortValue, false);

  

  function getMode () {
    return sortableContent.getAttribute('data-mode');
  }

  // Return the count of the selected
  function setCount () {
    
    let countDiv = document.querySelector('.count');

    countDiv.innerText = getCount();
  }

  function getCount() {
    
    let all = document.querySelectorAll(".the_item");

    let visible = [];

    all.forEach(item => {
      let display = getComputedStyle(item).display;
      
      if (display === "block") {
        visible.push(item);
      }
    });
    return visible.length;
  }

  // flatten object by concatting values
  function concatValues( obj ) {
    var value = '';

    for ( var prop in obj ) {
      let v = obj[ prop ].toString();
      // v = v.replace("\.", "");
      value += v;
    }
    value = value.toString();
    value = value.split(',').join(" ").split('.').join('');
    
    return value;
  }


  function getAttributes(item) {
    let attrs = [].slice.call(item.attributes);
    return attrs;
  }

  function checkAttribute(name, attr) {
    if (name.includes(attr) && name) {
      return true;
    } else {
      return false;
    }
  }
  let changeContent = (items) => {

    items.forEach((item, index) => {
      //console.log(item.attributes)
      let attrs = getAttributes(item);

      attrs.forEach((attr, index) => {
        let name = attr.name;
        let value = attr.value;

        if (name.includes("meta")) {
          
          if (checkAttribute(name, "title")) {
            //console.log("title", value)
            let metaTitle = document.createElement("div");
            metaTitle.className = "meta_title";
            metaTitle.innerText = value;
            item.appendChild(metaTitle);
          }
          if (checkAttribute(name, "image")) {
            item.innerHTML += `
            <img src="${value}" class="meta_image">`;
          }
          if (checkAttribute(name, "description")) {
            item.innerHTML += `
            <div class="meta_description">${value}</div>`;
          }
        }
      });
    });
    iso.arrange();
    //console.log(iso)
  }


  let toggleMode = (e) => {
    let toggleBtns = document.querySelector('[data-toggle]');
    let toggleValues = toggleBtns.querySelectorAll('input');
    let theItems = document.querySelectorAll('.the_item');

    toggleValues.forEach((input, index) => {
      let val = input.value;
      let mode = val;

      if (input.checked) {
        //console.log("togglemode")
        sortableContent.setAttribute('data-mode', val);
        
          changeContent(theItems, mode);
      }
    });
    
  }
  sortValue();
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-toggle] input')) {
      toggleMode();
    }
  }, false);
  toggleMode();
  //document.addEventListener('DOMContentLoaded', toggleMode, false);
}