

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

const displayMovie = async( movie, side, templateRoot) => {

    const response = await axios.get("http://www.omdbapi.com/",{
        params: {
            apikey:'40b8bf6d',
            i:movie.imdbID,
        }

    })

    templateRoot.innerHTML = movieTemplate(response.data);

    if(side ==="right"){
        rightMovie = response.data;

    }
    else {
        leftMovie = response.data;
    }

    if(rightMovie && leftMovie) {
        
        compareMovie();

    }
    
           
   
}

const compareMovie = () => {
   const leftMovieTemplate = document.querySelectorAll('#templateRoot-left .notification');
   const rightMovieTemplate = document.querySelectorAll('#templateRoot-right .notification');

   leftMovieTemplate.forEach((element, index) => {
   
     const rightTemplate = rightMovieTemplate[index]
     
    let leftValue = parseFloat(element.dataset.value);
   
    let rightValue = parseFloat(rightTemplate.dataset.value);
   
    if(leftValue > rightValue){
        console.log("left", leftValue);
        console.log("right", rightValue);
        console.log("left > right? ", leftValue > rightValue);
        element.classList.add('is-primary');
        rightMovieTemplate[index].classList.add('is-secondary');

    } else {
        rightMovieTemplate[index].classList.add('is-primary');
        element.classList.add('is-secondary');
    }

    
   });


}



const movieTemplate = (movieDetail) => {
    const dollor = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const rating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, element) =>{
        const value = parseInt(element);
        if(isNaN(value)){
            return prev;
        }
        return prev + value;
    }, 0)
  
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
  + movieStatics(movieDetail, 'Awards', awards)
  + movieStatics(movieDetail, 'BoxOffice',dollor)
  + movieStatics(movieDetail, 'Metascore', metaScore) 
  + movieStatics(movieDetail, 'imdbRating', rating)
  + movieStatics(movieDetail, 'imdbVotes', imdbVotes);

}



const movieStatics = (movieDetail, movieStatics, dataValue) => {
  
    return `
    <article data-value =${dataValue} class="notification">
    <p class="title">${movieDetail[movieStatics]}</p>
    <p class="subtitle">${movieStatics}</p>
  </article>`
}




createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#autocomplete-left"),
   
    async onOptionSelect(data) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        const summary = document.querySelector("#templateRoot-left");
        displayMovie(data, "left", summary);
    },
   
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#autocomplete-right"),
   onOptionSelect(data) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        const summary = document.querySelector("#templateRoot-right");
        displayMovie(data, "right", summary);
   }
    
})



