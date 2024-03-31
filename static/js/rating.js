const rating_container = document.getElementById("rating_container");
let rounded_rating = Math.ceil(rating_container.dataset.rating);
for (i = 1; i <= rounded_rating; i++) {
  rating_container.children[i].classList.add("checked");
}
