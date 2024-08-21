const currentYear = (new Date()).getFullYear();
$('.dateNow').text(currentYear)

$("#burger").click(function () {
    $("header").css({
      height: "35vh",
      "flex-direction": "column",
      "justify-content": "space-between",
      display: "flex",
      backdropFilter: 'blur(1px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    });
    $("ul").css({
      "flex-direction": "column",
      display: "flex",
    });
    $("li").css("margin-top", "20px");
    $("#burger").css("display", "none");
    $("#exitBurger").css("display", "flex");
    $('.cartContainer').css({marginTop: '10px'})


  });
  
  $("#exitBurger").click(function () {
    $("header").css({
      height: "10vh",
      "flex-direction": "row",
      "justify-content": "space-between;",
      backgroundColor: 'transparent'
    });
    $("#burger").css("display", "flex");
    $("#exitBurger, ul").css("display", "none");
    $('.cartContainer').css({marginTop: '0'})
  });


  let lastScrollTop = 0;

  $(window).scroll(function () {
    let st = $(this).scrollTop();
    if (st > lastScrollTop && st > 0) {
      $("header").css({ backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'});
    } else if (st === 0) {
      $("header").css("backgroundColor", "transparent");
    }
  });

  let count = 0;
  axios.get('/goods')
  .then(res => {
    for (let el of res.data) {
      $('.productCardContainer').prepend(`<div class='productCard'>
      <img src='../uploads/${el.filename}' width='240px' style='margin-top:-50px' alt='img'>
        <div class="productCardContent">
          <h4>${el.title}</h4>
          <div class='starContainer'>
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <h4>$${el.price}</h4> 
          <button class='buyProductBtn' id='${el._id}'><i class="fa-solid fa-plus"></i> Add</button>
        </div>     
      </div>`);
    }

    $('.buyProductBtn').click(function(e) {
      let id = e.target.id;
      let db = JSON.parse(localStorage.getItem('db')) || [];
      let existingProduct = db.find(product => product._id === id);
  
      if (existingProduct) {
          
         existingProduct.sum++;
      } else {
          
          for (let el of res.data) {
              if (el._id == id) {
                  db.push({
                      _id: el._id,
                      title: el.title,
                      price: el.price,
                      sum: 1
                  });
              }
          }
      }
  
      localStorage.setItem('db', JSON.stringify(db));
      show();
  });
  })





function show() {
  let db = JSON.parse(localStorage.getItem('db')) || [];
  
  let count = db.length;
  let totalAmount = 0;
  $('.popapProductContainer').empty();
  
  for (let el of db) {
    $('.popapProductContainer').prepend(`<div class='saleProductItem'>
      <div class='item'><h4>${el.title} </h4></div>
      <div class='item'><h4>$${el.price}</h4></div>
      <div class='item'><div class='sum'>${el.sum}</div></div>
      <div class='item'>
      <button id='${el._id}' class='deletProduct'>
      <i class="fa-regular fa-trash-can"></i>delete
      </button>
      </div>
    </div>`);
    totalAmount += el.price*el.sum
  }
  $('.totalAmount').text('$'+totalAmount)
  $('.count').text(count);
}

show();

$('.popapProductContainer').on('click', '.deletProduct', function(e) {

  let id = e.target.id;

  let db = JSON.parse(localStorage.getItem('db')) || [];
  let newDb = [];


  for (let el of db) {
    if (el._id !== id) {
      newDb.push(el);
      count --
    }
    $('.count').text(count);
  }

  localStorage.setItem('db', JSON.stringify(newDb));
 
  show();

});


$("#buyBtn").click(function () {
  let db = JSON.parse(localStorage.getItem('db')) || [];

  let orderData = {
    name: $('#name').val(),
    phone: $('#phone').val(),
    addres: $('#addres').val(),
    list:db
  };

  if(orderData.name != '' && orderData.phone != '' && orderData.addres != '' && db.length > 0){
    axios.post('/orders', orderData)
    .then(res => {
      console.log(res);
      localStorage.removeItem('db');
      $('.cardPopap').css('display', 'none');
        showNotification('Order confirmed!', notificationColor.success);
      setTimeout(function () {
        location.reload('http://localhost:3000');
      }, 2000);
      
    })
    .catch(err => {
      console.error(err);
     
    });
  }else{
    showNotification('Error occurred while placing order', notificationColor.error);
  }

  
});



$('.cartContainer').click(() => {
  $('.cardPopap').css('right','0');
});
$('#exitPopap').click(()=>{
  $('.cardPopap').css('right','-23%');
})
// КАСТОМНИЙ ПОПАП

let notificationColor = {
  success: "#2abd33",
  error: "#e63c30",
};


function showNotification(msg, bg) {
  $(".notificationPopap").css("display", "flex");
  $(".notificationPopap").css("backgroundColor", bg);
  $(".notificationPopap").text(msg);
  setTimeout(function () {
    $(".notificationPopap").css("display", "none");
  }, 3000);
}

// ВІДДПРАВКА НА СЕРВЕР ДАНІ EMAIL

let mailData;

$('#mailBtn').click(function(){
    mailData = {
        email: $('#email').val(),
        code: Math.floor(Math.random() * 1000)
    };
    if(mailData.email != ''){
      $('.securityPopap').css('display','flex')
      axios.post('/send-code', mailData)
      .then(res => {
      }).catch(err => {
        console.error(err);
      });
    }else{
      showNotification('write email', notificationColor.success)
    }
    
});

$('#sendCode').click(() => {
    let textCode = $('#textCode').val();
    if (textCode == mailData.code && textCode != '') {
        axios.post('/send-mail', mailData)
            .then(res => {
                showNotification('email sent', notificationColor.success)
                $('.securityPopap').css('display','none')
            }).catch(err => {
              console.error(err);
            });
    } else {
        showNotification('wrong code', notificationColor.error)
    }
});



// ОТРИМАННЯ З СЕРВЕРА КОНТАКТНИХ ДАНИХ ДЛЯ САЙТУ

axios.get('/get-contacts')
.then(res=>{
    console.log(res.data)
    for(let el of res.data){
      $('.footerAddress').append(`<div class='addressItem'>${el.address}</div>`)
      $('.footerEmail').append(`<div class='emailItem'>${el.email}</div>`)
      $('.footerPhone').append(`<div class='phoneItem'>${el.phone}</div>`)
    }
})