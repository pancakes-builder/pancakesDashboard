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
    if (e.target.closest("[data-sort-value]")) {
      let thisBtn = e.target;
      let sortValue = thisBtn.getAttribute('data-sort-value');
      iso.arrange({ sortBy: sortValue });
      console.log(sortValue, iso)
    }
  }
  document.addEventListener("click", sortValue, false);
}


