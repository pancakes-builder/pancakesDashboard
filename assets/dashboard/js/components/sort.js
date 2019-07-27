function startSort() {
  
  setCount();

  let mode = getMode();
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
      title: '.title',
      // 
      group: function (elem) {
        return elem.getAttribute('data-group');
      }
    },
    filter: function (elem) {
      // The value to search
      qsRegex = new RegExp( searchBtn.value, 'gi' );

      var searchResult = searchBtn ? elem.innerText.match( qsRegex ) : true;
      var q;

      if (buttonFilter !== "" && buttonFilter !== null && buttonFilter !== undefined) {
        buttonFilter = concatValues(buttonFilters);
        //q = elem.querySelector(buttonFilter);
      } else {
        buttonFilter = "*";
      }
      
      if (buttonFilter === "*" || elem.classList.contains(buttonFilter)) {
        q = true;
      } else {
        q = false;
      }
      return searchResult && q;
    }
  });

  // Update the running total after iso finishes arranging the items
  iso.on( 'arrangeComplete', function() {setCount()});
  
  let sortValue = (e) => {
    let thisBtn = e.target;

    if (e.type === "click") {
      if (thisBtn.closest("[data-sort-value]")) {
      
        let sortValue = thisBtn.getAttribute('data-sort-value');
        // Select the key to sort by. Sort by the matching attribute value
        iso.arrange({ sortBy: sortValue });
      }
  
      if (thisBtn.closest("[data-filter]")) {
        //let filterValue = thisBtn.getAttribute('data-filter');
        let group = thisBtn.closest("[data-filter-group]");
        let checkedBoxes = group.querySelectorAll('[type="checkbox"][data-filter]');

        let checked = [];
        group = group.getAttribute('data-filter-group');
        
        //console.log(checked)
        checkedBoxes.forEach((box, i) => {
          if (box.checked === true) {
            let attr = box.getAttribute('data-filter');
            checked.push(attr);
          }
        });
        buttonFilters[ group ] = checked;
  
        iso.arrange();
      }
    }

    if (e.type === "keyup") {
      if (thisBtn.closest("#searchInputX")) {
        iso.arrange();
      }
    }
  }
  document.addEventListener("click", sortValue, false);
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

}




let toggleMode = (e) => {
  let thisItem;
  let toggleBtns = document.querySelector('[data-toggle]');
  let toggleValues = toggleBtns.querySelectorAll('input');

  function setMode () {
    toggleValues.forEach((input, index) => {
      let val = input.value;

      if (input.checked) {
        sortableContent.setAttribute('data-mode', val);
      }
    })
  }
  

  if (e.type === "DOMContentLoaded") {
    setMode();
  }
  if (e.type === "click") {
    thisItem = e.target.closest('[data-toggle] input');
    if (thisItem) {
      setMode();
    }
  }
  
}

document.addEventListener('click', toggleMode, false);
document.addEventListener('DOMContentLoaded', toggleMode, false);
