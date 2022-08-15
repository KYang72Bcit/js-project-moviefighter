//const res = require("express/lib/response");

autoCompleteConfig = {
    renderOption(data) {
        const {Title, Poster} = data;
            Poster ==="N/A"? '':Poster;
        return `
            <img src="${Poster}" alt="movie poster">
           ${Title}`;
        
    },
    

    inputValue(data) {
        return data.Title;
    },
    async fetchData (data) {
        const respone = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: '40b8bf6d',
                s: data,
    
            }
        });
        if(respone.data.Error) {
            return [];
        }
    
       else {return respone.data.Search;}
    }

}

let leftMovie;
let rightMovie;

const displayMovie = async( movie, side) => {
    //console.log("movie", movie);
    const response = await axios.get("http://www.omdbapi.com/",{
        params: {
            apikey:'40b8bf6d',
            i:movie.imdbID,
        }

    })
    if(side ==="right"){
        rightMovie = response.data;

    }
    else {
        leftMovie = response.data;
    }

    if(rightMovie && leftMovie) {
        //console.log("both movies are ready");
        compareMovie();

    }
    
           
    //const movieDetailHTML = onOptionSelect(movieDetail);
   
    //detailContainer.innerHTML = movieDetailHTML;
    return response.data;
}

const compareMovie = () => {
    //console.log('start to compare');
    let leftDetailTemplate = '';
    let rightDetailTemplate = '';
    const compaireList = ['BoxOffice','Metascore','imdbRating','imdbVotes'];
    compaireList.forEach( element => {
        const leftElement = leftMovie[element];
        const rightElement = rightMovie[element];
        if(parseInt(leftElement) > parent(rightElement)){
            leftDetailTemplate += movieStatics(leftMovie, element, true);
            rightDetailTemplate += movieStatics(rightMovie, element, false);
        } else {
            leftDetailTemplate += movieStatics(leftMovie, element, false);
            rightDetailTemplate += movieStatics(rightMovie, element, true);
        }
       
        

        
    })
    return {
        leftDetailTemplate,
        rightDetailTemplate
    }


}

//console.log("leftMove", leftMovie);
//console.log("rightMovie", rightMovie);

const movieTemplate = (movieDetail) => {
    //console.log("movieDetail", movieDetail);
    return `
    <artical class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" alt="">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </artical> ` 
//   + movieStatics(movieDetail, 'Awards')
//   + movieStatics(movieDetail, 'BoxOffice',true)
//   + movieStatics(movieDetail, 'Metascore') 
//   + movieStatics(movieDetail, 'imdbRating')
//   + movieStatics(movieDetail, 'imdbVotes');

}

const movieStatics = (movieDetail, movieStatics, isWinner) => {
    const color = isWinner? 'is-primary':'is-secondary';
    return `
    <article class="notification ${color}">
    <p class="title">${movieDetail[movieStatics]}</p>
    <p class="subtitle">${movieStatics}</p>
  </article>`
}




createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#autocomplete-left"),
    //detailTemplateRoot: document.querySelector("#templateRoot-left")
    async onOptionSelect(data) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        const summary = document.querySelector("#templateRoot-left")
        const information = await displayMovie(data, "left");
        summary.innerHTML =  movieTemplate(information);},
   
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#autocomplete-right"),
    async onOptionSelect(data) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        const summary = document.querySelector("#templateRoot-right");
        const information = await displayMovie(data, "right");
        summary.innerHTML = movieTemplate(information);},
    
})

// = document.querySelectorAll('.dropdown-content >a');

