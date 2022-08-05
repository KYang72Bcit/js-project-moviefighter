const fetchData = async () => {
    const respone = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '40b8bf6d',
            s: 'avengers'

        }
    });

    console.log(respone.data);
}
fetchData();
