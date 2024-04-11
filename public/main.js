$("#burger").click(function () {
    $("header").css({
      height: "35vh",
      "flex-direction": "column",
      "justify-content": "space-between",
      display: "flex",
      backdropFilter: 'blur(1px)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)'
    });
    $("ul").css({
      "flex-direction": "column",
      display: "flex",
    });
    $("li").css("margin-top", "20px");
    $("#burger").css("display", "none");
    $("#exitBurger").css("display", "flex");
  });
  
  $("#exitBurger").click(function () {
    $("header").css({
      height: "10vh",
      "flex-direction": "row",
      "justify-content": "space-between;",
      backgroundColor: 'transparent' // Видаляємо бекграунд
    });
    $("#burger").css("display", "flex");
    $("#exitBurger, ul").css("display", "none");
  });