

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
   const leftMovieTemplate = document.querySelectorAll('#templateRoot-left .notification');
   const rightMovieTemplate = document.querySelectorAll('#templateRoot-right .notification');

   leftMovieTemplate.forEach((element, index) => {
     console.log("left", element);
     const rightTemplate = rightMovieTemplate[index]
     console.log("right", rightTemplate);
    // let leftValue = element.dataset.value;
    // let rightValue = rightTemplate.dataset.value;;
    // console.log("left", leftValue);
    // console.log("right", rightValue);
    
   });
//    for(let i = 0; i < leftMovieTemplate.length; i++) {
//     if(leftMovieTemplate[i].hasAttribute('data-value') && rightMovieTemplate[i].hasAttribute('data-value')){
//         console.log("right value",rightMovieTemplate[i].getAttribute('data-value') );
//     }
//    }
 

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
    //console.log(awards);
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
  + movieStatics(movieDetail, 'Awards', awards)
  + movieStatics(movieDetail, 'BoxOffice',dollor)
  + movieStatics(movieDetail, 'Metascore', metaScore) 
  + movieStatics(movieDetail, 'imdbRating', rating)
  + movieStatics(movieDetail, 'imdbVotes', imdbVotes);

}

// const changeColor = (element, movieStatics) =>{
//     const section = document.querySelector(`${element}  .${movieStatics}`);
//     console.log("section", section);
//     // if(section.classList.contains('is-secondary')){
//     //     section.classList.remove('is-secondary');
//     //     section.classList.add('is-primary');
//     // }

// }

const movieStatics = (movieDetail, movieStatics, dataValue) => {
    //const color = isWinner? 'is-primary':'is-secondary';
    return `
    <article data-value =${dataValue} class="notification is-secondary">
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

