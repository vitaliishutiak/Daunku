axios.get('/goods')
.then(res=>{
    for(let el of res.data){
        $('.productsContainer').prepend(`<div class='plantsItem'>
        <div class='itemPants'><h4>name:</h4><p>${el.title}</p></div>
        <div class='itemPants'><h4>price:</h4><p>$${el.price}</p></div>
        <img src='../uploads/${el.filename}' width='50px' alt='img'>
        <div class='itemPants'><button class='deleteProductBtn' id='${el._id}'> <i class="fa-regular fa-trash-can"></i> Delete</button></div>
        </div>`)
    }
    $('.deleteProductBtn').click(function(e){
        let id = e.target.id
        axios.delete(`/goods/${id}`)
        .then(res=>{
            location.href='http://localhost:3000/admin/'
        })
    })
})



$('#addProductBtn').click(() => {
    const file = uploadButton.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', $('#productName').val());
    formData.append('price', $('#productPrice').val());
console.log(formData)
    

    axios.post('/upload', formData)
        .then((res) => {
            console.log(res.data);
            if (res.status === 201) {
                location.href = 'http://localhost:3000/admin/';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

$('#btn').click(() => {
    const file = $('#adminPhoto').prop('files')[0];
    const formData = new FormData();
    formData.append('image', file);

    axios.post('/upload-admin-photo', formData)
        .then((res) => {
            console.log(res.data);
            if (res.status === 201) {
                location.href = 'http://localhost:3000/admin/';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

axios.get('/admin-photo')
.then(res=>{
    $('.custom-uploadAdminPhoto-button i').empty()
    for(let el of res.data){
        // $('.custom-uploadAdminPhoto-button').append(`<div class='photoItem'> <img src='../upload-admin-photo/${el.filename}' width='50px' alt='img'></div>`)
    }
})

axios.get('/get-orders')
.then(res => {
    res.data.forEach(order => {
        let orderHTML = `
            <div class='buyItem'>
            <div class='contactsItems'>
                <div class='item1'><h4>Name:</h4><p>${order.name}</p></div>
                <div class='item1'><h4>Phone:</h4><p>${order.phone}</p></div>
                <div class='item1'><h4>Address:</h4><p>${order.addres}</p>
            </div> 
            </div>`;
            
        order.list.forEach(item => {
            orderHTML += `
                <div class='item'>
                <div class='item2'><h4>Product:</h4><p>${item.title}</p></div>
                <div class='item2'><h4>Price:</h4><p>$${item.price}</p></div>
                <div class='item2'><h4>Count:</h4><p>${item.sum}</p></div>
                    
                    
                    
                </div>`;
        });

        orderHTML += `
                <div class='item'>
                    <button id='${order._id}' class='confirmBtn'><i class="fa-solid fa-check"></i> Confirm</button>
                </div>
            </div>`;
        
        $('.ordersContainer').append(orderHTML);
    });

    $('.confirmBtn').click(function(e) {
        let id = e.target.id;
        axios.delete(`/confirm/${id}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err);
            });
    });
});

function showPage(pageClass) {
    $('.productsPage, .ordersPage, .contactsPage, .messagePage').css('display', 'none');
    $(`.${pageClass}`).css('display', 'flex');
}

$('#ordersBtn').click(() => {
    showPage('ordersPage');
});

$('#productsBtn').click(() => {
    showPage('productsPage');
});

$('#contactsBtn').click(() => {
    showPage('contactsPage');
});

$('#messageBtn').click(() => {
    showPage('messagePage');
});

$('#sendOnEmail').click(()=>{
    let data = {message:$('textarea').val()}

    

    axios.post('/send-msg',data)
    .then(res=>{
        console.log(res)
    })
    .catch(err => {
        console.error(err);
    });
})

$('#productsBtn').addClass('active');

$('header ul li').click(function() {
    $('header ul li').removeClass('active');
    $(this).addClass('active');
});

$('#addInfo').click(()=>{
    let data = {
        email:$('#email').val(),
        address:$('#address').val(),
        phone:$('#phone').val()
    }

    axios.post('/send-contacts',data)
    .then(res=>{
        console.log(res)
    })
    .catch(err => {
        console.error(err);
    });

})




