"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
  //display the delete story story button

  const hostName = story.getHostName();

  //if a user is logged in, display the favorite/not-favorite icon.
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//create the delete button HTML with fontawesome icon to delete stories
function getDeleteBtnHTML(){
  return `<span class="trash-can"><i class="fas fa-trash-alt"></i></span>`;
}

//create the favorite/not-favorite star icon for stories
function getStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? 'fas' : 'far';
  return `<span class='star'><i class="${starType} fa-star" style="color:gold"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//handle deleting a story
async function deleteStory(evt){
  console.debug("deleteStory", evt);

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  //re-generate story list on the page
  await putUserStoriesOnPage();
}

$ownStories.on('click', '.trash-can', deleteStory);

//handle submitting new story form
async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();

  //collect all the info from the form
  const title = $('#create-title').val();
  const url = $('#create-url').val();
  const author = $('#create-author').val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //hide the form and reset it
  $submitForm.slideUp('slow');
  $submitForm.trigger('reset');
}
$submitForm.on('click', submitNewStory);


/***** Functionality for list of user's own stories *******/
function putUserStoriesOnPage(){
  console.debug('putUserStoriesOnPage');

  $ownStories.empty();

  if(currentUser.ownStories.length === 0){
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  }else{
    //loop through all of users stories abd generate HTML for them.
    for(let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}


/*******Functionality for favorites list and star/un-star a story *******/
//Put favorites list on the page

function putFavoritesListOnPage(){
  console.debug('putFavoritesListOnPage');
  $favoritedStories.empty();

  if(currentUser.favorites.length === 0){
    $favoritedStories.append('<h5>No favorites story added!</h5>');
  }else{
    //loop through all users favorites and generate HTML for them.
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}


//handle favorite and un-favorite a story

async function toggleStoryFavorite(evt){
  console.debug('toggleStoryFavorite');

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  //check is story is favorited by checking the presence of star icon
  if($tgt.hasClass('fas')){
    //if its favorited, remove from user's favorite list and change the star
    await currentUser.removeFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  }else{
    //if not a favorite, do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  }
}

$storiesLists.on('click', '.star', toggleStoryFavorite);