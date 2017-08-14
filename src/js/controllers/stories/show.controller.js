angular
  .module('groupProject')
  .controller('StoryShowCtrl', StoryShowCtrl);

StoryShowCtrl.$inject =['Story', '$stateParams', 'CurrentUserService', '$http', '$state'];
function StoryShowCtrl(Story, $stateParams, CurrentUserService, $http, $state){
  const vm = this;
  vm.story = Story.get({id: $stateParams.id});
  vm.refreshMe = refreshMe;

  if (vm.story !== undefined) {
    vm.text = Story.query();
    vm.text
      .$promise
      .then(function(story) {
        vm.authorId = story[0];
        vm.actualAuthorId = vm.authorId.createdBy.id;
        if (vm.actualAuthorId === CurrentUserService.currentUser.id) {
          console.log('Im true');
          vm.canRefresh = true;
        } else {
          vm.canRefresh = false;
        }
      });
  }
  function refreshMe() {
    $http
      .get('https://api.unsplash.com/photos/random?client_id=6486f6a95a6e765711b9ee1b7accf318606fffc506b7769da674d6d51d44a9ba&featured=true')
      .then((response) => {
        // console.log(response.data.urls.full);
        vm.story.image = response.data.urls.full;
      })
      .then(() => {
        Story
          .update(vm.story)
          .$promise
          .then(() =>{
            // console.log(story);
            // console.log(vm.story);
            $state.go('storiesShow', $stateParams);
          });
      });
  }
}