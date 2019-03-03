var app = new Vue({
    el: '#app',
    data: {
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
    mounted: function() {
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
            axios.post('/api/v1/watched', {
                _id: id
            })
                .then(function (response) {
                    self.searchResults = null;
                    self.success = true;
                    self.alert.message = "Successfully removed movie from collection!"
                })
                .catch(function (error) {
                    self.success = false;
                    self.alert.message = "An error occurred. Please try again later.";
                    console.log("Add Error: ", error);
                })
        },
        randomMovie: function () {
            var random = randomNumber(0,this.movies.length - 1);
            console.log(random);
            this.selectedMovie = this.movies[random]

        },
        searchOmdb: function () {
            var self = this;
            axios.get('http://www.omdbapi.com/?s=' + this.searchStr + '&apikey=a82a91b7')
                .then(function (response) {
                    self.searchResults = response;
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        selectEntry: function (res) {
            var self = this;
            axios.post('/api/v1/addmovie', res)
                .then(function (response) {
                    self.searchResults = null;
                    self.success = true;
                    self.alert.message = "Successfully add " + res.Title + " to movie list!"
                })
                .catch(function (error) {
                    self.success = false;
                    self.alert.message = "An error occurred. Please try again later.";
                    console.log("Add Error: ", error);
                })
        },
        limit: function (text) {
            return text.length > 20 ? text.slice(0, 20).trim() + '...' : text
        }
    }
});

function randomNumber(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}