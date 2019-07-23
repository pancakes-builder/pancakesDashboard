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
      let filterValue = thisBtn.getAttribute('data-filter');

      iso.arrange({ 
        filter: filterValue 
      });
      console.log(filterValue, iso)
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


