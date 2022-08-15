const createAutoComplete = ({
    root, 
    detailTemplateRoot, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData}) => {
    //console.log(onOptionSelect);
    const addAutoComplete = (root) => {
        root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input" type="text">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>`
    }
    
    addAutoComplete(root);
    
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const container = root.querySelector('.dropdown-content');
    const output = debounce(async (event) => {
        const result = await fetchData(event.target.value);
        if(!result.length){
            dropdown.classList.remove('is-active');
            return;
        }
        container.innerHTML = '';
      
            dropdown.classList.add('is-active');
            attachData(result, renderOption);   
    }, 1000)

    const attachData = (data, renderOption) => {

   
        data.forEach(element => {
           

            
            const movieContainer = document.createElement('a');
            movieContainer.setAttribute('class', 'dropdown-item');
            movieContainer.innerHTML = renderOption(element);
            movieContainer.addEventListener('click', async() => {
            input.value = inputValue(element);
         
            //const movieDetail = await displayMovie(element);
           
           onOptionSelect(element);
           
        })
        
           
          container.appendChild(movieContainer);
        });
    }
    
    input.addEventListener('input', output);
    
    document.addEventListener('click', event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    
    });
}