
var posts = [
    {
      name: "[Linux] Trải nghiệm linux",
      link: "./trai-nghiem-linux/"
    },
    {
      name: "[Jasper Report] Giới hạn nhãn hiển thị trên biểu đồ",
      link: "./gioi-han-nhan-hien-thi-tren-bieu-do/"
    },
    {
      name: "[SQL] Optimization",
      link: "./sql-optimization/"
    }
];

var loadPost = function () {
    var root = document.getElementById("posts");
    posts.forEach(function(e){
        var tag_li = document.createElement("li");
        var tag_a = document.createElement("a");
        var textNode = document.createTextNode(e.name);
        tag_a.href = e.link;
        tag_a.appendChild(textNode);
        tag_li.appendChild(tag_a);
        root.appendChild(tag_li);
    });
};

window.onload = loadPost;
