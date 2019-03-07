var app = new Vue({
    el: '#app',
    data: {
        loading: false,
        movies: null,
        viewMovies: false,
        selectedMovie: null,
        searchResults: null,
        searchStr: '',
        success: null,
        alert: {
            message: ''
        }
    },
    mounted: function  () {
        var self = this;
        axios.get('/api/v1/getmovies')
            .then(function (response) {
                self.movies = response;
            })
            .catch(function (error) {
                console.log(error);
            });

    },
    methods: {
        watchedMovie: function (id) {
            var self = this;
            self.loading = true;

            axios.post('/api/v1/watched', {
                _id: id
            })
                .then(function (response) {
                    self.loading = false;
                    self.searchResults = null;
                    showMessage(self, true, "Successfully removed movie from collection!");
                    for (let i = 0; i < self.movies.length; i++) {
                        if (self.movies[i]._id == id) {
                            self.movies.splice(i, 1);
                        }
                    }
                    dismissMessage(self)
                })
                .catch(function (error) {
                    self.loading = false;
                    showMessage(self, false, "An error occurred. Please try again later.", error);
                    dismissMessage(self)
                });
        },
        randomMovie: function () {
            this.viewMovies = false;
            this.searchResults = null;
            var random = randomNumber(0, this.movies.length - 1);
            this.selectedMovie = this.movies[random]

        },
        searchOmdb: function () {
            var self = this;

            self.loading = true;

            if (self.searchStr == '') {
                self.searchResults = null;
                return;
            }

            self.selectedMovie = null;
            self.viewMovies = false;


            axios.get('http://www.omdbapi.com/?s=' + this.searchStr + '&apikey=a82a91b7')
                .then(function (response) {
                    self.searchResults = response;
                    self.loading = false;
                })
                .catch(function (error) {
                    self.loading = false;
                    console.log(error);
                });

        },
        addToDB: function (res) {
            var self = this;
            self.loading = true;
            axios.post('/api/v1/addmovie', res)
                .then(function (response) {
                    for (let i = 0; i < self.searchResults.Search.length; i++) {
                        if (self.searchResults.Search[i].imdbID == res.imdbID) {
                            self.searchResults.Search.splice(i, 1);
                        }
                    }
                    self.loading = false;
                    self.success = true;
                    showMessage(self, true, "Successfully add " + res.Title + " to movie list!");
                    self.movies.push(response);
                    dismissMessage(self)
                })
                .catch(function (error) {
                    self.loading = false;
                    showMessage(self, false, "An error occurred. Please try again later.", error);
                    dismissMessage(self)
                });
        }
    }
});

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function dismissMessage(self) {
    setTimeout(function () {
        self.success = null;
    }, 5000)
}

function showMessage(self, success, msg, err) {
    self.success = success;
    self.alert.message = msg;
    if (err){
        console.log("Error: ", err);
    }
}