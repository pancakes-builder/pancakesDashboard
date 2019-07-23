function startSort() {
  var elem = document.querySelector('#sortableContent');
  var iso = new Isotope( elem, {
    // options
    layoutMode: 'vertical',
    itemSelector: '.the_item',
    getSortData: {
      title: '.title',
    }
  });
  
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

    

      console.log(newCheckedBoxes)

      let filterValue = newCheckedBoxes;

      iso.arrange({ 
        filter: filterValue 
      });
      
      // function
    //   iso.arrange({ 
    //     filter: function( itemElem ) {
    //     var number = itemElem.querySelector('.number').innerText;
    //     return parseInt( number, 10 ) > 50;
    //   }
    // })

    }
  }
  document.addEventListener("click", sortValue, false);
}


