  importScripts("workerFakeDOM.js");
  importScripts('jquery-3.2.0.min.js');
  var myUrl = 'http://localhost';   
  var tabContainer = '';
  var tabContent = '';
  var currCount = 0;
  var items = [];
  var modals = [];

  function getCount() {
    $.getJSON(myUrl + '/_pos/api/index.php?action=getProductCount', function(i){
      if(currCount != i[0].productCount) {
        items.length = 0;
        modals.length = 0;
        currCount = i[0].productCount;
        getCategory()
      }
    });
    setTimeout('getCount()',1000);
  }

  getCount();

  function getCategory() {

    $.getJSON(myUrl + '/_pos/api/index.php?action=getAllCategory', function(data){
      var tabC = '';
      var tabC2 = '';
      for (var i = 0; i < data.length; i++) {
        let xx = parseInt(i) + 1;
        tabC += '<li class="tab' + (xx) + '"><label for="tab' + (i+1) + '">' + data[i].fldcategory + '</label></li>';
        tabC2 += '<div class="item_container tab' + (i+1) + '" id="item_container' + (i+1) + '"></div>'
        getCategoryItems(data[i].fldcategory);
      }
      tabContainer = tabC;
      tabContent = tabC2;
    });
  }
  function getCategoryItems(category) {
    var itemlist = '';
    var value = 1;
    var max = 0;
    $.getJSON(myUrl + '/_pos/api/index.php?action=getItemByCategory&category=' + category, function(data){
      for (var i = 0; i < data.length; i++) {
        // console.log(data);
        max = data[i].fldFoodQty;
        if (max<=0) {
          value = 0;
        } else {
          value = 1;
        }
        var background = "'data:image-jpg;base64," + data[i].fldImg + "'";
        modals.push("<div class='modal' id='modal-"+ data[i].fldCategory + (i+1) +"' aria-hidden='true'><div class='modal-dialog'><div class='modal-header'>"+data[i].fldFoodname+ " - &#8369; " + data[i].fldPrice +"<a href='#' class='btn-close' aria-hidden='true'>×</a></div><div class='modal-body'><center><img src=" + background + " style='width: 300px; height: 200px;'></center></div><div class='modal-footer'><div class='quantity'><input type='number' min='1' max='" + max + "' step='3' value='" + value +"' id='"+data[i].fldFoodID+data[i].fldFoodname+"'></div><div class='button-add'><a href='#' onClick='addtoCart(" +data[i].fldFoodID+ ",\""+data[i].fldFoodname+"\","+data[i].fldPrice+")' class='btn'>ADD TO TRAY</a></div></div></div></div>");
        itemlist += '<a href="#modal-'+data[i].fldCategory + (i+1)+'"><div class="box" style="background: url(' + background + '); background-size: 100% 100%; background-repeat: no-repeat;"></div></a>';
      }
      items.push(itemlist);
      getItems();
    });
  }
  function getItems() {
    var items2 = [];
    var id = []
    var modal = '<div class="modal" id="modal-discount" aria-hidden="true"><div class="modal-dialog"><div class="modal-header">DISCOUNT FORM<a href="#" class="btn-close" aria-hidden="true">×</a></div><div class="modal-body"><form id="discount-form" class="discount-form"><label for="name">Name</label><br><input type="text" name="name" id="name"><br><label for="number">ID Number</label><br><input type="text" name="number" id="number"><br><label for="discount-type">Discount Type</label><br><select name="discount" id="type"><option value="PWD">PWD</option><option value="SC">Senior Citizen</option></select></div><div class="modal-footer"><div class="button-add2"><center><a href="#" onClick="submit_discount()" class="btn">SUBMIT</a></center></form></div></div></div></div>';
    for(var i = 0; i<items.length; i++){
      items2.push(items[i]);
      let xx = parseInt(i);
      xx = i + 1;
      id.push('item_container'+(xx));
    }
    for(var i = 0; i<modals.length; i++){
      modal += modals[i];
    }
    postMessage([{'currCount':currCount,'tabContainer':tabContainer,'tabContent':tabContent,'items':items2,'id':id,'modals':modal}]);
  }