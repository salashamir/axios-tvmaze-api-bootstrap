"use strict";

const MSSING_IMG = "https://tinyurl.com/tv-missing";

const $showsList = $("#shows-list");
const $episodesList = $("#episodes-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const showsResponse = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${term}`
  );
  return showsResponse.data.map((series) => ({
    id: series.show.id,
    name: series.show.name,
    summary: series.show.summary,
    image: series.show.image?.medium ?? MISSING_IMAGE_URL,
  }));
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-6 col-lg-4">
         <div class="card" data-show-id="${show.id}">
           <img 
              src="${show.image}" 
              class="card-img-top"/>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  if (!term) return;
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(showID) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const episodesResponse = await axios.get(
    `https://api.tvmaze.com/shows/${showID}/episodes`
  );
  console.log(episodesResponse);
  return episodesResponse.data.map((episode) => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    };
  });
}

/** Write a clear docstring for this function... */
function populateEpisodes(episodes) {
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );

    $episodesList.append($episode);
  }
  $episodesArea.show();
}

async function searchForEpisodesAndDisplay(e) {
  // get showID
  const showID = $(e.currentTarget).closest(".card").data("show-id");
  // fetch episodes using id
  const episodes = await getEpisodesOfShow(showID);
  // show episodes on episode area
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", searchForEpisodesAndDisplay);
