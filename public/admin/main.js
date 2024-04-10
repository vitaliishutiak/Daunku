axios.get('http://localhost:3000/goods')
.then(res=>{
    console.log(res.data)
    for(let el of res.data){
        $('.plantsContainer').prepend(`<div class='plantsItem'>
        ${el.title}
        ${el.price}
        </div>`)
    }
})