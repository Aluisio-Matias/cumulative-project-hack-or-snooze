"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//display story submit form on click story 'submit'

function navSubmitStoryClick(evt){
  console.debug('navSubmitStoryClick', evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$navSubmitStory.on('click', navSubmitStoryClick);

/* when favorites is clicked, display favorite stories */

function navFavoritesClick(evt){
  console.debug('navFavoritesClick', evt);
  hidePageComponents();
  putFavoritesListOnPage();
}
$body.on('click', '#nav-favorites', navFavoritesClick);


/*******Display my stories on clicking my-stories ********/

function navMyStories(evt){
  console.debug('navMyStories', evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}
$body.on('click', '#nav-my-stories', navMyStories);


/***** Show login/signup on click on 'login' */

function navLoginClick(evt){
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on('click', navLoginClick);


/******Hide everything except the profile when clicking profile ***/

function navProfileClick(evt){
  console.debug('navProfileClick', evt);
  hidePageComponents();
  $userProfile.show();
}
$navUserProfile.on('click', navProfileClick);


/****When a user is logged in, update the navbar to reflect it ***/

function updateNavOnLogin(){
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}