function startSort() {
  setCount();

  var elem = document.querySelector('#sortableContent');
  var iso = new Isotope( elem, {
    // options
    layoutMode: 'vertical',
    itemSelector: '.the_item',
    getSortData: {
      title: '.title',
      group: '.group'
    }
  });

  iso.on( 'arrangeComplete', function() {setCount()});
  
  let sortValue = (e) => {
    let thisBtn = e.target;

    if (thisBtn.closest("[data-sort-value]")) {
      
      let sortValue = thisBtn.getAttribute('data-sort-value');
      iso.arrange({ sortBy: sortValue });
      console.log(sortValue, iso)
    }

    if (thisBtn.closest("[data-filter]")) {
      //let filterValue = thisBtn.getAttribute('data-filter');
      let checkedBoxes = document.querySelectorAll('[type="checkbox"][data-filter]');
      
      let newCheckedBoxes = [];

      checkedBoxes.forEach((box, i) => {
        if (box.checked === true) {
          newCheckedBoxes.push(box.getAttribute('data-filter'));
        }
      });

      let filterValue = newCheckedBoxes;

      iso.arrange({ 
        filter: filterValue 
      });
      setTimeout(function(){
        
        console.log("clicked")
      }, 1000)
      
    }

    
  }
  document.addEventListener("click", sortValue, false);


  // Return the count of the selected
  function setCount () {
    
    let countDiv = document.querySelector('.count');

    countDiv.innerText = getCount();
    console.log("setcount", countDiv, getCount());
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
    console.log(visible.length)
    return visible.length;
  }
}


