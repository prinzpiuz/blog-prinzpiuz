"use strict";
const blotils_base_url = `http://127.0.0.1:8000`;
const blotils = document.getElementById("blotils");
const like_button = document.getElementById("like_button");
const blotils_icon_unfilled = document.getElementById("blotils_icon_unfilled");
const blotils_icon_filled = document.getElementById("blotils_icon_filled");
const blotils_icon_explosion = document.getElementById(
  "blotils_icon_explosion"
);
const blotils_icon_container = document.getElementById(
  "blotils_icon_container"
);
const blotils_count = document.getElementById("blotils_like_count");
const ANIMATION_DURATION = 700;

/**
 * Returns the current path of the page, including the search query.
 *
 * This function first checks if there is a canonical link element on the page,
 * and if so, uses the href attribute of that element as the path. This allows
 * the path to be determined even if the current URL is a relative path or
 * points to a different domain.
 *
 * If no canonical link is found, the function simply returns the current
 * pathname and search query of the page's URL.
 *
 * @returns {string} The current path of the page, including the search query.
 */
var get_path = function () {
  var loc = location,
    c = document.querySelector('link[rel="canonical"][href]');
  if (c) {
    // May be relative or point to different domain.
    var a = document.createElement("a");
    a.href = c.href;
    if (
      a.hostname.replace(/^www\./, "") ===
      location.hostname.replace(/^www\./, "")
    )
      loc = a;
  }
  return loc.pathname + loc.search || "/";
};

/**
 * Checks if the current hostname is a local development environment.
 * @returns {boolean} True if the hostname matches a local development pattern, false otherwise.
 */
var check_localhost = function () {
  // return false;
  return location.hostname.match(
    /(localhost$|^127\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\.|^0\.0\.0\.0$)/
  );
};

/**
 * Updates the count displayed in the UI.
 *
 * @param {number} count - The new count to display.
 */
var update_count = function (count) {
  blotils_count.innerText = count;
};

/**
 * Fetches the number of likes for the current page.
 *
 * This function makes a request to the server's API endpoint to retrieve the
 * count of likes for the current page. If the request is successful, it updates
 * the like count display on the page. If the request fails, it logs the error
 * message to the console.
 */
var fetch_likes = function () {
  fetch(`${blotils_base_url}/api/v1/count_like?page=${get_path()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        update_count(data.count);
      } else {
        console.warn(data.message);
      }
    })
    .catch((error) => console.error(error));
};
/**
 * Handles the heart reaction functionality for a like button.
 *
 * This function sets up event listeners for the like button to handle the following:
 * - Filling and emptying the heart icon on hover
 * - Showing an animation when the button is clicked
 * - Removing all event listeners after the animation is complete
 */
var heart_reactions = function () {
  var fill_heart = function () {
    blotils_icon_unfilled.style.display = "none";
    blotils_icon_filled.style.display = "block";
  };

  var empty_heart = function () {
    blotils_icon_unfilled.style.display = "block";
    blotils_icon_filled.style.display = "none";
  };

  var show_animation = function () {
    blotils_icon_container.style.display = "none";
    blotils_icon_explosion.style.display = "block";
  };

  var after_animation = function () {
    blotils_icon_explosion.style.display = "none";
    blotils_icon_filled.style.display = "block";
    blotils_icon_container.style.display = "block";
    blotils_icon_unfilled.style.display = "none";
    remove_all_listener();
  };

  var remove_all_listener = function () {
    let new_element = blotils.cloneNode(true);
    blotils.parentNode.replaceChild(new_element, blotils);
  };

  var click_events = function () {
    show_animation();
    setTimeout(after_animation, ANIMATION_DURATION);
  };

  like_button.addEventListener("mouseover", fill_heart);
  like_button.addEventListener("mouseout", empty_heart);
  like_button.addEventListener("click", click_events);
};
/**
 * Initializes the bloTils functionality when the DOM content has finished loading.
 * If the current environment is not localhost, it fetches the likes and sets up heart reactions.
 * Otherwise, it logs an informational message.
 */
document.addEventListener("DOMContentLoaded", () => {
  if (!check_localhost()) {
    fetch_likes();
    heart_reactions();
  } else {
    console.info("Blotils: Not Computing on Localhost");
  }
});
